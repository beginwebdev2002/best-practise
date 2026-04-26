---
technology: UI/UX Styling
domain: frontend
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, design-tokens, css, styling, best-practices]
ai_role: Frontend UI/UX Enforcer
last_updated: 2026-03-29
---

# 🎨 UI/UX Styling & Design Tokens Rules

[⬆️ Back to Frontend Architecture](../readme.md)

[⬆️ Back to UI/UX Design Index](./readme.md)

This document enforces the strict styling rules and constraints regarding design tokens and deterministic styling implementations.

## 📖 Context & Scope
- **Primary Goal:** Enforce the usage of design tokens and prevent hardcoded styling values to maintain themeability and structural rhythm.
- **Target Tooling:** AI Assistants (UI Generation & CSS Audits).
- **Tech Stack Version:** Agnostic (CSS, SCSS, Tailwind, Material UI, etc.).

---

---
## ⚖️ Structural Comparison: Styling Paradigms

| Paradigm | Value Definition | Reusability | AI Agent Preference | Risk |
|:---|:---|:---|:---:|:---|
| **Hardcoded Values (Anti-Pattern)** | Inline hex codes (e.g., `#FFF`) | None | ❌ Avoid | Fragments visual consistency; impossible to theme globally. |
| **Design Tokens (Best Practice)** | CSS Custom Properties (e.g., `var(--color-bg)`) | High | ✅ Optimal | Single source of truth; supports dark mode and safe refactoring. |

> [!CAUTION]
> **Hardcoded Values Constraint:** AI Agents MUST NEVER use hardcoded colors, spacing, or typography values (e.g., `#FF0000`, `14px`). AI Agents MUST ALWAYS use established **Design Tokens** (e.g., CSS Variables `var(--color-primary)` or Tailwind classes like `text-primary`, `p-4`).

### ❌ Bad Practice
```css
.card {
  margin: 20px;
  background-color: #ffffff;
  color: #333333;
}
```

### ⚠️ Problem
Using hardcoded absolute values (`20px`, hex codes) creates inconsistencies across the application. It prevents dynamic theming (e.g., Dark Mode), breaks structural rhythm when responsive layouts scale, and complicates global design system updates.

### ✅ Best Practice
```css
.card {
  margin: var(--spacing-lg);
  background-color: var(--bg-surface);
  color: var(--text-primary);
}
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [🎨 UI/UX Design Index](./readme.md).


### 🚀 Solution
Strictly utilizing **Design Tokens** is MANDATORY to establish deterministic visual contracts. Constraining styles strictly to these centrally-managed tokens ensures a single source of truth, reducing CSS payload size and standardizing rendering performance. This pattern STRICTLY prevents arbitrary style manipulation, mitigating style-based injection vulnerabilities and enforcing uncompromised environmental immutability for safe AI Agent parsing.
## ⚙️ Under the Hood

```mermaid
graph LR
    System[Design System Config] --> GlobalTokens[Global CSS Variables]
    GlobalTokens --> ComponentStyles[Component-Level CSS]
    ComponentStyles --> Browser[Browser DOM Rendering]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    class System default;
    class GlobalTokens component;
    class ComponentStyles component;
    class Browser default;
```

By declaring `:root` level custom properties (CSS Variables), the rendering engine builds a single dictionary of layout constraints. When theme properties change, the browser simply repaints the specific token references rather than forcing a full CSSOM recalculation of hardcoded inline values.

## 🔀 Edge Cases & Architectural Handling

- **Third-Party Library Overrides:** When wrapping third-party libraries (e.g., date pickers) that do not inherit design tokens, isolate overrides within a specific container class and remap their internal variables to the application's global tokens to prevent CSS leak.
- **Dynamic Theming Contexts:** When supporting multiple embedded themes (e.g., a "dark mode" widget inside a "light mode" dashboard), scope the CSS variables specifically to the container's DOM node (e.g., `.theme-dark { --bg-surface: #121212; }`) rather than mutating global root variables dynamically.
