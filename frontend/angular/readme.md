---
technology: Angular
domain: frontend
level: Senior/Architect
version: 20+
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Angular Performance Expert
last_updated: 2026-03-22
---

# 🎨 Angular Best Practices & Production-Ready Patterns
## 🎯 Context & Scope
- **Primary Goal:** Enforce strict adherence to modern Angular v20 patterns, specifically Zoneless reactivity and functional APIs for optimal best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** use `signal()`, `computed()`, and `effect()` instead of RxJS `BehaviorSubject` for local state.
> - **Never** use `@Input()` or `@Output()` decorators; strictly use `input()` and `output()` functional APIs.
> - **Always** utilize the built-in control flow (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`).

[⬆️ Back to Top](#)
## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [🚀 Fundamentals](./fundamentals.md)
- [🏗 Architecture & Dependency Injection](./architecture.md)
- [🚀 Advanced Performance](./advanced-performance.md)
- [📦 State Management](./state-management.md)
- [📝 Data & Forms](./data-forms.md)
- [🧠 Expert/Niche Topics](./expert-niche.md)
- [🧪 Testing](./testing.md)
