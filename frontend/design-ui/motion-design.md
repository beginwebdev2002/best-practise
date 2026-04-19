---
technology: Motion Design
domain: frontend
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, motion-design, css-animations, a11y, best-practices]
ai_role: Frontend UI/UX Enforcer
last_updated: 2026-03-29
---

# 🎭 Motion Design Standards

[⬆️ Back to Frontend Architecture](../readme.md)

[⬆️ Back to UI/UX Design Index](./readme.md)

This document enforces strict adherence to performance-optimized animations, user motion preferences, and deterministic motion tokenization.

## 📖 Context & Scope
- **Primary Goal:** Enforce hardware-accelerated animations, respect `prefers-reduced-motion`, and utilize centrally managed motion tokens to ensure visual consistency and accessibility.
- **Target Tooling:** AI Assistants (UI Generation & Code Audits).
- **Tech Stack Version:** Agnostic (CSS, Framer Motion, GSAP, etc.).

---

---

## ⚖️ Structural Comparison: Motion Paradigms

| Paradigm | Performance | Accessibility | AI Agent Preference | Risk |
|:---|:---|:---|:---:|:---|
| **CPU-Bound Animations (Anti-Pattern)** | Low (Jank) | None | ❌ Avoid | Blocks main thread, causes layout thrashing, ignores user accessibility preferences. |
| **Hardware-Accelerated + Tokenized (Best Practice)** | High (60fps) | High | ✅ Optimal | Guaranteed smooth performance via GPU, strictly respects system-level reduced motion. |

> [!CAUTION]
> **Performance Constraint:** AI Agents MUST strictly avoid animating properties that trigger layout or paint recalculations (e.g., `width`, `height`, `margin`, `top`, `left`). AI Agents MUST ONLY animate `transform` (e.g., `translate`, `scale`) and `opacity` properties.
> **Accessibility Constraint:** AI Agents MUST strictly wrap all non-essential animations inside a `@media (prefers-reduced-motion: no-preference)` block.

### ❌ Bad Practice
```css
.card {
  transition: all 0.5s ease;
}

.card:hover {
  margin-top: -10px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}
```

### ⚠️ Problem
Animating layout properties like `margin-top` forces the browser to recalculate the layout geometry for the entire document on every frame. This WILL result in severe main-thread blocking, layout thrashing, and dropped frames (jank). Furthermore, using a generic `transition: all` creates unpredictable animation side-effects and FAILS TO respect the operating system's reduced motion accessibility settings, potentially triggering vestibular disorders in sensitive users.

### ✅ Best Practice
```css
/* Using deterministic Motion Tokens */
.card {
  transition: transform var(--motion-duration-sm) var(--motion-easing-default),
              box-shadow var(--motion-duration-sm) var(--motion-easing-default);
}

@media (prefers-reduced-motion: no-preference) {
  .card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-hover);
  }
}
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [🎨 UI/UX Design Index](./readme.md).


### 🚀 Solution
Enforcing **Hardware-Accelerated Animations** via `transform` and `opacity` is MANDATORY. These properties are offloaded to the GPU compositor thread, guaranteeing 60fps performance without blocking the main event loop. Strict implementation of `@media (prefers-reduced-motion: no-preference)` is a non-negotiable accessibility requirement. Constraining transitions to specific properties utilizing centralized Design Tokens creates a highly predictable execution environment, eliminating parsing ambiguity for AI Agents and mitigating the security risk of performance-based denial-of-service via excessive main-thread blocking.