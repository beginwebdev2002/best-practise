import { Project, SyntaxKind } from 'ts-morph';
import fs from 'node:fs';
import path from 'node:path';

// Mock AI Output to evaluate
const mockCode = `
import { signal, computed, effect } from '@angular/core';

export class MyComponent {
  title = signal('Hello');
  derived = computed(() => this.title() + ' World');

  constructor() {
    effect(() => {
      console.log(this.derived());
    });
  }
}
`;

function analyzeAngularAST(sourceFile) {
  let score = 100;

  // Check for forbidden decorators
  const decorators = sourceFile.getDescendantsOfKind(SyntaxKind.Decorator);
  for (const decorator of decorators) {
    const name = decorator.getName();
    if (['Input', 'Output'].includes(name)) {
      score -= 20;
    }
  }

  // Check for required functions
  const imports = sourceFile.getImportDeclarations();
  let hasSignal = false;
  for (const imp of imports) {
    const namedImports = imp.getNamedImports().map(ni => ni.getName());
    if (namedImports.includes('signal')) hasSignal = true;
  }

  if (!hasSignal) {
    score -= 20;
  }

  return score;
}

async function runVibeCheck() {
  console.log('Running Vibe-Check Runner...');

  const project = new Project();
  const sourceFile = project.createSourceFile('mock-component.ts', mockCode);

  const score = analyzeAngularAST(sourceFile);

  console.log(`Fidelity Score: ${score}%`);

  if (score >= 95) {
    console.log('✅ Validation passed. Ready for auto-commit.');
    process.exit(0);
  } else {
    console.error('❌ Validation failed. Score below 95%.');

    // Generate violation report
    const reportContent = `# Critical Violation Report\n\nFidelity Score: ${score}%\nThreshold: 95%\n\nReview the AST rules.`;
    fs.writeFileSync('violation-report.md', reportContent);
    process.exit(1);
  }
}

runVibeCheck().catch(console.error);