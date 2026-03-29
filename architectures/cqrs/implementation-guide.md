---
technology: Cqrs
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Cqrs
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
---

# CQRS - Implementation Guide

## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class Command {
        +String id
    }
    class Query {
        +String filter
    }
    class CommandHandler {
        +handle(Command)
    }
    class QueryHandler {
        +handle(Query)
    }
    CommandHandler --> Command
    QueryHandler --> Query
```

### Rules
- Never return business data from a Command (only ack or id).
- Queries must never mutate state.
