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
    class src
    class commands
    class events
    class aggregates
    class projections
    class infrastructure

    src --> commands
    src --> events
    src --> aggregates
    src --> projections
    src --> infrastructure

    note for commands "Intentions to change state\nCreateOrderCommand.ts"
    note for events "Facts that have occurred\nOrderCreatedEvent.ts"
    note for aggregates "Domain entities that process commands and emit events\nOrderAggregate.ts"
    note for projections "Listeners that update read models based on events\nOrderReadModelProjector.ts"
    note for infrastructure "Event Store bindings, Repositories, Message Bus\nEventStoreRepository.ts"

    cssClass src layout
    cssClass commands component
    cssClass events component
    cssClass aggregates component
    cssClass projections component
    cssClass infrastructure component
```

```mermaid
classDiagram
    class src
    class commands
    class events
    class aggregates
    class projections
    class infrastructure

    src --> commands
    src --> events
    src --> aggregates
    src --> projections
    src --> infrastructure

    note for commands "Intentions to change state\nCreateOrderCommand.ts"
    note for events "Facts that have occurred\nOrderCreatedEvent.ts"
    note for aggregates "Domain entities that process commands and emit events\nOrderAggregate.ts"
    note for projections "Listeners that update read models based on events\nOrderReadModelProjector.ts"
    note for infrastructure "Event Store bindings, Repositories, Message Bus\nEventStoreRepository.ts"

    cssClass src layout
    cssClass commands component
    cssClass events component
    cssClass aggregates component
    cssClass projections component
    cssClass infrastructure component
```

```mermaid
classDiagram
    class src:::layout
    class commands:::component
    class events:::component
    class aggregates:::component
    class projections:::component
    class infrastructure:::component

    src --> commands
    src --> events
    src --> aggregates
    src --> projections
    src --> infrastructure

    note for commands "Intentions to change state\nCreateOrderCommand.ts"
    note for events "Facts that have occurred\nOrderCreatedEvent.ts"
    note for aggregates "Domain entities that process commands and emit events\nOrderAggregate.ts"
    note for projections "Listeners that update read models based on events\nOrderReadModelProjector.ts"
    note for infrastructure "Event Store bindings, Repositories, Message Bus\nEventStoreRepository.ts"

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;
```
