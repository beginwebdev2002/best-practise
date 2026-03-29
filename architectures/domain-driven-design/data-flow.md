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

# Domain-Driven Design - Data Flow

## Request and Event Lifecycle

```mermaid
sequenceDiagram
    participant UI
    participant ApplicationService
    participant AggregateRoot
    participant Repository

    UI->>ApplicationService: Use Case Request
    ApplicationService->>Repository: Get Aggregate
    Repository-->>ApplicationService: Aggregate
    ApplicationService->>AggregateRoot: Execute Behavior
    ApplicationService->>Repository: Save Aggregate
    Repository-->>ApplicationService: Success
    ApplicationService-->>UI: Response
```

### Constraints
- State mutation must be coordinated through an Aggregate Root.
