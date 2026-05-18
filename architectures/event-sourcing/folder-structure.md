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
        +CreateOrderCommand.ts
    }
    class events {
        +OrderCreatedEvent.ts
    }
    class aggregates {
        +OrderAggregate.ts
    }
    class projections {
        +OrderReadModelProjector.ts
    }
    class infrastructure {
        +EventStoreRepository.ts
    }

    src *-- commands
    src *-- events
    src *-- aggregates
    src *-- projections
    src *-- infrastructure
```
