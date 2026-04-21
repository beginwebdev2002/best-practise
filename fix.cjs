const fs = require('fs');

let code = fs.readFileSync('vibe-check-runner.js', 'utf8');

const regexEscaped = /const reportContent = \\`# Critical Violation Report\\\\n\\\\n> \[!CAUTION\]\\\\n> Fidelity Score dropped below 95%\.\\\\n\\\\n\*\*File:\*\* \\\\\\\`\\\\\$\{file\}\\\\\\\`\\\\n\*\*Fidelity Score:\*\* \\\\\$\{score\}%\\\\n\*\*Threshold:\*\* 95%\\\\n\\\\n## Breakdown\\\\n\| Metric \| Score \|\\\\n\|---\|---\|\\\\n\| Arch Integrity \| \\\\\$\{breakdown\.arch\} \|\\\\n\| Type Safety \| \\\\\$\{breakdown\.type\} \|\\\\n\| Security \| \\\\\$\{breakdown\.security\} \|\\\\n\| Efficiency \| \\\\\$\{breakdown\.efficiency\} \|\\\\n\\\\n## Generated Code\\\\n\\\\\$\{fence\}typescript\\\\n\\\\\$\{generatedCode\}\\\\n\\\\\$\{fence\}\\\\n\\\\nReview the AST rules\.\\\`;/;

const newReport = "const reportContent = `# Critical Violation Report\\n\\n> [!CAUTION]\\n> Fidelity Score dropped below 95%.\\n\\n**File:** \\`${file}\\`\\n**Fidelity Score:** ${score}%\\n**Threshold:** 95%\\n\\n## Breakdown\\n| Metric | Score |\\n|---|---|\\n| Arch Integrity | ${breakdown.arch} |\\n| Type Safety | ${breakdown.type} |\\n| Security | ${breakdown.security} |\\n| Efficiency | ${breakdown.efficiency} |\\n\\n## Generated Code\\n${fence}typescript\\n${generatedCode}\\n${fence}\\n\\nReview the AST rules.`;";

code = code.replace(regexEscaped, newReport);

// Fix git log deduplication
const oldGitLog = "execFileSync('git', ['log', '--since=24 hours ago', '--name-only', '--pretty=format:'], { encoding: 'utf-8' });";
const newGitLog = `const out = execFileSync('git', ['log', '--since=24 hours ago', '--name-only', '--pretty=format:'], { encoding: 'utf-8' });\n    const uniqueFiles = [...new Set(out.split('\\n'))].join('\\n');\n    return uniqueFiles;`;
code = code.replace(oldGitLog, newGitLog);

// Fix getModifiedFiles return parsing which got broken by my attempt to modify the execFileSync return
const oldGetModifiedFiles = `export function getModifiedFiles() {
  try {
    // In CI (daily run), check files modified in the last 24 hours.
    // We filter for non-empty lines that end in .md and are in frontend/ or backend/
    const output = const out = execFileSync('git', ['log', '--since=24 hours ago', '--name-only', '--pretty=format:'], { encoding: 'utf-8' });
    const uniqueFiles = [...new Set(out.split('\\n'))].join('\\n');
    return uniqueFiles;
    const allFiles = output.split('\\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)
      .filter(f => f.endsWith('.md'))
      .filter(f => f.startsWith('frontend/') || f.startsWith('backend/'));

    return [...new Set(allFiles)];
  } catch (err) {
    console.error('Error finding modified files:', err);
    return [];
  }
}`;

code = code.replace(oldGetModifiedFiles, `export function getModifiedFiles() {
  try {
    const output = execFileSync('git', ['log', '--since=24 hours ago', '--name-only', '--pretty=format:'], { encoding: 'utf-8' });
    const allFiles = output.split('\\n')
      .map(f => f.trim())
      .filter(f => f.length > 0)
      .filter(f => f.endsWith('.md'))
      .filter(f => f.startsWith('frontend/') || f.startsWith('backend/'));

    return [...new Set(allFiles)];
  } catch (err) {
    console.error('Error finding modified files:', err);
    return [];
  }
}`);

// Fix script guard cross-platform check using pathToFileURL or just simple URL comparison
code = code.replace(
  "if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {",
  "import { pathToFileURL } from 'node:url';\nif (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {"
);

fs.writeFileSync('vibe-check-runner.js', code);
