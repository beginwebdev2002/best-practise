import re

text = """
> [!IMPORTANT]
> Prefer `interface` for structure, `type` for unions. Interfaces provide better error messages and performance for structural types in TypeScript 5.x.

This is a MUST requirement.
"""

lines = text.split('\n')
new_lines = []
for line in lines:
    if not line.startswith('>') and not line.startswith('#'):
        if re.search(r'\b(MUST|STRICTLY|FORBIDDEN|MANDATORY)\b', line):
            line = f"> [!IMPORTANT]\n> {line}"
    new_lines.append(line)

print('\n'.join(new_lines))
