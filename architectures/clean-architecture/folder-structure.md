---
description: Vibe coding guidelines and architectural constraints for Clean Architecture within the Architecture domain.
tags: [clean-architecture, architecture, best-practices, architecture]
topic: Clean Architecture
complexity: Architect
last_evolution: 2026-03-29
vibe_coding_ready: true
technology: Clean Architecture
domain: Architecture
level: Senior/Architect
version: Latest
ai_role: Senior Clean Architecture Expert
last_updated: 2026-03-29---# Clean Architecture - Folder Structure
## Layering publisher/subscriber logic

```mermaid
graph TD
    App[src/] --> Web[infrastructure/web]
    App --> Db[infrastructure/db]
    App --> Core[core/]
    Core --> UseCases[use-cases/]
    Core --> Entities[entities/]
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class App layout;
    class Web component;
    class Db component;
    class Core layout;
    class UseCases component;
    class Entities component;
```

### Constraints
- Inner layers cannot import from outer layers.
