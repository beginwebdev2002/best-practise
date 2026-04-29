---
technology: Event-Driven Architecture
domain: Architecture
level: Senior/Architect
version: Latest
tags: [eda, data-flow, sequence-diagram, asynchronous, messaging, event-lifecycle]
ai_role: Senior Event-Driven Architecture Expert
last_updated: 2026-04-29
---


<div align="center">
  # 📊 EDA Data Flow (Sequence Blueprint)
</div>
---

This document illustrates the execution lifecycle of a distributed, asynchronous event-driven system. It defines the path an initial synchronous request takes as it propagates across independent microservices via a message broker.
## Mental Model & Asynchronous Lifecycle

The architectural contract is simple:
- The **Ingress Gateway (API)** accepts the synchronous HTTP request from the User.
- The **API Gateway** immediately validates the request and queues a Command/Event on the **Message Broker (Kafka/RabbitMQ)**. It returns HTTP 202 Accepted.
- Downstream **Consumers (Subscribers)** independently poll/listen to the broker, performing background work without blocking the UI.
- Finally, the UI relies on WebSocket, Server-Sent Events (SSE), or polling for real-time completion status.

> [!IMPORTANT]
> **Data Flow Constraint:** A microservice handling an event MUST NOT synchronously invoke another microservice. It must process the event, update its localized database, and optionally emit a subsequent domain event.

### Sequence Diagram: Distributed E-Commerce Checkout

```mermaid
sequenceDiagram
    autonumber
    actor Client as User (Frontend)
    participant API as API Gateway (REST)
    participant Broker as Message Broker (Kafka)
    participant OrderSvc as Order Service
    participant PaySvc as Payment Service
    participant NotifySvc as Notification Service

    Client->>API: POST /checkout (Cart DTO)
    API-->>Broker: Publish [CheckoutInitiatedEvent]
    API-->>Client: HTTP 202 Accepted (Order Pending)

    Broker-->>OrderSvc: Consume [CheckoutInitiatedEvent]
    OrderSvc->>OrderSvc: Create Pending Order (DB)
    OrderSvc-->>Broker: Publish [OrderCreatedEvent]

    Broker-->>PaySvc: Consume [OrderCreatedEvent]
    PaySvc->>PaySvc: Process Stripe Payment

    alt Payment Success
        PaySvc-->>Broker: Publish [PaymentSucceededEvent]
        Broker-->>OrderSvc: Consume [PaymentSucceededEvent]
        OrderSvc->>OrderSvc: Update Order Status -> Confirmed
        Broker-->>NotifySvc: Consume [PaymentSucceededEvent]
        NotifySvc->>Client: Push Notification / Email (Success)
    else Payment Failure
        PaySvc-->>Broker: Publish [PaymentFailedEvent]
        Broker-->>OrderSvc: Consume [PaymentFailedEvent]
        OrderSvc->>OrderSvc: Update Order Status -> Failed
        Broker-->>NotifySvc: Consume [PaymentFailedEvent]
        NotifySvc->>Client: Push Notification / Email (Failure)
    end
```
---
## The Outbox Pattern (Reliable Publishing)

To ensure dual-write safety (saving state in the local DB and publishing the event to Kafka simultaneously), EDA relies on the **Transactional Outbox Pattern**.

1. The service begins a local DB transaction.
2. The service saves business entity data (e.g., `orders` table).
3. The service inserts an event record in an `outbox` table in the SAME transaction.
4. The service commits the transaction.
5. A background process (e.g., Debezium, CDC) reads the `outbox` table and publishes the messages to Kafka, ensuring "at-least-once" delivery.


```mermaid
graph LR
    A[Begin DB Transaction] --> B[Save Business Entity]
    B --> C[Insert Outbox Event]
    C --> D[Commit Transaction]
    D --> E[Background CDC Process]
    E --> F[Publish to Kafka]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    class A,B,C,D default;
    class E,F component;
```

---

<div align="center">
  [Back to Main Blueprint](./readme.md) <br><br>
  <b>Master the event lifecycle to prevent distributed monoliths! 🌊</b>
</div>
