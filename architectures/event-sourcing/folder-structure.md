---
technology: Event Sourcing
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, folder-structure, event-sourcing, best-practices]
ai_role: Senior Architect
last_updated: 2026-03-29
---

<div align="center">
  # 📁 Event Sourcing Folder Structure
</div>

---

## Directory Blueprint

```text
src/
├── 📁 commands/            # Intentions to change state
│   └── CreateOrderCommand.ts
├── 📁 events/              # Facts that have occurred
│   └── OrderCreatedEvent.ts
├── 📁 aggregates/          # Domain entities that process commands and emit events
│   └── OrderAggregate.ts
├── 📁 projections/         # Listeners that update read models based on events
│   └── OrderReadModelProjector.ts
└── 📁 infrastructure/      # Event Store bindings, Repositories, Message Bus
    └── EventStoreRepository.ts
```

```mermaid
classDiagram
    class src {
    }
    class commands {
        Intentions to change state
    }
    class events {
        Facts that have occurred
    }
    class aggregates {
        Domain entities that process commands
    }
    class projections {
        Listeners that update read models
    }
    class infrastructure {
        Event Store bindings
    }

    src *-- commands
    src *-- events
    src *-- aggregates
    src *-- projections
    src *-- infrastructure

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    class src,commands,events,aggregates,projections,infrastructure default;
```
