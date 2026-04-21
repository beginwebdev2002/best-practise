const fs = require('fs');

let code = fs.readFileSync('vibe-check-runner.js', 'utf8');

const regexEscaped = /const reportContent = \\`# Critical Violation Report\\\\n\\\\n> \[!CAUTION\]\\\\n> Fidelity Score dropped below 95%\.\\\\n\\\\n\*\*File:\*\* \\\\\\\`\\\\\$\{file\}\\\\\\\`\\\\n\*\*Fidelity Score:\*\* \\\\\$\{score\}%\\\\n\*\*Threshold:\*\* 95%\\\\n\\\\n## Breakdown\\\\n\| Metric \| Score \|\\\\n\|---\|---\|\\\\n\| Arch Integrity \| \\\\\$\{breakdown\.arch\} \|\\\\n\| Type Safety \| \\\\\$\{breakdown\.type\} \|\\\\n\| Security \| \\\\\$\{breakdown\.security\} \|\\\\n\| Efficiency \| \\\\\$\{breakdown\.efficiency\} \|\\\\n\\\\n## Generated Code\\\\n\\\\\$\{fence\}typescript\\\\n\\\\\$\{generatedCode\}\\\\n\\\\\$\{fence\}\\\\n\\\\nReview the AST rules\.\\\`;/;

const newReport = "const reportContent = `# Critical Violation Report\\n\\n> [!CAUTION]\\n> Fidelity Score dropped below 95%.\\n\\n**File:** \\`${file}\\`\\n**Fidelity Score:** ${score}%\\n**Threshold:** 95%\\n\\n## Breakdown\\n| Metric | Score |\\n|---|---|\\n| Arch Integrity | ${breakdown.arch} |\\n| Type Safety | ${breakdown.type} |\\n| Security | ${breakdown.security} |\\n| Efficiency | ${breakdown.efficiency} |\\n\\n## Generated Code\\n${fence}typescript\\n${generatedCode}\\n${fence}\\n\\nReview the AST rules.`;";

code = code.replace(regexEscaped, newReport);

fs.writeFileSync('vibe-check-runner.js', code);
