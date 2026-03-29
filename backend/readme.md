---
description: Vibe coding guidelines and architectural constraints for Backend Architecture within the backend domain.
technology: Backend Architecture
domain: backend
level: Senior/Architect
version: Agnostic
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Backend Architect
last_updated: 2026-03-22
---

# Backend Best Practices & Production-Ready Patterns

# Context & Scope
- **Primary Goal:** Outline the overarching philosophy and standards for Backend and system development inside the ecosystem.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Agnostic

<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NodeJS-Dark.svg" alt="Backend Logo" width="100" />
  
  **The foundational rules and standards governing backend logic.**
</div>

---

## Architecture Principles

- Adhere to the defined [Architectural Patterns](../../architectures/readme.md) when building applications, specifically Hexagonal Architecture / Clean Architecture.
- Avoid tightly coupling business domains to framework-specific libraries.

## Technical Requirements for AI Generation

> [!IMPORTANT]
> **Constraint:** Never allow Database Object Relational Mapping (ORM) models to bleed into standard HTTP responses. Always map through a DTO.

- **Security First:** Validate all inputs using schema validations. Assume all external input is malicious.
- **TypeScript Strictness:** `any` is strictly prohibited. Enforce boundary definitions between the transport and core logic layers.

## Technologies Included


This folder acts as a container for documentation around the following backend technologies:
- [NestJS](./nestjs/readme.md)
- [ExpressJS](./expressjs/readme.md)
- [Node.js](./nodejs/readme.md)
- [PostgreSQL](./postgresql/readme.md)
- [MongoDB](./mongodb/readme.md)
- [Redis](./redis/readme.md)
- [Microservices](./microservices/readme.md)
