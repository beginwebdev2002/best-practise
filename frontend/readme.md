---
description: Vibe coding guidelines and architectural constraints for Frontend Architecture within the frontend domain.
technology: Frontend Architecture
domain: frontend
level: Senior/Architect
version: Agnostic
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Frontend Architect
last_updated: 2026-03-22
---

# 🎨 Frontend Best Practices & Production-Ready Patterns

# 📖 Context & Scope
- **Primary Goal:** Outline the overarching philosophy and standards for Frontend development inside the ecosystem.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Agnostic

<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" alt="Frontend Logo" width="100" />
  
  **The overarching philosophy and foundations for all internal Frontend technologies.**
</div>

---

## 🏗 Architecture Principles

- Adhere to the defined [Architectural Patterns](../../architectures/readme.md) when building applications.
- Strongly prefer **Feature Sliced Design (FSD)** for applications scaling across multiple teams.

## 🤖 Technical Requirements for AI Generation

> [!IMPORTANT]
> **Constraint:** Do not mutate shared DOM properties directly unless explicitly interacting with Browser APIs outside the framework context.

- **Isolation:** Each component must define its boundaries clearly. Avoid CSS leakage.
- **TypeScript Strictness:** Exploit TypeScript. `any` is strictly prohibited. Use explicit return types for all public methods.
- **State Management:** Abstract global state logically depending on the specific framework rules, but never tightly couple presentation layers directly to store calls.

## 💻 Technologies Included

This folder acts as a container for documentation around the following technologies:
- [Angular](./angular/readme.md)
- [JavaScript](./javascript/readme.md)
- [TypeScript](./typescript/readme.md)
- [SolidJS](./solidjs/readme.md)
- [Qwik](./qwik/readme.md)
