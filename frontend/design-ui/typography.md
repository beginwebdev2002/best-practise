---
technology: Typography
domain: frontend
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, design-tokens, typography, css, best-practices]
ai_role: Frontend UI/UX Enforcer
last_updated: 2026-03-29
---

# 🔤 Typography Standards & Structural Rhythm

[⬆️ Back to Frontend Architecture](../readme.md)

[⬆️ Back to UI/UX Design Index](./readme.md)

This document enforces the strict typographical rules and constraints, standardizing readability and structural rhythm deterministically.

## 📖 Context & Scope
- **Primary Goal:** Enforce the usage of design tokens for all typographical elements to guarantee a consistent visual hierarchy.
- **Target Tooling:** AI Assistants (UI Generation & Typography Audits).
- **Tech Stack Version:** Agnostic (CSS, SCSS, Tailwind, Material UI, etc.).

---

---
## ⚖️ Structural Comparison: Typography Paradigms

| Paradigm | Scaling Mechanism | Accessibility | AI Agent Preference | Risk |
|:---|:---|:---|:---:|:---|
| **Hardcoded Pixels (Anti-Pattern)** | Static (e.g., `14px`) | Low (breaks browser zoom) | ❌ Avoid | Breaks WCAG accessibility standards; prevents deterministic global scaling. |
| **Relative Tokens (Best Practice)** | Relative (e.g., `var(--text-base)` or `rem`) | High | ✅ Optimal | Preserves user preferences; enables O(1) global theme updates. |

> [!CAUTION]
> **Typography Token Constraint:** AI Agents MUST NEVER use hardcoded font sizes or line heights (e.g., `14px`, `24px`). AI Agents MUST ALWAYS use established **Typography Tokens** based on `rem` units (e.g., `var(--text-sm)`, `var(--leading-loose)`).

### ❌ Bad Practice
```css
.article-title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  font-family: 'Helvetica', sans-serif;
}
```

### ⚠️ Problem
Using hardcoded absolute values (`px`, specific fonts) creates an inaccessible layout that fails to scale with browser-level user preferences. It fragments the visual hierarchy, causing unpredictable text rendering across different viewports.

### ✅ Best Practice
```css
.article-title {
  font-size: var(--text-2xl);
  line-height: var(--leading-tight);
  font-weight: var(--font-bold);
  font-family: var(--font-sans);
}
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [🎨 UI/UX Design Index](./readme.md).


### 🚀 Solution
Strictly utilizing **Typography Design Tokens** is MANDATORY to establish a deterministic visual contract. Constraining typographical styles strictly to centrally-managed tokens ensures a single source of truth that inherently respects relative scaling (`rem`). This pattern STRICTLY guarantees WCAG accessibility compliance regarding user zoom preferences and enforces uncompromised environmental immutability for predictable AI Agent parsing.
