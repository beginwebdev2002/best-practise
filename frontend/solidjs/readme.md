---
technology: SolidJS
domain: frontend
level: Senior/Architect
version: "1.8+"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior SolidJS Expert
last_updated: 2026-03-22
---

# ⚡ SolidJS Best Practices & Production-Ready Patterns

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to modern SolidJS patterns, specifically fine-grained reactivity and functional APIs for optimal best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** SolidJS 1.8+

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** use `createSignal()`, `createMemo()`, and `createEffect()` for local state and side effects.
> - **Never** destructure props directly; use `splitProps()` or `mergeProps()` instead.
> - **Always** utilize the built-in control flow (`<Show>`, `<For>`, `<Switch>`) instead of mapping or ternary operators in JSX.
## 🏗 Architecture Principles

- Adhere to the defined [Architectural Patterns](../../architectures/readme.md) when building applications.
- Strongly prefer **Feature Sliced Design (FSD)** for applications scaling across multiple teams.

## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [🚀 Fundamentals](./fundamentals.md)
- [🚀 Advanced Performance](./performance.md)
- [📦 State Management](./state-management.md)
- [🧪 Testing](./testing.md)
