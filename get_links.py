import re
with open('_sidebar.md', 'r') as f:
    content = f.read()

# look for design ui links
links = re.findall(r'\[.*?\]\((frontend/design-ui/.*?)\)', content)
print(links)
