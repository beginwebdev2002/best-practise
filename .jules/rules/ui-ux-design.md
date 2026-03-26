---
description: "UI/UX Design and Styling Rules for Jules AI agent, covering responsive design, accessibility (a11y), design systems, and UI component architecture."
tags:
  - ui
  - ux
  - design
  - styling
  - accessibility
  - responsive
  - jules
---

# 🎨 UI/UX Design Production-Ready Best Practices

This document outlines the production-ready best practices for UI/UX Design and styling, specifically tailored for the Jules AI agent. It ensures consistent, accessible, and responsive user interfaces.

## 1. Context & Scope
- **Primary Goal:** Maintain a consistent, **accessible (a11y)**, and visually appealing user interface across all applications through strict **responsive design** practices.
- **Target Tooling:** Jules AI agent (UI Generation & CSS Audits).
- **Tech Stack Version:** Agnostic (CSS, SCSS, Tailwind, Material UI, etc.).

<div align="center">
  <img src="https://img.icons8.com/?size=100&id=65664&format=png&color=000000" width="100" alt="Design Overview">
</div>

---

## 2. Design System & Styling Rules

> [!CAUTION]
> **Hardcoded Values:** Never use hardcoded colors, spacing, or typography values (`#FF0000`, `14px`). Always use established **Design Tokens** (e.g., CSS Variables or Tailwind classes like `text-primary`, `p-4`).

### Hardcoded vs Design Tokens Comparison

| Aspect | Hardcoded Value (Avoid) | Design Token (Prefer) | Benefits |
| :--- | :--- | :--- | :--- |
| **Colors** | `#FF0000`, `rgb(255, 0, 0)` | `var(--color-primary)`, `text-primary` | Theming, consistency, single source of truth |
| **Spacing** | `14px`, `20px` | `var(--spacing-md)`, `p-4` | Rhythm, responsiveness |
| **Typography** | `16px`, `bold` | `var(--font-size-base)`, `text-base font-bold` | Scalability, accessibility |

### Responsive & Adaptive Principles
1. **Mobile-First Approach:** Always write base CSS for mobile screens first, then progressively enhance the design for larger screens using `min-width` media queries.
2. **Fluid Layouts:** Prefer relative units (`rem`, `em`, `vh`, `vw`, `%`) over absolute units (`px`) for layout structures and typography to allow proper scaling.

### Accessibility (A11y) Standards
1. **Semantic HTML:** Use native, meaningful HTML5 tags (`<button>`, `<nav>`, `<main>`, `<article>`) instead of generic `<div>` wrappers with click handlers.
2. **Keyboard Navigation:** Ensure every interactive element is reachable via the `Tab` key and visually indicates focus (`:focus-visible`).
3. **Contrast & ARIA:** Maintain a WCAG AA-compliant contrast ratio (minimum 4.5:1 for normal text). Use WAI-ARIA attributes (`aria-label`, `aria-hidden`) only when semantic HTML is insufficient.

### UI Component Architecture

```mermaid
graph TD
    Tokens[Design Tokens: Colors, Spacing] --> Elements[Atomic Elements: Buttons, Inputs]
    Elements --> Components[Complex Components: Cards, Modals]
    Components --> Layouts[Page Layouts: Grids, Sections]

    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Tokens layout;
    class Elements default;
    class Components component;
    class Layouts component;
```

---

## 3. Checklist for Jules Agent

When generating UI components or modifying styles:
- [ ] Verify that the component works properly on mobile (`320px`), tablet, and desktop viewports.
- [ ] Check if the element handles long text variations without breaking the layout (overflow control).
- [ ] Ensure all images have descriptive `alt` attributes, or empty `alt=""` if strictly decorative.
- [ ] Validate that interactive state changes (hover, active, disabled) are clearly visible to the user.
