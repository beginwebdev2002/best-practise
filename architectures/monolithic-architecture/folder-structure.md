---
description: Vibe coding guidelines and architectural constraints for Monolithic Architecture within the Architecture domain.
tags: [monolithic-architecture, architecture, best-practices, architecture]
topic: Monolithic Architecture
complexity: Architect
last_evolution: 2026-03-29
vibe_coding_ready: true
technology: Monolithic Architecture
domain: Architecture
level: Senior/Architect
version: Latest
ai_role: Senior Monolithic Architecture Expert
last_updated: 2026-03-29---# Monolithic Architecture - Folder Structure
## Layering logic

```mermaid
graph TD
    App[src/] --> Modules[modules/]
    Modules --> Auth[auth/]
    Modules --> Billing[billing/]
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class App layout;
    class Modules layout;
    class Auth component;
    class Billing component;
```

### Constraints
- Strict modular boundaries to prevent spaghetti code.
