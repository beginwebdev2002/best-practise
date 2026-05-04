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
    src --|> commands
    commands --|> CreateOrderCommand_ts
    src --|> events
    events --|> OrderCreatedEvent_ts
    src --|> aggregates
    aggregates --|> OrderAggregate_ts
    src --|> projections
    projections --|> OrderReadModelProjector_ts
    src --|> infrastructure
    infrastructure --|> EventStoreRepository_ts
    class src:::component
    note for commands "Intentions to change state"
    class commands:::component
    class CreateOrderCommand_ts:::component
    note for events "Facts that have occurred"
    class events:::component
    class OrderCreatedEvent_ts:::component
    note for aggregates "Domain entities that process commands and emit events"
    class aggregates:::component
    class OrderAggregate_ts:::component
    note for projections "Listeners that update read models based on events"
    class projections:::component
    class OrderReadModelProjector_ts:::component
    note for infrastructure "Event Store bindings, Repositories, Message Bus"
    class infrastructure:::component
    class EventStoreRepository_ts:::component
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
```
