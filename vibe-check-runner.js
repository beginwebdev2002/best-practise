import { Project, SyntaxKind } from 'ts-morph';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';
import { pathToFileURL } from 'node:url';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

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
  try {
    const prompt = `Based on the following documentation:\n\n${mdContent}\n\n1. Generate a "Golden Prompt" (a comprehensive instruction for generating a typical module using this technology) in JSON format: {"golden_prompt": "...", "tech": "${tech}"}\n2. Generate a JSON Schema for TS-Morph AST validation rules enforcing DDD/FSD layers and strict typing for this technology. The generated JSON schema must explicitly follow a nested structure compatible with \`analyzeAST\`. Format: {"$schema": "...", "type": "object", "properties": {"forbidden_types": {"contains": {"enum": ["any"]}}}}.\n\nRespond strictly with ONLY a JSON array containing these two objects in order. No markdown wrappers.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/^```[a-z]*\n/gm, '').replace(/```$/gm, '').trim();

    const result = JSON.parse(rawText);

    const goldenPromptData = result[0];
    const schemaData = result[1];

    const suitesDir = path.join('benchmarks', 'suites');
    const criteriaDir = path.join('benchmarks', 'criteria');

    if (!await fileOrDirExists(suitesDir)) await fsPromises.mkdir(suitesDir, { recursive: true });
    if (!await fileOrDirExists(criteriaDir)) await fsPromises.mkdir(criteriaDir, { recursive: true });

    await fsPromises.writeFile(path.join(suitesDir, `${tech}.json`), JSON.stringify(goldenPromptData, null, 2));
    await fsPromises.writeFile(path.join(criteriaDir, `${tech}-schema.json`), JSON.stringify(schemaData, null, 2));

    console.log(`✅ Synchronized benchmarks for ${tech}`);
  } catch (err) {
    if (err.status === 429 || err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      if (retries > 0) {
        console.warn(`Rate limited during syncBenchmarks. Retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return syncBenchmarks(tech, mdContent, retries - 1, delay * 2);
      }
    }
    console.error(`❌ Failed to sync benchmarks for ${tech}:`, err);
  }
}

export async function simulateAIGeneration(goldenPrompt, tech, mdContent, retries = 5, delay = 10000) {
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

  const decorators = sourceFile.getDescendantsOfKind(SyntaxKind.Decorator);
  const decoratorNames = decorators.map(d => d.getName());

  if (tech === 'nestjs') {
      if (!decoratorNames.includes('Injectable') && !decoratorNames.includes('Controller')) {
          score.arch -= 10;
      }
      const classDeclarations = sourceFile.getDescendantsOfKind(SyntaxKind.ClassDeclaration);
      let hasValidation = false;
      for (const classDecl of classDeclarations) {
          const classDecorators = classDecl.getProperties().flatMap(p => p.getDecorators().map(d => d.getName()));
          if (classDecorators.some(name => name.startsWith('Is'))) {
             hasValidation = true;
             break;
          }
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

  const parameters = sourceFile.getDescendantsOfKind(SyntaxKind.Parameter);
  let missingTypes = 0;
  for (const param of parameters) {
      if (!param.getTypeNode()) {
          missingTypes++;
          score.type -= 5;
      }
  }
  if (missingTypes > 0) {
      score.type -= 10;
  }

  const anyKeywords = sourceFile.getDescendantsOfKind(SyntaxKind.AnyKeyword);
  if (anyKeywords.length > 0) {
    score.type -= 15 * anyKeywords.length;
  }

  const tryStatements = sourceFile.getDescendantsOfKind(SyntaxKind.TryStatement);
  const awaitExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.AwaitExpression);
  if (awaitExpressions.length > 0 && tryStatements.length === 0) {
      score.type -= 10;
  }

  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  for (const literal of stringLiterals) {
      const text = literal.getText();
      if (text.includes('password') || text.includes('secret') || text.includes('token')) {
          score.security -= 20;
      }
  }

  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  for(const call of callExpressions) {
    if(call.getText().includes('readFileSync')) {
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

  const techToFiles = {};
  for (const file of modifiedFiles) {
    if (!fs.existsSync(file)) continue;

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
        continue;
      }
    }

    if (!techToFiles[tech]) techToFiles[tech] = [];
    techToFiles[tech].push(file);
  }

  // Deduplicate and process syncBenchmarks sequentially by technology
  for (const tech of Object.keys(techToFiles)) {
    let combinedMdContent = [];
    for (const file of techToFiles[tech]) {
        const content = await fsPromises.readFile(file, 'utf-8');
        combinedMdContent.push(content);
    }
    await syncBenchmarks(tech, combinedMdContent.join('\n\n--- \n\n'));
  }

  const project = new Project();

  // Concurrent simulation and analysis
  const IOTasks = modifiedFiles.filter(f => fs.existsSync(f)).map(async (file) => {
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

    if (!fs.existsSync(suitePath)) {
        return null;
    }
    const suiteConfig = JSON.parse(await fsPromises.readFile(suitePath, 'utf-8'));
    const generatedCode = await simulateAIGeneration(suiteConfig.golden_prompt, tech, mdContent);

    if (!generatedCode) {
        return null;
    }

    const sourceFile = project.createSourceFile(`temp_${tech}_${Math.random()}.ts`, generatedCode, { overwrite: true });
    const { total: score, breakdown } = analyzeAST(sourceFile, tech);

    return { file, score, breakdown, generatedCode };
  });

  const results = await Promise.all(IOTasks);

  // Stateful side effects (Sequential)
  for (const result of results) {
    if (!result) continue;

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
      const reportContent = `# Critical Violation Report\n\n> [!CAUTION]\n> Fidelity Score dropped below 95%.\n\n**File:** \`${file}\`\n**Fidelity Score:** ${score}%\n**Threshold:** 95%\n\n## Breakdown\n| Metric | Score |\n|---|---|\n| Arch Integrity | ${breakdown.arch} |\n| Type Safety | ${breakdown.type} |\n| Security | ${breakdown.security} |\n| Efficiency | ${breakdown.efficiency} |\n\n## Generated Code\n\`\`\`typescript\n${generatedCode}\n\`\`\`\n\nReview the AST rules.`;

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

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runVibeCheck().catch(console.error);
}
