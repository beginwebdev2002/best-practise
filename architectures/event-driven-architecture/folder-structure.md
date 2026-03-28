---
description: Vibe coding guidelines for the folder structure and structural hierarchy of Event-Driven Architecture (EDA) projects.
technology: Event-Driven Architecture
domain: Architecture
complexity: Architect
last_evolution: 2026-03-27
vibe_coding_ready: true
tags: [eda, folder-structure, architecture-hierarchy, backend, microservices]
topic: Event-Driven Folder Structure
---

<div align="center">
  # 📁 EDA Folder Structure (Hierarchy Blueprint)
</div>

---

This document outlines the optimal 2026-grade folder structure for an Event-Driven microservice (or bounded context). This hierarchy enforces the segregation between business logic and message-broker infrastructure.

## Folder Hierarchy (Mental Model)

A robust EDA microservice separates its core domain from its external adapters (Publishers and Subscribers). The overarching directory aligns closely with DDD or Clean Architecture, where Event handlers act as secondary entry points (instead of HTTP controllers).

> [!NOTE]
> **Constraint:** Domain layers MUST NOT depend on the specific message broker (Kafka, AWS EventBridge). Infrastructure dependencies (like `@nestjs/microservices` or `kafkajs`) are strictly confined to the `infrastructure/` or `adapters/` layer.

### System Diagram: Layered Hierarchy

```mermaid
graph TD
    Root[Microservice Root] --> Domain[core/domain]
    Root --> App[core/application]
    Root --> Infra[infrastructure]

    Infra --> DB[database (Adapters)]
    Infra --> Msg[messaging (Broker Integrations)]

    Msg --> Pub[publishers (Producers)]
    Msg --> Sub[subscribers (Consumers)]
    Msg --> Config[kafka-config]

    App --> Handlers[Command/Event Handlers]
    Handlers -.-> Pub

    %% Apply strict styling tokens
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Root layout;
    class Domain,App,Handlers component;
    class Infra,DB,Msg,Pub,Sub,Config default;
```

---

## Detailed Directory Tree

```text
src/
├── 📁 core/                             # Pure business logic (No infra dependencies)
│   ├── 📁 domain/                       # Aggregates, Value Objects, Domain Events
│   │   ├── events/                      # Internal domain event types (e.g., OrderCreated)
│   │   └── models/                      # Business entities
│   └── 📁 application/                  # Use cases orchestration
│       ├── commands/                    # Sync logic executed before emitting events
│       └── handlers/                    # Logic that responds to consumed events
│
├── 📁 infrastructure/                   # Framework and Broker integrations
│   ├── 📁 messaging/                    # The Event-Driven core
│   │   ├── 📁 config/                   # Kafka client configuration, schemas
│   │   ├── 📁 publishers/               # Outbound adapters (Emit events to Broker)
│   │   │   └── OrderPublisher.ts        # Implements IEventPublisher from Core
│   │   ├── 📁 subscribers/              # Inbound adapters (Listen to Broker queues)
│   │   │   └── PaymentConsumer.ts       # Routes Kafka messages to Application handlers
│   │   └── 📁 schemas/                  # AsyncAPI/Avro/Protobuf message schemas
│   └── 📁 database/                     # DB adapters (Repositories, Outbox pattern)
│
└── main.ts                              # Application bootstrap (Starts HTTP + Consumers)
```

### Explanation of Key Directories

1. **`core/domain/events/`**: These are internal representations of an event. They are purely business-focused (e.g., `OrderPlacedDomainEvent`). They know nothing about Kafka serialization.
2. **`infrastructure/messaging/publishers/`**: This directory contains implementations of your output ports. It serializes the internal domain event into a payload (JSON/Avro) and publishes it to the external topic.
3. **`infrastructure/messaging/subscribers/`**: This directory acts exactly like HTTP Controllers. A consumer listens to a Kafka topic, deserializes the message, and hands it off to a `core/application/handlers/` class to perform the actual business logic.
4. **`infrastructure/messaging/schemas/`**: Strongly-typed schemas (like Protobuf or Avro) defining the contract for events passing through the broker.

---

<div align="center">
  [Back to Main Blueprint](./readme.md) <br><br>
  <b>A clean directory tree prevents tightly-coupled broker dependencies! 📁</b>
</div>
