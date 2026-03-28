---
description: Vibe coding guidelines and architectural constraints for Event-Driven Architecture (EDA) within the Architecture domain.
technology: Event-Driven Architecture
domain: Architecture
complexity: Architect
last_evolution: 2026-03-27
vibe_coding_ready: true
tags: [eda, event-driven, architecture, pub-sub, asynchronous, messaging, kafka, rabbitmq, system-design]
topic: Event-Driven Architecture
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

## Core Principles

1. **Asynchronous by Default:** Synchronous RPC (REST/gRPC) is restricted only to immediate read-queries or initial gateway ingress. All inter-service state mutations must occur asynchronously.
2. **Event Sourcing (Optional but Recommended):** State is derived from an immutable, append-only log of events rather than overwriting records in a database.
3. **Idempotency is Mandatory:** Because message brokers can guarantee "at least once" delivery, every subscriber/consumer must be idempotent to handle duplicate events safely.

---

<div align="center">
  [Back to Architecture Map](../readme.md) <br><br>
  <b>Adhere to these EDA principles to establish a relentlessly scalable, highly-decoupled system ecosystem! 🚀</b>
</div>
