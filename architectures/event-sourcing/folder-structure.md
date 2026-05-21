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
    class commands {
        +CreateOrderCommand
    }
    class events {
        +OrderCreatedEvent
    }
    class aggregates {
        +OrderAggregate
    }
    class projections {
        +OrderReadModelProjector
    }
    class infrastructure {
        +EventStoreRepository
    }

    commands ..> aggregates : Intentions
    aggregates ..> events : Emits
    events ..> projections : Updates Read Model
    aggregates ..> infrastructure : Stored in Event Store

    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;

    class commands:::default
    class events:::default
    class aggregates:::component
    class projections:::component
    class infrastructure:::default
```
