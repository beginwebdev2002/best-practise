---
description: Vibe coding guidelines and architectural constraints for CQRS (Command Query Responsibility Segregation) within the Architecture domain.
technology: CQRS (Command Query Responsibility Segregation)
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, system-design, cqrs, best-practices]
ai_role: Senior Architect
last_updated: 2026-03-22
topic: CQRS
complexity: Architect
last_evolution: 2026-03-29
vibe_coding_ready: true---


<div align="center">
  # 🏛️ CQRS (Command Query Responsibility Segregation) Production-Ready Best Practices
</div>
---

Этот инженерный директив определяет **лучшие практики (best practices)** для архитектуры CQRS (Command Query Responsibility Segregation). Данный документ спроектирован для обеспечения максимальной масштабируемости, безопасности и качества кода при разработке приложений корпоративного уровня.
# Context & Scope
- **Primary Goal:** Предоставить строгие архитектурные правила и практические паттерны для создания масштабируемых систем.
- **Description:** A powerful pattern where Commands (actions that mutate system data) are entirely decoupled from Queries (actions that only read data).
## Map of Patterns
- 📊 [**Data Flow:** Request and Event Lifecycle](./data-flow.md)
- 📁 [**Folder Structure:** Layering logic](./folder-structure.md)
- ⚖️ [**Trade-offs:** Pros, Cons, and System Constraints](./trade-offs.md)
- 🛠️ [**Implementation Guide:** Code patterns and Anti-patterns](./implementation-guide.md)
## Core Principles

1. **Isolation & Testability:** Changing a single feature doesn't break the entire business process.
2. **Strict Boundaries:** Enforce rigid structural barriers between business logic and infrastructure.
3. **Decoupling:** Decouple how data is stored from how it is queried and displayed.
