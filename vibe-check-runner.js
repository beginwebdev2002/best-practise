import { Project, SyntaxKind } from 'ts-morph';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

let ai;
try {
  const { GoogleGenAI } = await import('@google/genai');
  ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
} catch (e) {
  console.warn('Could not initialize GoogleGenAI', e);
}

const SCORES = {
  ARCH: 40,
  TYPE: 30,
  SECURITY: 20,
  EFFICIENCY: 10,
};

export async function fileOrDirExists(filePath) {
  try {
    await fsPromises.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getModifiedFiles() {
  try {
    const output = execFileSync('sh', ['-c', 'git log --since="24 hours ago" --name-only --pretty=format: | sort | uniq'], { encoding: 'utf-8' });
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
    text = text.replace(/^\`\`\`[a-z]*\n/gm, '').replace(/\`\`\`$/gm, '').trim();
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

  const decorators = [];
  const classDeclarations = [];
  const moduleSpecifiers = [];
  let missingTypes = 0;
  let anyKeywordsCount = 0;
  let explicitMissingTypes = 0;
  let tryStatementsCount = 0;
  let awaitExpressionsCount = 0;
  let stringLiterals = [];
  let callExpressionsText = [];

  sourceFile.forEachDescendant(node => {
    const kind = node.getKind();
    if (kind === SyntaxKind.Decorator) decorators.push(node.getName());
    else if (kind === SyntaxKind.ClassDeclaration) classDeclarations.push(node);
    else if (kind === SyntaxKind.ImportDeclaration) moduleSpecifiers.push(node.getModuleSpecifierValue());
    else if (kind === SyntaxKind.Parameter) {
      if (!node.getTypeNode()) {
        missingTypes++;
        explicitMissingTypes++;
      }
    }
    else if (kind === SyntaxKind.AnyKeyword) anyKeywordsCount++;
    else if (kind === SyntaxKind.TryStatement) tryStatementsCount++;
    else if (kind === SyntaxKind.AwaitExpression) awaitExpressionsCount++;
    else if (kind === SyntaxKind.StringLiteral) stringLiterals.push(node.getText());
    else if (kind === SyntaxKind.CallExpression) callExpressionsText.push(node.getText());
  });

  if (tech === 'nestjs') {
      if (!decorators.includes('Injectable') && !decorators.includes('Controller')) {
          score.arch -= 10;
      }
      let hasValidation = false;
      for (const classDecl of classDeclarations) {
          const classDecorators = classDecl.getProperties().flatMap(p => p.getDecorators().map(d => d.getName()));
          if (classDecorators.some(name => name.startsWith('Is'))) {
             hasValidation = true;
             break;
          }
      }
      if (!hasValidation && decorators.length > 0) {
          score.arch -= 10;
      }
  } else if (tech === 'angular') {
      if (!decorators.includes('Component') && !decorators.includes('Injectable')) {
          score.arch -= 10;
      }
      if (decorators.includes('Input') || decorators.includes('Output')) {
          score.arch -= 10;
      }
  }

  const hasFSD = moduleSpecifiers.some(spec => spec.includes('features/') || spec.includes('entities/') || spec.includes('shared/') || spec.includes('domain/'));
  if (!hasFSD) {
     score.arch -= 10;
  }

  if (missingTypes > 0) {
      score.type -= (5 * missingTypes) + 10;
  }
  if (explicitMissingTypes > 0) {
      score.type -= 5 * explicitMissingTypes;
  }

  if (anyKeywordsCount > 0) {
    score.type -= 15 * anyKeywordsCount;
  }

  if (awaitExpressionsCount > 0 && tryStatementsCount === 0) {
      score.type -= 10;
  }

  for (const text of stringLiterals) {
      if (text.includes('password') || text.includes('secret') || text.includes('token')) {
          score.security -= 20;
      }
  }

  for(const text of callExpressionsText) {
    if(text.includes('readFileSync') || text.includes('existsSync')) {
      score.efficiency -= 10;
    }
  }

  score.arch = Math.max(0, score.arch);
  score.type = Math.max(0, score.type);
  score.security = Math.max(0, score.security);
  score.efficiency = Math.max(0, score.efficiency);

  const total = score.arch + score.type + score.security + score.efficiency;
  return { total, breakdown: score };
}

export async function processFile(file, tempFilenameSuffix) {
  let tech = '';
  if (file.includes('/angular/')) tech = 'angular';
  else if (file.includes('/nestjs/')) tech = 'nestjs';
  else if (file.includes('/typescript/')) tech = 'typescript';
  else if (file.includes('/express/')) tech = 'express';
  else if (file.includes('/nodejs/')) tech = 'nodejs';
  else {
    const parts = file.split('/');
    if (parts.length > 1) {
      tech = parts[1];
    } else {
      return null;
    }
  }

  const mdContent = await fsPromises.readFile(file, 'utf-8');

  const suitePath = path.join('benchmarks', 'suites', `${tech}.json`);
  if (!await fileOrDirExists(suitePath)) {
    console.log(`No benchmark suite found for ${tech}. Skipping.`);
    return null;
  }

  const suiteConfig = JSON.parse(await fsPromises.readFile(suitePath, 'utf-8'));

  const generatedCode = await simulateAIGeneration(suiteConfig.golden_prompt, tech, mdContent);

  if (!generatedCode) {
    console.error(`Failed to generate code for ${tech}.`);
    return null;
  }

  const project = new Project();
  const sourceFile = project.createSourceFile(`temp_${tech}_${tempFilenameSuffix}.ts`, generatedCode, { overwrite: true });
  const { total: score, breakdown } = analyzeAST(sourceFile, tech);

  return { tech, score, breakdown, generatedCode };
}

export async function runVibeCheck() {
  console.log('Running Vibe-Check Runner...');

  const modifiedFiles = getModifiedFiles();
  if (modifiedFiles.length === 0) {
    console.log('No modified .md files found in frontend/ or backend/ within the last 24 hours.');
    return;
  }

  try {
    execFileSync('git', ['config', '--global', 'user.name', 'github-actions[bot]']);
    execFileSync('git', ['config', '--global', 'user.email', 'github-actions[bot]@users.noreply.github.com']);
  } catch (e) {
    console.warn('Failed to configure git user. If running locally, this is expected.');
  }

  // Group files by tech
  const filesByTech = {};
  for (const file of modifiedFiles) {
    if (!await fileOrDirExists(file)) continue;
    let tech = '';
    if (file.includes('/angular/')) tech = 'angular';
    else if (file.includes('/nestjs/')) tech = 'nestjs';
    else if (file.includes('/typescript/')) tech = 'typescript';
    else if (file.includes('/express/')) tech = 'express';
    else if (file.includes('/nodejs/')) tech = 'nodejs';
    else {
      const parts = file.split('/');
      if (parts.length > 1) tech = parts[1];
    }
    if (tech) {
      if (!filesByTech[tech]) filesByTech[tech] = [];
      filesByTech[tech].push(file);
    }
  }

  // 1. Process syncBenchmarks sequentially by tech
  for (const tech of Object.keys(filesByTech)) {
    const file = filesByTech[tech][0];
    const mdContent = await fsPromises.readFile(file, 'utf-8');
    await syncBenchmarks(tech, mdContent);
  }

  // 2. Concurrently execute simulateAIGeneration and analyzeAST
  const analysisPromises = [];
  for (const file of modifiedFiles) {
    if (!await fileOrDirExists(file)) continue;
    const tempSuffix = Math.random().toString(36).substring(7);
    analysisPromises.push(processFile(file, tempSuffix).then(res => ({ file, ...res })));
  }

  const results = await Promise.all(analysisPromises);

  // 3. Sequentially apply side-effects (Git operations, GitHub CLI)
  for (const result of results) {
    if (!result || !result.tech) continue;
    const { file, score, breakdown, generatedCode } = result;

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
        try { execFileSync('sh', ['-c', 'git add benchmarks/suites/*.json benchmarks/criteria/*.json 2>/dev/null || true']); } catch (e) {}
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

      const longestBacktickMatch = generatedCode.match(/`+/g);
      const longestBacktickCount = longestBacktickMatch ? Math.max(...longestBacktickMatch.map(m => m.length)) : 0;
      const fenceLength = Math.max(3, longestBacktickCount + 1);
      const fence = '`'.repeat(fenceLength);

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

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runVibeCheck().catch(console.error);
}
