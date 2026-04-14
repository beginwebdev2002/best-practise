---
technology: Responsive Design
domain: Frontend
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, responsive, adaptive, css, best-practices]
ai_role: Frontend UI/UX Enforcer
last_updated: 2026-03-29
---

# 📱 Responsive & Adaptive Design Principles

[⬆️ Back to UI/UX Design Index](./readme.md)

This document enforces the strict standards for building fluid, universally adaptable layouts using a mobile-first approach.

## 📖 Context & Scope
- **Primary Goal:** Ensure layouts are fluid and responsive across all viewports (`320px` to desktop) without horizontal scrolling or breakage.
- **Target Tooling:** AI Assistants (UI Generation & CSS Audits).
- **Tech Stack Version:** Agnostic (CSS, SCSS, Tailwind, Material UI, etc.).

---

> [!IMPORTANT]
> **Mobile-First Constraint:** AI Agents MUST strictly apply a mobile-first approach. Define base CSS for mobile screens and progressively enhance the layout for larger viewports using `min-width` media queries. Always prefer relative units (`rem`, `%`) over absolute units (`px`).

### ❌ Bad Practice
```css
.container {
  width: 960px;
}

@media (max-width: 768px) {
  .container {
    width: 100%;
  }
}
```

### ⚠️ Problem
A desktop-first approach with absolute units (`px`) often leads to horizontal scrolling on mobile devices and rigid layouts that break unpredictably on intermediate screen sizes.

### ✅ Best Practice
```css
.container {
  width: 100%;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    max-width: 48rem;
    padding: 2rem;
  }
}
```

### 🚀 Solution
Implementing a **Mobile-First Approach** using relative units (`rem`, `%`) ensures fluid, universally adaptable layouts. Establishing base styles for mobile and then progressively enhancing for larger viewports via `min-width` media queries makes the design system resilient, maintainable, and deterministically predictable for scaling.
