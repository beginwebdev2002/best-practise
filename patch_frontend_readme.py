import re
filepath = 'frontend/readme.md'
with open(filepath, 'r') as f:
    content = f.read()

old_block = """## 🎨 UI/UX Design & Styling
- [Styling Rules](./design-ui/styling.md)
- [Responsive Design](./design-ui/responsive-design.md)
- [Accessibility](./design-ui/accessibility.md)
- [Component Architecture](./design-ui/component-architecture.md)

- [UI/UX Design Index](./design-ui/readme.md)"""

new_block = """## 🎨 UI/UX Design & Styling
- [Accessibility](./design-ui/accessibility.md)
- [Component Architecture](./design-ui/component-architecture.md)
- [Responsive Design](./design-ui/responsive-design.md)
- [Styling Rules](./design-ui/styling.md)
- [UI/UX Design Index](./design-ui/readme.md)"""

content = content.replace(old_block, new_block)
with open(filepath, 'w') as f:
    f.write(content)
