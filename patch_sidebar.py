import re
filepath = '_sidebar.md'
with open(filepath, 'r') as f:
    content = f.read()

old_block = """  * **Design ui**
    * [Overview](frontend/design-ui/readme.md)
    * [Styling](frontend/design-ui/styling.md)"""

new_block = """  * **Design UI**
    * [Overview](frontend/design-ui/readme.md)
    * [Accessibility](frontend/design-ui/accessibility.md)
    * [Component Architecture](frontend/design-ui/component-architecture.md)
    * [Responsive Design](frontend/design-ui/responsive-design.md)
    * [Styling](frontend/design-ui/styling.md)"""

content = content.replace(old_block, new_block)
with open(filepath, 'w') as f:
    f.write(content)
