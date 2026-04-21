import os
import re

words = ['can', 'should', 'might', 'may', 'it is recommended', 'clean', 'fast', 'simple', 'good']
pattern = re.compile(r'\b(' + '|'.join(words) + r')\b', re.IGNORECASE)

for root, _, files in os.walk('frontend/design-ui'):
    for file in files:
        if file.endswith('.md'):
            with open(os.path.join(root, file), 'r') as f:
                lines = f.readlines()
                for i, line in enumerate(lines):
                    if pattern.search(line):
                        print(f"{file}:{i+1}: {line.strip()}")
