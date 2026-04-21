import { Project, SyntaxKind } from 'ts-morph';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';

let ai;
try {
  if (process.env.GOOGLE_AI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
  }
} catch (e) {
  console.warn('Failed to initialize GoogleGenAI:', e);
}

// Constants for scoring

export async function fileOrDirExists(filePath) {
  try {
    await fsPromises.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

const SCORES = {
  ARCH: 40,
  TYPE: 30,
  SECURITY: 20,
  EFFICIENCY: 10,
};

export function getModifiedFiles() {
  try {
    const output = execFileSync('git', ['log', '--since=24 hours ago', '--name-only', '--pretty=format:'], { encoding: 'utf-8' });
    const allFiles = output.split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)
      .filter(f => f.endsWith('.md'))
      .filter(f => f.startsWith('frontend/') || f.startsWith('backend/'));

    return [...new Set(allFiles)];
  } catch (err) {
    console.error('Error finding modified files:', err);
    return [];
  }
}

export async function syncBenchmarks(tech, mdContent, retries = 5, delay = 10000) {
  if (!ai) return;
  try {
    const prompt = `Based on the following documentation:\n\n${mdContent}\n\n1. Generate a "Golden Prompt" (a comprehensive instruction for generating a typical module using this technology) in JSON format: {"golden_prompt": "...", "tech": "${tech}"}\n2. Generate a JSON Schema for TS-Morph AST validation rules enforcing DDD/FSD layers and strict typing for this technology. The generated JSON schema must explicitly follow a nested structure compatible with \`analyzeAST\`. Format: {"$schema": "...", "type": "object", "properties": {"forbidden_types": {"contains": {"enum": ["any"]}}}}.\n\nRespond strictly with ONLY a JSON array containing these two objects in order. No markdown wrappers.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
    });
    let text = response.text || '';
    text = text.replace(/^\`\`\`[a-z]*\n/gm, '').replace(/\`\`\`$/gm, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.warn(`Failed to parse AI response for benchmarks/schema for ${tech}. Using existing if available.`);
      return;
    }

    if (Array.isArray(parsed) && parsed.length >= 2) {
      const suiteDir = path.join('benchmarks', 'suites');
      const criteriaDir = path.join('benchmarks', 'criteria');
      if (!await fileOrDirExists(suiteDir)) await fsPromises.mkdir(suiteDir, { recursive: true });
      if (!await fileOrDirExists(criteriaDir)) await fsPromises.mkdir(criteriaDir, { recursive: true });

      await fsPromises.writeFile(path.join(suiteDir, `${tech}.json`), JSON.stringify(parsed[0], null, 2));
      await fsPromises.writeFile(path.join(criteriaDir, `${tech}-schema.json`), JSON.stringify(parsed[1], null, 2));
      console.log(`Autonomously generated benchmark suites and criteria for ${tech}.`);
    }
  } catch (err) {
    if (err.status === 429 || err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      if (retries > 0) {
        console.warn(`Rate limited during sync. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return syncBenchmarks(tech, mdContent, retries - 1, delay * 2);
      } else {
        console.error('Max retries reached for syncBenchmarks.');
      }
    }
    console.error(`Error syncing benchmarks for ${tech}:`, err);
  }
}

export async function simulateAIGeneration(goldenPrompt, tech, mdContent, retries = 5, delay = 10000) {
  if (!ai) return '';
  try {
    const prompt = `${goldenPrompt}\n\nConstraints and instructions from the following documentation:\n\n${mdContent}\n\nGenerate ONLY raw code. No markdown formatting, no explanations.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
    });
    let text = response.text || '';
    text = text.replace(/^```[a-z]*\n/gm, '').replace(/```$/gm, '').trim();
    return text;
  } catch (err) {
    if (err.status === 429 || err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      if (retries > 0) {
        console.warn(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return simulateAIGeneration(goldenPrompt, tech, mdContent, retries - 1, delay * 2);
      } else {
        console.error('Max retries reached for AI generation.');
      }
    }
    console.error('Error generating AI code:', err);
    return '';
  }
}

export function analyzeAST(sourceFile, tech) {
  let score = {
    arch: SCORES.ARCH,
    type: SCORES.TYPE,
    security: SCORES.SECURITY,
    efficiency: SCORES.EFFICIENCY,
  };

  const decoratorNames = [];
  let hasValidation = false;
  let missingTypes = 0;
  let anyKeywordCount = 0;
  let tryStatementCount = 0;
  let awaitExpressionCount = 0;

  sourceFile.forEachDescendant(node => {
    const kind = node.getKind();
    if (kind === SyntaxKind.Decorator) {
      decoratorNames.push(node.getName());
    } else if (kind === SyntaxKind.ClassDeclaration) {
      const classDecorators = node.getProperties().flatMap(p => p.getDecorators().map(d => d.getName()));
      if (classDecorators.some(name => name.startsWith('Is'))) {
        hasValidation = true;
      }
    } else if (kind === SyntaxKind.Parameter) {
      if (!node.getTypeNode()) {
        missingTypes++;
        score.type -= 5;
      }
    } else if (kind === SyntaxKind.AnyKeyword) {
      anyKeywordCount++;
    } else if (kind === SyntaxKind.TryStatement) {
      tryStatementCount++;
    } else if (kind === SyntaxKind.AwaitExpression) {
      awaitExpressionCount++;
    } else if (kind === SyntaxKind.StringLiteral) {
      const text = node.getText();
      if (text.includes('password') || text.includes('secret') || text.includes('token')) {
        score.security -= 20;
      }
    } else if (kind === SyntaxKind.CallExpression) {
      if (node.getText().includes('readFileSync')) {
        score.efficiency -= 10;
      }
    }
  });

  if (tech === 'nestjs') {
      if (!decoratorNames.includes('Injectable') && !decoratorNames.includes('Controller')) {
          score.arch -= 10;
      }
      if (!hasValidation && decoratorNames.length > 0) {
          score.arch -= 10;
      }
  } else if (tech === 'angular') {
      if (!decoratorNames.includes('Component') && !decoratorNames.includes('Injectable')) {
          score.arch -= 10;
      }
      if (decoratorNames.includes('Input') || decoratorNames.includes('Output')) {
          score.arch -= 10;
      }
  }

  const imports = sourceFile.getImportDeclarations();
  const moduleSpecifiers = imports.map(imp => imp.getModuleSpecifierValue());
  const hasFSD = moduleSpecifiers.some(spec => spec.includes('features/') || spec.includes('entities/') || spec.includes('shared/') || spec.includes('domain/'));

  if (!hasFSD) {
     score.arch -= 10;
  }

  if (missingTypes > 0) {
      score.type -= 10;
  }

  if (anyKeywordCount > 0) {
    score.type -= 15 * anyKeywordCount;
  }

  if (awaitExpressionCount > 0 && tryStatementCount === 0) {
      score.type -= 10;
  }

  score.arch = Math.max(0, score.arch);
  score.type = Math.max(0, score.type);
  score.security = Math.max(0, score.security);
  score.efficiency = Math.max(0, score.efficiency);

  const total = score.arch + score.type + score.security + score.efficiency;
  return { total, breakdown: score };
}

export async function runVibeCheck() {
  console.log('Running Vibe-Check Runner...');

  const modifiedFiles = getModifiedFiles();
  if (modifiedFiles.length === 0) {
    console.log('No modified .md files found in frontend/ or backend/ within the last 24 hours.');
    return;
  }

  const project = new Project();

  // Configure git user for commits
  try {
    execFileSync('git', ['config', '--global', 'user.name', 'github-actions[bot]']);
    execFileSync('git', ['config', '--global', 'user.email', 'github-actions[bot]@users.noreply.github.com']);
  } catch (e) {
    console.warn('Failed to configure git user. If running locally, this is expected.');
  }

  for (const file of modifiedFiles) {
    console.log(`Processing ${file}...`);

    if (!await fileOrDirExists(file)) {
      console.log(`File ${file} does not exist. Skipping.`);
      continue;
    }

    let tech = '';
    if (file.includes('/angular/')) tech = 'angular';
    else if (file.includes('/nestjs/')) tech = 'nestjs';
    else if (file.includes('/typescript/')) tech = 'typescript';
    else if (file.includes('/express/')) tech = 'express';
    else if (file.includes('/nodejs/')) tech = 'nodejs';
    else {
      // Fallback
      const parts = file.split('/');
      if (parts.length > 1) {
        tech = parts[1];
      } else {
        continue;
      }
    }

    const mdContent = await fsPromises.readFile(file, 'utf-8');

    await syncBenchmarks(tech, mdContent);

    const suitePath = path.join('benchmarks', 'suites', `${tech}.json`);
    if (!await fileOrDirExists(suitePath)) {
      console.log(`No benchmark suite found for ${tech}. Skipping.`);
      continue;
    }

    const suiteConfig = JSON.parse(await fsPromises.readFile(suitePath, 'utf-8'));

    const generatedCode = await simulateAIGeneration(suiteConfig.golden_prompt, tech, mdContent);

    if (!generatedCode) {
      console.error(`Failed to generate code for ${tech}.`);
      continue;
    }

    const sourceFile = project.createSourceFile(`temp_${tech}.ts`, generatedCode, { overwrite: true });
    const { total: score, breakdown } = analyzeAST(sourceFile, tech);

    console.log(`Fidelity Score for ${file}: ${score}%`);
    console.log(`Breakdown:`, breakdown);

    if (score >= 95) {
      console.log(`✅ Validation passed for ${file}. Updating badge and auto-committing.`);

      let content = await fsPromises.readFile(file, 'utf-8');
      if (!content.includes('[![Vibe-Coding Verified]')) {
         content = content.replace(/^# /, '[![Vibe-Coding Verified](https://img.shields.io/badge/Vibe--Coding-Verified-brightgreen?style=for-the-badge)](#)\n\n# ');
         await fsPromises.writeFile(file, content);
      }

      try {
        execFileSync('git', ['add', file]);
        try {
          execFileSync('git', ['add', 'benchmarks/suites/']);
          execFileSync('git', ['add', 'benchmarks/criteria/']);
        } catch (e) {}
        // Only commit if there are changes (badge might already be there)
        const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf-8' });
        if (status.includes(file) || status.includes('benchmarks/')) {
           execFileSync('git', ['commit', '-m', '[chore: benchmark-sync]']);
           execFileSync('git', ['push', 'origin', 'HEAD:main']);
        } else {
           console.log(`Badge already present in ${file}, skipping commit.`);
        }
      } catch (err) {
         console.error('Failed to commit or push:', err.message);
      }

    } else {
      console.error(`❌ Validation failed for ${file}. Score below 95%.`);

      const reportDir = path.join('benchmarks', 'logs');
      if (!await fileOrDirExists(reportDir)) await fsPromises.mkdir(reportDir, { recursive: true });

      const reportPath = path.join(reportDir, `violation-report.md`);
      const matchBackticks = generatedCode.match(/\`+/g);
      const maxBackticks = matchBackticks ? Math.max(...matchBackticks.map(b => b.length)) : 0;
      const fenceLength = Math.max(3, maxBackticks + 1);
      const fence = '\`'.repeat(fenceLength);

      const reportContent = `# Critical Violation Report\n\n> [!CAUTION]\n> Fidelity Score dropped below 95%.\n\n**File:** \`${file}\`\n**Fidelity Score:** ${score}%\n**Threshold:** 95%\n\n## Breakdown\n| Metric | Score |\n|---|---|\n| Arch Integrity | ${breakdown.arch} |\n| Type Safety | ${breakdown.type} |\n| Security | ${breakdown.security} |\n| Efficiency | ${breakdown.efficiency} |\n\n## Generated Code\n${fence}typescript\n${generatedCode}\n${fence}\n\nReview the AST rules.`;

      await fsPromises.writeFile(reportPath, reportContent);
      console.log(`Generated violation report: ${reportPath}`);

      try {
        execFileSync('gh', ['issue', 'create', '--title', `Critical Issue: Fidelity Gap for ${file}`, '--label', 'critical,bug', '--body-file', reportPath]);
        console.log(`Created GitHub Issue for ${file}`);
      } catch (err) {
        console.error('Failed to create GitHub Issue (gh cli might not be installed or authenticated):', err.message);
      }

      process.exitCode = 1;
    }
  }
}

import { pathToFileURL } from 'node:url';
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runVibeCheck().catch(console.error);
}