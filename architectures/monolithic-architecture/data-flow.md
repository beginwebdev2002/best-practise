---
technology: Monolithic-architecture
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Monolithic-architecture
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
---

# Monolithic Architecture - Data Flow

## Request and Event Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant LoadBalancer
    participant Monolith
    participant Database

    Client->>LoadBalancer: Request
    LoadBalancer->>Monolith: Route
    Monolith->>Database: Query
    Database-->>Monolith: Data
    Monolith-->>Client: Response
```

### Constraints
- All bounded contexts run in the same process.
