import os
import re

for root, _, files in os.walk('frontend/design-ui'):
    for file in files:
        if file.endswith('.md'):
            with open(os.path.join(root, file), 'r') as f:
                for line in f:
                    if re.match(r'^#{1,3}\s', line):
                        # check if it starts with emoji (approximate by checking if the first character after spaces is not alphanumeric)
                        # Actually just print the header
                        print(f"{file}: {line.strip()}")
