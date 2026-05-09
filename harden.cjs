const fs = require('fs');
const path = require('path');

function replaceContextAware(textPart) {
    let result = textPart;

    result = result.replace(/\b(clean)(?!\s+architecture)\b/gi, (match) => {
         if (match.toLowerCase() === 'clean') {
              if (match === 'Clean') return 'Strictly structured';
              return 'strictly structured';
         }
         return match;
    });

    result = result.replace(/\b(fast code)\b/gi, (match) => {
         return match === 'Fast code' ? 'Code with O(1) or O(n) complexity' : 'code with O(1) or O(n) complexity';
    });

    result = result.replace(/\bfast\b/gi, (match) => {
         return match === 'Fast' ? 'O(1) or O(n) complexity' : 'O(1) or O(n) complexity';
    });

    result = result.replace(/\bsimple\b/gi, (match) => {
         return match === 'Simple' ? 'Strictly structured' : 'strictly structured';
    });

    result = result.replace(/\bgood\b/gi, (match) => {
         return match === 'Good' ? 'MANDATORY' : 'MANDATORY';
    });

    result = result.replace(/it is recommended/gi, 'it is STRICTLY MANDATORY');
    result = result.replace(/it is suggested/gi, 'it is STRICTLY MANDATORY');

    result = result.replace(/\bcan\b/gi, 'MUST');
    result = result.replace(/\bshould\b/gi, 'MUST');
    result = result.replace(/\bmight\b/gi, 'MANDATORY');
    result = result.replace(/\bmay\b/gi, 'MANDATORY');

    return result;
}

function checkTsConflict(filePath, content) {
    if (filePath.includes('typescript')) {
        let changed = false;
        let newContent = content;

        if (newContent.match(/prefer `?type`? for object structures/i) || newContent.match(/Use `?type`? for object structures/i) || newContent.match(/Use `?type`? for defining object structures/i)) {
             newContent = newContent.replace(/Use `?type`? for object structures/gi, "Use `interface` for object structures");
             newContent = newContent.replace(/Use `?type`? for defining object structures/gi, "Use `interface` for defining object structures");
             newContent = newContent.replace(/prefer `?type`? for object structures/gi, "prefer `interface` for object structures");
             changed = true;
        }

        if (newContent.match(/NEVER use `?interface`? for object structures/i) || newContent.match(/NEVER Use `?interface`? for defining object structures/i)) {
             newContent = newContent.replace(/NEVER use `?interface`? for object structures/gi, "NEVER use `type` for object structures");
             newContent = newContent.replace(/NEVER Use `?interface`? for defining object structures/gi, "NEVER use `type` for defining object structures");
             changed = true;
        }

        if (newContent.match(/NEVER use `?type`? for unions/i)) {
             newContent = newContent.replace(/NEVER use `?type`? for unions/gi, "NEVER use `interface` for unions");
             changed = true;
        }

        return { content: newContent, changed };
    }
    // Also check .agents/rules/rules.md where it mentions TS rules
    if (filePath.includes('rules.md')) {
        let changed = false;
        let newContent = content;
        if (newContent.match(/Use `?type`? for defining object structures/i)) {
            newContent = newContent.replace(/Use `?type`? for defining object structures/gi, "Use `interface` for defining object structures");
            changed = true;
        }
        return { content: newContent, changed };
    }

    return { content, changed: false };
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    let tsCheck = checkTsConflict(filePath, content);
    content = tsCheck.content;
    let fileChangesCount = tsCheck.changed ? 1 : 0;

    const lines = content.split('\n');
    let inCodeBlock = false;
    let inFrontmatter = false;
    let inProtectedSection = false;
    let inTable = false;

    const newLines = lines.map((line, index) => {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return line;
        }

        if (index === 0 && line.trim() === '---') {
            inFrontmatter = true;
            return line;
        }
        if (inFrontmatter && line.trim() === '---') {
            inFrontmatter = false;
            return line;
        }

        if (line.match(/^#+\s+(.*Problem.*|.*Trade-offs.*|❌ Bad Practice|⚠️ Problem|Cons|Disadvantages)/i)) {
            inProtectedSection = true;
        } else if (line.match(/^#+\s+(Solution|✅ Best Practice|🚀 Solution|Pros|Advantages)/i)) {
            inProtectedSection = false;
        }

        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
            inTable = true;
        } else {
            inTable = false;
        }

        if (inCodeBlock || inFrontmatter || inProtectedSection || inTable) {
            return line;
        }

        let processedLine = line;
        const parts = processedLine.split(/(\[.*?\]\(.*?\)|<.*?>|`.*?`)/g);
        let lineChanged = false;

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                let textPart = parts[i];
                let oldTextPart = textPart;

                textPart = replaceContextAware(textPart);
                if (textPart !== oldTextPart) {
                    fileChangesCount++;
                    lineChanged = true;
                }

                parts[i] = textPart;
            }
        }
        processedLine = parts.join('');

        if (lineChanged && processedLine.trim().length > 0) {
             if (processedLine.match(/\b(MUST|STRICTLY|MANDATORY|FORBIDDEN)\b/)) {
                 if (!processedLine.trim().startsWith('>')) {
                     const listMatch = processedLine.match(/^(\s*(-|\*|\d+\.)\s*)(.*)/);
                     if (listMatch) {
                         // Convert the list text without breaking the markdown list or adding stray > [!IMPORTANT]
                         // Actually, the best way without breaking the markdown list is to put > [!IMPORTANT] block inside the list item
                         // by putting it on the next line and indenting appropriately.
                         // But we also need to keep it simple. Let's just prepend the > [!IMPORTANT] before the item.
                         // No, reviewer said: Injecting > [!IMPORTANT] blocks inside of bulleted lists is done incorrectly, leaving orphaned bullets.
                         // Let's replace the whole item to be a blockquote, or just don't inject > [!IMPORTANT] for list items?
                         // "Wrap every critical constraint in a GitHub Alert block"
                         // Let's do it this way:
                         processedLine = `> [!IMPORTANT]\n> ${processedLine.replace(/^\s*(-|\*|\d+\.)\s*/, '')}`;
                     } else if (!processedLine.match(/^#/)) {
                         processedLine = `> [!IMPORTANT]\n> ${processedLine}`;
                     }
                 }
             }
        }

        return processedLine;
    });

    if (fileChangesCount > 0) {
        fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    }

    return fileChangesCount;
}

function findMdFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'package.json' || file === 'package-lock.json') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findMdFiles(filePath, fileList);
        } else if (filePath.endsWith('.md')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

let totalChanges = 0;
const allMdFiles = findMdFiles('.');

for (const file of allMdFiles) {
    if (file.endsWith('audit-log.md')) continue;
    if (file.includes('harden')) continue;
    totalChanges += processFile(file);
}

let auditContent = '';
if (fs.existsSync('audit-log.md')) {
    auditContent = fs.readFileSync('audit-log.md', 'utf8');
}
if (!auditContent.includes('Replaced ' + totalChanges)) {
    auditContent += `\nReplaced ${totalChanges} ambiguous phrases.\n`;
    fs.writeFileSync('audit-log.md', auditContent.trim() + '\n', 'utf8');
}

console.log(`Total changes: ${totalChanges}`);
