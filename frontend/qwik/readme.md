---
technology: Qwik
domain: frontend
level: Senior/Architect
version: "1.x"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Qwik Expert
last_updated: 2026-03-22
---

# ⚡ Qwik Best Practices & Production-Ready Patterns

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to modern Qwik patterns, specifically resumability and lazy loading for optimal best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Qwik 1.x

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** use `useSignal()`, `useStore()`, and `useTask$()` for local state and effects.
> - **Never** pass non-serializable objects (like closures, Promises, or DOM references) into generic properties.
> - **Always** utilize the `$` suffix for closures when necessary, like `onClick$`, to indicate lazy loading points.
## 🏗 Architecture Principles

- Adhere to the defined [Architectural Patterns](../../architectures/readme.md) when building applications.
- Strongly prefer **Feature Sliced Design (FSD)** for applications scaling across multiple teams.

## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [🚀 Fundamentals](./fundamentals.md)
- [🚀 Advanced Performance](./performance.md)
- [📦 State Management](./state-management.md)
- [🧪 Testing](./testing.md)
