---
description: Vibe coding guidelines and architectural constraints for CQRS within the Architecture domain.
tags: [cqrs, architecture, best-practices, architecture]
topic: CQRS
complexity: Architect
last_evolution: 2026-03-29
vibe_coding_ready: true
technology: CQRS
domain: Architecture
level: Senior/Architect
version: Latest
ai_role: Senior CQRS Expert
last_updated: 2026-03-29---# CQRS - Data Flow
## Request and Event Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant CommandBus
    participant CommandHandler
    participant WriteDB
    participant EventBus
    participant QueryHandler
    participant ReadDB

    Client->>CommandBus: Send Command (Mutate)
    CommandBus->>CommandHandler: Execute
    CommandHandler->>WriteDB: Save state
    CommandHandler->>EventBus: Publish Event
    EventBus->>ReadDB: Update Read Model
    Client->>QueryHandler: Request Data (Read)
    QueryHandler->>ReadDB: Fetch
    ReadDB-->>QueryHandler: Data
    QueryHandler-->>Client: Response
```

### Constraints
- Strict separation between mutating operations (Commands) and reading operations (Queries).
