---
technology: Domain-driven-design
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Domain-driven-design
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
---

# Domain-Driven Design - Implementation Guide

## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class AggregateRoot {
        +List~Entity~ entities
        +commitEvents()
    }
    class ValueObject {
        +equals()
    }
    AggregateRoot "1" *-- "many" ValueObject
```

### Rules
- Ubiquitous language must be strictly used in code.
