import re
filepath = 'frontend/design-ui/readme.md'
with open(filepath, 'r') as f:
    content = f.read()

old_list = """* [🎨 Styling Rules](./styling.md) - Design Tokens, Hardcoded Values, and general CSS best practices.
* [📱 Responsive Design](./responsive-design.md) - Mobile-First Approach, Relative Units, and fluid layouts.
* [♿ Accessibility (A11y)](./accessibility.md) - Semantic HTML, ARIA attributes, Focus visibility, and WCAG standards.
* [🏗️ Component Architecture](./component-architecture.md) - Atomic Design principles and structural UI diagrams."""

new_list = """* [♿ Accessibility (A11y)](./accessibility.md) - Semantic HTML, ARIA attributes, Focus visibility, and WCAG standards.
* [🏗️ Component Architecture](./component-architecture.md) - Atomic Design principles and structural UI diagrams.
* [📱 Responsive Design](./responsive-design.md) - Mobile-First Approach, Relative Units, and fluid layouts.
* [🎨 Styling Rules](./styling.md) - Design Tokens, Hardcoded Values, and general CSS best practices."""

content = content.replace(old_list, new_list)
with open(filepath, 'w') as f:
    f.write(content)
