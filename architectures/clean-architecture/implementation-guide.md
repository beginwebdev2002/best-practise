---
technology: Clean-architecture
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Clean-architecture
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
---

# Clean Architecture - Implementation Guide

## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class UseCase {
        +execute()
    }
    class Entity {
        +validate()
    }
    class RepositoryInterface {
        <<interface>>
        +save()
    }
    UseCase --> Entity
    UseCase --> RepositoryInterface
```

### Rules
- Dependency Inversion Principle must be strictly followed.
- Entities encapsulate the most general and high-level rules.
