---
technology: DDD
domain: Architecture
level: Senior/Architect
version: Latest
tags: [ddd, architecture, best-practices, architecture]
ai_role: Senior DDD Expert
last_updated: 2026-04-28
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
