---
technology: Event-Driven Architecture
domain: Architecture
level: Senior/Architect
version: Latest
tags: [eda, event-driven, architecture, pub-sub, asynchronous, messaging, kafka, rabbitmq, system-design]
ai_role: Senior Event-Driven Architecture Expert
last_updated: 2026-03-29
---


<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg" width="80" alt="Kafka Logo"/>

  # 📨 Event-Driven Architecture (EDA) Blueprint
</div>
---

This engineering directive contains strict architectural guidelines and 2026-grade patterns for using Event-Driven Architecture (EDA) to build highly scalable, decoupled, and fault-tolerant backend systems.
## Context & Scope
- **Primary Goal:** Provide a determinist structural blueprint for managing asynchronous communication across autonomous microservices or domains using event streams and message brokers.
- **Target Tooling:** AI Agents (Cursor, Copilot) and Senior/Architect Developers.
- **Tech Stack Version:** Agnostic (Kafka, RabbitMQ, AWS EventBridge, Redis Pub/Sub, Node.js, Spring Boot).

> [!NOTE]
> **Architectural Contract:** System components MUST NOT depend on one another synchronously for state mutations. Components merely emit events (Publish) and react to events (Subscribe) via an intermediary broker, maintaining strict decoupling.
## Specialized Modules (Map of Patterns)
To deeply understand the nuances of EDA, consult the following specialized modules:

- 📊 [**Data Flow:** Request and Event Lifecycle](./data-flow.md)
- 📁 [**Folder Structure:** Layering Publisher/Subscriber logic](./folder-structure.md)
- ⚖️ [**Trade-offs:** Pros, Cons, and System Constraints](./trade-offs.md)
- 🛠️ [**Implementation Guide:** Code patterns and Anti-patterns](./implementation-guide.md)
---

### Structural Comparison: Event-Driven vs Request-Response

| Feature | Event-Driven Architecture | Request-Response (REST/RPC) |
| :--- | :--- | :--- |
| **Coupling** | Loose (Producers don't know consumers) | Tight (Client knows server address) |
| **Communication** | Asynchronous | Synchronous (usually) |
| **Resilience** | High (Messages can be queued if consumer is down) | Lower (Fails if server is down) |
| **Scalability** | Excellent (Easy to add new consumers) | Good (Requires load balancing) |
| **Complexity** | High (Eventual consistency, tracking flows) | Low (Straightforward flows) |

## Core Principles

1. **Asynchronous by Default:** Synchronous RPC (REST/gRPC) is restricted only to immediate read-queries or initial gateway ingress. All inter-service state mutations must occur asynchronously.
2. **Event Sourcing (Optional but Recommended):** State is derived from an immutable, append-only log of events rather than overwriting records in a database.
3. **Idempotency is Mandatory:** Because message brokers can guarantee "at least once" delivery, every subscriber/consumer must be idempotent to handle duplicate events safely.
---

<div align="center">
  [Back to Architecture Map](../readme.md) <br><br>
  <b>Adhere to these EDA principles to establish a relentlessly scalable, highly-decoupled system ecosystem! 🚀</b>
</div>

## 1. Synchronous Blocking on Events

### ❌ Bad Practice
```typescript
class OrderService {
  async createOrder(data: OrderData) {
    const order = await this.db.orders.save(data);

    // BAD: Synchronously waiting for another service's event bus
    // If the payment service is slow or down, this entire request fails
    const paymentResult = await this.eventBus.publishAndWait('OrderCreated', order);

    return { order, paymentStatus: paymentResult };
  }
}
```

### ⚠️ Problem
Treating an event bus like an RPC (Remote Procedure Call) mechanism defeats the purpose of EDA. Synchronous waiting re-introduces tight temporal coupling. If the consumer is slow, it blocks the producer, leading to cascading failures and timeouts across the system.

### ✅ Best Practice
```typescript
class OrderService {
  async createOrder(data: OrderData) {
    // 1. Save local state
    const order = await this.db.orders.save({ ...data, status: 'PENDING' });

    // 2. Fire and forget the event (Asynchronous)
    await this.eventBus.publish('OrderCreated', { orderId: order.id });

    // 3. Immediately return success to the client
    return { orderId: order.id, status: 'PROCESSING_PAYMENT' };
  }
}
```

### 🚀 Solution
Strictly enforce asynchronous "fire-and-forget" behavior for events. The producer MUST NOT wait for a response from the consumer. Use eventual consistency and asynchronous workflows (e.g., WebSockets, polling, or client-side subscriptions) to handle the outcome of the event processing.
