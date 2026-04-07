import { Project, SyntaxKind } from 'ts-morph';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });

// Constants for scoring
const SCORES = {
  ARCH: 40,
  TYPE: 30,
  SECURITY: 20,
  EFFICIENCY: 10,
};

function getModifiedFiles() {
  try {
    // In CI (daily run), check files modified in the last 24 hours.
    // We filter for non-empty lines that end in .md and are in frontend/ or backend/
    const output = execSync('git log --since="24 hours ago" --name-only --pretty=format: | sort | uniq', { encoding: 'utf-8' });
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

async function simulateAIGeneration(goldenPrompt, tech, mdContent) {
  try {
    const prompt = `${goldenPrompt}\n\nConstraints and instructions from the following documentation:\n\n${mdContent}\n\nGenerate ONLY raw code. No markdown formatting, no explanations.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
    });
    let text = response.text || '';
    // Strip markdown code block wrappers if any
    text = text.replace(/^```[a-z]*\n/gm, '').replace(/```$/gm, '').trim();
    return text;
  } catch (err) {
    console.error('Error generating AI code:', err);
    return '';
  }
}

function analyzeAST(sourceFile, tech) {
  let score = {
    arch: SCORES.ARCH,
    type: SCORES.TYPE,
    security: SCORES.SECURITY,
    efficiency: SCORES.EFFICIENCY,
  };

  // 1. Arch Integrity (40)
  const decorators = sourceFile.getDescendantsOfKind(SyntaxKind.Decorator);
  const decoratorNames = decorators.map(d => d.getName());

  if (tech === 'nestjs') {
      if (!decoratorNames.includes('Injectable') && !decoratorNames.includes('Controller')) {
          score.arch -= 10;
      }

      // DTO Validation check
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
          // Note: naive check, only apply if we generated classes
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

  // FSD/DDD check (Naive representation checking for related imports or folder structure hints in string)
  // Check if string contains imports that hint at FSD like '@features', '@entities', '@shared' etc.
  const imports = sourceFile.getImportDeclarations();
  const moduleSpecifiers = imports.map(imp => imp.getModuleSpecifierValue());
  const hasFSD = moduleSpecifiers.some(spec => spec.includes('features/') || spec.includes('entities/') || spec.includes('shared/') || spec.includes('domain/'));
  // Not strictly enforcing this to be 10 point penalty if small snippet, but we reduce if completely monolithic (no imports)
  if (moduleSpecifiers.length === 0 && sourceFile.getClasses().length > 1) {
     score.arch -= 10;
  }

  // 2. Type Safety (30)
  const anyKeywords = sourceFile.getDescendantsOfKind(SyntaxKind.AnyKeyword);
  if (anyKeywords.length > 0) {
    score.type -= 15 * anyKeywords.length;
  }

  // Error handling pattern check
  const tryStatements = sourceFile.getDescendantsOfKind(SyntaxKind.TryStatement);
  const catchClauses = sourceFile.getDescendantsOfKind(SyntaxKind.CatchClause);
  // If we have functions that do awaiting, they probably should have try/catch
  const awaitExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.AwaitExpression);
  if (awaitExpressions.length > 0 && tryStatements.length === 0) {
      score.type -= 10; // Penalize lack of error handling
  }

  // 3. Security (20)
  const stringLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.StringLiteral);
  for (const literal of stringLiterals) {
      const text = literal.getText();
      if (text.includes('password') || text.includes('secret') || text.includes('token')) {
          score.security -= 20;
      }
  }

  // 4. Efficiency (10)
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

async function runVibeCheck() {
  console.log('Running Vibe-Check Runner...');

  const modifiedFiles = getModifiedFiles();
  if (modifiedFiles.length === 0) {
    console.log('No modified .md files found in frontend/ or backend/ within the last 24 hours.');
    return;
  }

  const project = new Project();

  // Configure git user for commits
  try {
    execSync('git config --global user.name "github-actions[bot]"');
    execSync('git config --global user.email "github-actions[bot]@users.noreply.github.com"');
  } catch (e) {
    console.warn('Failed to configure git user. If running locally, this is expected.');
  }

  for (const file of modifiedFiles) {
    console.log(`Processing ${file}...`);

    if (!fs.existsSync(file)) {
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

    const suitePath = path.join('benchmarks', 'suites', `${tech}.json`);
    if (!fs.existsSync(suitePath)) {
      console.log(`No benchmark suite found for ${tech}. Skipping.`);
      continue;
    }

    const suiteConfig = JSON.parse(fs.readFileSync(suitePath, 'utf-8'));
    const mdContent = fs.readFileSync(file, 'utf-8');

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

      let content = fs.readFileSync(file, 'utf-8');
      if (!content.includes('[![Vibe-Coding Verified]')) {
         content = content.replace(/^# /, '[![Vibe-Coding Verified](https://img.shields.io/badge/Vibe--Coding-Verified-brightgreen?style=for-the-badge)](#)\n\n# ');
         fs.writeFileSync(file, content);
      }

      try {
        execSync(`git add ${file}`);
        // Only commit if there are changes (badge might already be there)
        const status = execSync('git status --porcelain', { encoding: 'utf-8' });
        if (status.includes(file)) {
           execSync(`git commit -m "chore: fidelity-pass for ${file}"`);
           execSync(`git push origin HEAD:main`);
        } else {
           console.log(`Badge already present in ${file}, skipping commit.`);
        }
      } catch (err) {
         console.error('Failed to commit or push:', err.message);
      }

    } else {
      console.error(`❌ Validation failed for ${file}. Score below 95%.`);

      const reportDir = path.join('benchmarks', 'logs');
      if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

      const reportPath = path.join(reportDir, `violation-${tech}-${Date.now()}.md`);
      const reportContent = `# Critical Violation Report\n\nFile: ${file}\nFidelity Score: ${score}%\nThreshold: 95%\nBreakdown: ${JSON.stringify(breakdown)}\n\nGenerated Code:\n\`\`\`typescript\n${generatedCode}\n\`\`\`\n\nReview the AST rules.`;

      fs.writeFileSync(reportPath, reportContent);
      console.log(`Generated violation report: ${reportPath}`);

      try {
        execSync(`gh issue create --title "Fidelity Gap: ${file}" --body-file ${reportPath}`);
        console.log(`Created GitHub Issue for ${file}`);
      } catch (err) {
        console.error('Failed to create GitHub Issue (gh cli might not be installed or authenticated):', err.message);
      }

      process.exitCode = 1;
    }
  }
}

runVibeCheck().catch(console.error);