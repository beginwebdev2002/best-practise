---
technology: Accessibility
domain: Frontend
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, a11y, html, w3c, wcag, best-practices]
ai_role: Frontend UI/UX Enforcer
last_updated: 2026-03-29
---

# ♿ Accessibility (A11y) Standards

[⬆️ Back to UI/UX Design Index](./readme.md)

This document enforces strict adherence to semantic HTML and accessibility guidelines, ensuring components are functional for all users, including those relying on assistive technologies.

## 📖 Context & Scope
- **Primary Goal:** Enforce semantic HTML out-of-the-box and ensure strict compliance with WCAG AA contrast and interaction accessibility.
- **Target Tooling:** AI Assistants (UI Generation & Code Audits).
- **Tech Stack Version:** Agnostic (HTML, React, Angular, etc.).

---

> [!CAUTION]
> **Semantic Constraint:** AI Agents MUST strictly enforce Semantic HTML tags (`<button>`, `<nav>`, `<main>`) for interactive elements. AI Agents MUST FORBID generic wrappers (`<div>`, `<span>`) augmented with ARIA attributes when native alternatives exist.

### ❌ Bad Practice
```html
<div role="button" tabindex="0" class="btn" onclick="openModal()">Click Me</div>
```

### ⚠️ Problem
Using generic `<div>` wrappers and artificially attaching ARIA roles or keyboard handlers increases code complexity and misses nuanced accessibility behaviors (like native keyboard focus management and space/enter activation) that semantic elements provide out-of-the-box. This exclusion breaks the application for users relying on assistive technologies.

### ✅ Best Practice
```html
<button class="btn" onclick="openModal()" aria-label="Open Settings Modal">Click Me</button>
```

### 🚀 Solution
Enforcing **Semantic HTML** guarantees that native elements provide built-in accessibility. Native elements naturally accept keyboard focus, support screen reader announcements correctly, and handle default interactions seamlessly. Appropriate use of `aria-label` ensures clarity only when native semantics are insufficient, resulting in a robust, inclusive, and deterministically accessible application.
