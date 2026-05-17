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
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    class Node1_src {
        src/
    }
    cssClass "Node1_src" default
    class Node2_commands {
        commands/
    }
    Node1_src *-- Node2_commands
    cssClass "Node2_commands" default
    class Node3_CreateOrderCommandts {
        CreateOrderCommand.ts
    }
    Node2_commands *-- Node3_CreateOrderCommandts
    cssClass "Node3_CreateOrderCommandts" component
    class Node4_events {
        events/
    }
    Node1_src *-- Node4_events
    cssClass "Node4_events" default
    class Node5_OrderCreatedEventts {
        OrderCreatedEvent.ts
    }
    Node4_events *-- Node5_OrderCreatedEventts
    cssClass "Node5_OrderCreatedEventts" component
    class Node6_aggregates {
        aggregates/
    }
    Node1_src *-- Node6_aggregates
    cssClass "Node6_aggregates" default
    class Node7_OrderAggregatets {
        OrderAggregate.ts
    }
    Node6_aggregates *-- Node7_OrderAggregatets
    cssClass "Node7_OrderAggregatets" component
    class Node8_projections {
        projections/
    }
    Node1_src *-- Node8_projections
    cssClass "Node8_projections" default
    class Node9_OrderReadModelProjectorts {
        OrderReadModelProjector.ts
    }
    Node8_projections *-- Node9_OrderReadModelProjectorts
    cssClass "Node9_OrderReadModelProjectorts" component
    class Node10_infrastructure {
        infrastructure/
    }
    Node1_src *-- Node10_infrastructure
    cssClass "Node10_infrastructure" default
    class Node11_EventStoreRepositoryts {
        EventStoreRepository.ts
    }
    Node10_infrastructure *-- Node11_EventStoreRepositoryts
    cssClass "Node11_EventStoreRepositoryts" component
```
