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
    note for src "Root Source Directory"
    class commands:::component
    note for commands "Intentions to change state"
    class events:::component
    note for events "Facts that have occurred"
    class aggregates:::component
    note for aggregates "Domain entities that process commands/events"
    class projections:::component
    note for projections "Listeners that update read models"
    class infrastructure:::component
    note for infrastructure "Event Store bindings, Repositories, Bus"

    src *-- commands
    src *-- events
    src *-- aggregates
    src *-- projections
    src *-- infrastructure

    %% Design Token Adherence
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```
