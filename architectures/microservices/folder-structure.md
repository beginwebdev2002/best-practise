---
description: Vibe coding guidelines and architectural constraints for Vibe Coding within the Architecture domain.
tags: [vibe-coding, architecture, best-practices, architecture]
topic: Vibe Coding
complexity: Architect
last_evolution: 2026-03-29
vibe_coding_ready: true
technology: Vibe Coding
domain: Architecture
level: Senior/Architect
version: Latest
ai_role: Senior Vibe Coding Expert
last_updated: 2026-03-29---# Microservices - Folder Structure
## Layering logic

```mermaid
graph TD
    System[Platform/] --> Svc1[auth-service/]
    System --> Svc2[order-service/]
    Svc1 --> Svc1DB[(Auth DB)]
    Svc2 --> Svc2DB[(Order DB)]
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class System layout;
    class Svc1 component;
    class Svc2 component;
    class Svc1DB component;
    class Svc2DB component;
```

### Constraints
- Each service owns its database.
