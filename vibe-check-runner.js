import { Project, SyntaxKind } from 'ts-morph';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';
import { pathToFileURL } from 'node:url';
import { fileOrDirExists } from './.github/scripts/utils.js';

let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
} catch (e) {
  console.warn('Failed to initialize GoogleGenAI. Proceeding without it.', e);
}

const SCORES = {
  ARCH: 40,
  TYPE: 30,
  SECURITY: 20,
  EFFICIENCY: 10,
};

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

  const state = {
    decoratorNames: [],
    hasValidation: false,
    imports: [],
    missingTypes: 0,
    explicitParams: 0,
    explicitParamsNoType: 0,
    anyKeywords: 0,
    hasTry: false,
    hasAwait: false,
    securityViolations: 0,
    efficiencyViolations: 0
  };

  sourceFile.forEachDescendant(node => {
    const kind = node.getKind();

    if (kind === SyntaxKind.Decorator) {
      state.decoratorNames.push(node.getName());
    }

    if (kind === SyntaxKind.ClassDeclaration) {
      const classDecorators = node.getProperties().flatMap(p => p.getDecorators().map(d => d.getName()));
      if (classDecorators.some(name => name.startsWith('Is'))) {
        state.hasValidation = true;
      }
    }

    if (kind === SyntaxKind.ImportDeclaration) {
      state.imports.push(node.getModuleSpecifierValue());
    }

    if (kind === SyntaxKind.Parameter) {
      state.explicitParams++;
      if (!node.getTypeNode()) {
        state.missingTypes++;
        state.explicitParamsNoType++;
      }
    }

    if (kind === SyntaxKind.AnyKeyword) {
      state.anyKeywords++;
    }

    if (kind === SyntaxKind.TryStatement) {
      state.hasTry = true;
    }

    if (kind === SyntaxKind.AwaitExpression) {
      state.hasAwait = true;
    }

    if (kind === SyntaxKind.StringLiteral) {
      const text = node.getText();
      if (text.includes('password') || text.includes('secret') || text.includes('token')) {
        state.securityViolations++;
      }
    }

    if (kind === SyntaxKind.CallExpression) {
      if (node.getText().includes('readFileSync')) {
        state.efficiencyViolations++;
      }
    }
  });

  if (tech === 'nestjs') {
      if (!state.decoratorNames.includes('Injectable') && !state.decoratorNames.includes('Controller')) {
          score.arch -= 10;
      }
      if (!state.hasValidation && state.decoratorNames.length > 0) {
          score.arch -= 10;
      }
  } else if (tech === 'angular') {
      if (!state.decoratorNames.includes('Component') && !state.decoratorNames.includes('Injectable')) {
          score.arch -= 10;
      }
      if (state.decoratorNames.includes('Input') || state.decoratorNames.includes('Output')) {
          score.arch -= 10;
      }
  }

  const hasFSD = state.imports.some(spec => spec.includes('features/') || spec.includes('entities/') || spec.includes('shared/') || spec.includes('domain/'));
  if (!hasFSD) {
     score.arch -= 10;
  }

  if (state.missingTypes > 0) {
      score.type -= (5 * state.missingTypes);
      score.type -= 10;
  }

  if (state.explicitParamsNoType > 0) {
      score.type -= (5 * state.explicitParamsNoType);
  }

  if (state.anyKeywords > 0) {
    score.type -= 15 * state.anyKeywords;
  }

  if (state.hasAwait && !state.hasTry) {
      score.type -= 10;
  }

  if (state.securityViolations > 0) {
      score.security -= 20;
  }

  if (state.efficiencyViolations > 0) {
      score.efficiency -= 10;
  }

  score.arch = Math.max(0, score.arch);
  score.type = Math.max(0, score.type);
  score.security = Math.max(0, score.security);
  score.efficiency = Math.max(0, score.efficiency);

  const total = score.arch + score.type + score.security + score.efficiency;
  return { total, breakdown: score };
}

function getSafeBackticks(content) {
  const matches = content.match(/\`{3,}/g);
  let maxLen = 2;
  if (matches) {
    for (const match of matches) {
      if (match.length > maxLen) maxLen = match.length;
    }
  }
  return '\`'.repeat(maxLen + 1);
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

  // To prevent race conditions in syncBenchmarks, we need to process them sequentially
  // or grouped by technology. Since this logic involves LLMs and fs writing to the same
  // technology schema file, we'll process the files sequentially up to the AI code generation stage.
  // We can still run the pure generation and AST analysis concurrently.

  const filesToProcess = [];
  const processedTechs = new Set();

  // Phase 1: Sequential metadata collection & syncing
  for (const file of modifiedFiles) {
    if (!await fileOrDirExists(file)) {
      filesToProcess.push({ file, exists: false });
      continue;
    }

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
        filesToProcess.push({ file, skipped: true });
        continue;
      }
    }

    const mdContent = await fsPromises.readFile(file, 'utf-8');

    // Only sync benchmarks for a technology once per run to avoid race conditions
    if (!processedTechs.has(tech)) {
      await syncBenchmarks(tech, mdContent);
      processedTechs.add(tech);
    }

    filesToProcess.push({ file, exists: true, tech, mdContent });
  }

  // Phase 2: Concurrent code generation and analysis
  const analysisResults = await Promise.all(filesToProcess.map(async (fileData) => {
    if (!fileData.exists || fileData.skipped) {
      return fileData;
    }

    const { file, tech, mdContent } = fileData;
    const suitePath = path.join('benchmarks', 'suites', `${tech}.json`);

    if (!await fileOrDirExists(suitePath)) {
      return { file, skippedSuite: true, tech };
    }

    const suiteConfig = JSON.parse(await fsPromises.readFile(suitePath, 'utf-8'));
    const generatedCode = await simulateAIGeneration(suiteConfig.golden_prompt, tech, mdContent);

    if (!generatedCode) {
      return { file, failedGen: true, tech };
    }

    const project = new Project();
    const tempFileName = `temp_${tech}_${Date.now()}_${Math.floor(Math.random() * 1000)}.ts`;
    const sourceFile = project.createSourceFile(tempFileName, generatedCode, { overwrite: true });

    const { total: score, breakdown } = analyzeAST(sourceFile, tech);

    return { file, score, breakdown, generatedCode, success: true };
  }));

  // Phase 3: Sequential side-effects (Git ops, GitHub CLI)
  for (const result of analysisResults) {
    if (!result) continue;
    const { file } = result;

    console.log(`Processing ${file}...`);
    if (!result.success) {
      if (!result.exists) console.log(`File ${file} does not exist. Skipping.`);
      if (result.skipped) console.log(`Skipping ${file} (unrecognized tech).`);
      if (result.skippedSuite) console.log(`No benchmark suite found for ${result.tech}. Skipping.`);
      if (result.failedGen) console.error(`Failed to generate code for ${result.tech}.`);
      continue;
    }

    const { score, breakdown, generatedCode } = result;

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

        // Ensure explicit staging as required by rules
        const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf-8' });
        if (status.includes(file) || status.includes('benchmarks/')) {
           execFileSync('git', ['commit', '-m', '[chore: fidelity-pass]']);
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
      const fence = getSafeBackticks(generatedCode);
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
