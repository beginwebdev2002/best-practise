const fs = require('fs');

let content = fs.readFileSync('vibe-check-runner.js', 'utf8');

const analyzeAST_start = content.indexOf('function analyzeAST(sourceFile, tech) {');
const analyzeAST_end = content.indexOf('async function runVibeCheck() {');

const newAnalyzeAST = `export function analyzeAST(sourceFile, tech) {
  let score = {
    arch: SCORES.ARCH,
    type: SCORES.TYPE,
    security: SCORES.SECURITY,
    efficiency: SCORES.EFFICIENCY,
  };

  const decorators = [];
  const classDeclarations = [];
  const imports = [];
  const parameters = [];
  let anyKeywordsCount = 0;
  let tryStatementsCount = 0;
  let awaitExpressionsCount = 0;
  const stringLiterals = [];
  let hasReadFileSync = false;

  sourceFile.forEachDescendant(node => {
    const kind = node.getKind();
    if (kind === SyntaxKind.Decorator) decorators.push(node);
    else if (kind === SyntaxKind.ClassDeclaration) classDeclarations.push(node);
    else if (kind === SyntaxKind.ImportDeclaration) imports.push(node);
    else if (kind === SyntaxKind.Parameter) parameters.push(node);
    else if (kind === SyntaxKind.AnyKeyword) anyKeywordsCount++;
    else if (kind === SyntaxKind.TryStatement) tryStatementsCount++;
    else if (kind === SyntaxKind.AwaitExpression) awaitExpressionsCount++;
    else if (kind === SyntaxKind.StringLiteral) stringLiterals.push(node);
    else if (kind === SyntaxKind.CallExpression && node.getText().includes('readFileSync')) hasReadFileSync = true;
  });

  const decoratorNames = decorators.map(d => d.getName());

  if (tech === 'nestjs') {
      if (!decoratorNames.includes('Injectable') && !decoratorNames.includes('Controller')) {
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

  const moduleSpecifiers = imports.map(imp => imp.getModuleSpecifierValue());
  const hasFSD = moduleSpecifiers.some(spec => spec.includes('features/') || spec.includes('entities/') || spec.includes('shared/') || spec.includes('domain/'));
  if (!hasFSD) {
     score.arch -= 10;
  }

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

  if (anyKeywordsCount > 0) {
    score.type -= 15 * anyKeywordsCount;
  }

  if (awaitExpressionsCount > 0 && tryStatementsCount === 0) {
      score.type -= 10;
  }

  for (const literal of stringLiterals) {
      const text = literal.getText();
      if (text.includes('password') || text.includes('secret') || text.includes('token')) {
          score.security -= 20;
      }
  }

  if (hasReadFileSync) {
      score.efficiency -= 10;
  }

  score.arch = Math.max(0, score.arch);
  score.type = Math.max(0, score.type);
  score.security = Math.max(0, score.security);
  score.efficiency = Math.max(0, score.efficiency);

  const total = score.arch + score.type + score.security + score.efficiency;
  return { total, breakdown: score };
}

`;

content = content.slice(0, analyzeAST_start) + newAnalyzeAST + content.slice(analyzeAST_end);

content = content.replace('async function runVibeCheck', 'export async function runVibeCheck');
content = content.replace('async function simulateAIGeneration', 'export async function simulateAIGeneration');

content = content.replace(/fs\.existsSync/g, 'await fileOrDirExists');

content = content.replace(
  /const ai = new GoogleGenAI\(\{ apiKey: process\.env\.GOOGLE_AI_API_KEY \}\);/g,
  `let ai;
try {
  if (process.env.GOOGLE_AI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
  }
} catch (e) {
  console.warn('GoogleGenAI initialization failed or skipped.');
}`
);

content = content.replace(
  /const response = await ai\.models\.generateContent/g,
  `if (!ai) throw new Error('GoogleGenAI is not initialized');\n    const response = await ai.models.generateContent`
);

if (!content.includes('import { pathToFileURL }')) {
  content = `import { pathToFileURL } from 'node:url';\n` + content;
}
content = content.replace(
  /runVibeCheck\(\)\.catch\(console\.error\);/g,
  `if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runVibeCheck().catch(console.error);
}`
);

content = content.replace(/\[chore: benchmark-sync\]/g, '[chore: fidelity-pass]');

content = content.replace(
  /\`\`\`typescript\\n\$\{generatedCode\}\\n\`\`\`/g,
  "\\n${(()=>{\n        const maxBackticks = (generatedCode.match(/\\`{3,}/g) || []).reduce((max, match) => Math.max(max, match.length), 2);\n        const fence = '\\`'.repeat(Math.max(3, maxBackticks + 1));\n        return `${fence}typescript\\n${generatedCode}\\n${fence}`;\n      })()}\\n"
);


fs.writeFileSync('vibe-check-runner.js', content, 'utf8');
