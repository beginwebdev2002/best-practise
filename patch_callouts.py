import os
import re

directory = 'frontend/design-ui'
for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r') as f:
            content = f.read()

        content = re.sub(r'> \[!NOTE\]\n> \*\*Internal Routing:\*\*.*?\n\n+', '\n', content, flags=re.DOTALL)

        with open(filepath, 'w') as f:
            f.write(content)
