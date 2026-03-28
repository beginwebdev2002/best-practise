---
description: Vibe coding guidelines and constraints for the trade-offs, pros, cons, and anti-patterns of Event-Driven Architecture (EDA).
technology: Event-Driven Architecture
domain: Architecture
complexity: Architect
last_evolution: 2026-03-27
vibe_coding_ready: true
tags: [eda, trade-offs, architecture, messaging, kafka]
topic: Event-Driven Trade-offs
---

<div align="center">
  # ⚖️ EDA Trade-offs (Pros & Cons Blueprint)
</div>

---

This document outlines the high-level trade-offs associated with Event-Driven Architecture. EDA introduces incredible scalability and loose coupling but incurs extreme operational complexity, eventual consistency, and distributed debugging challenges.

## 1. High-Level Comparison

| 🌟 **Pros (Advantages)** | ⚠️ **Cons (Disadvantages)** |
| ------------------------ | --------------------------- |
| **Loose Coupling:** Services act independently without knowing about the existence of other services. | **Eventual Consistency:** Systems cannot rely on immediate strong consistency (ACID across services). |
| **High Availability:** If a downstream service crashes, the broker queues the message until the service recovers. | **Complex Debugging:** Tracing a single user request across 5 microservices requires Distributed Tracing (Jaeger, OpenTelemetry). |
| **Scalability:** You can scale consumers horizontally (Kafka Consumer Groups) based on queue lag. | **Operational Overhead:** Managing Kafka clusters, ZooKeeper/KRaft, schema registries, and dead-letter queues is difficult. |
| **Extensibility:** Adding a new feature (e.g., a new Notification Service) requires zero changes to the Publisher. | **Duplicate Events:** Brokers guarantee "at-least-once" delivery. Consumers MUST be strictly idempotent. |
| **Polyglot Systems:** Microservices can be written in any language as long as they adhere to the broker protocol and schema. | **Dual-Write Problem:** Guaranteeing a local DB commit and a Kafka publish simultaneously requires the Outbox Pattern. |

---

## 2. Distributed Anti-Patterns

### ❌ The "Distributed Monolith"
**Symptom:** Microservices communicate via events, but they expect an immediate asynchronous response via a "reply queue" (RPC over Kafka). The system halts if the response event is not received within a timeout.
**Resolution:** Services must rely on Choreography or Orchestration (Saga Pattern) rather than synchronous-style request/reply over a message broker.

### ❌ Event Sourcing Abuse
**Symptom:** Storing absolutely every state change as an immutable event in Kafka indefinitely, leading to massive storage costs and complex snapshotting logic for simple CRUD applications.
**Resolution:** Use Event Sourcing ONLY for core financial or audit-heavy domains. Use standard State-Oriented CRUD for basic entities.

### ❌ Shared Database Integration
**Symptom:** Two microservices communicate via Kafka, but both services still connect to the same PostgreSQL database directly to read/write state.
**Resolution:** Strictly adhere to the "Database-per-Service" pattern. Services must rely on their own materialized views built from consuming events.

---

<div align="center">
  [Back to Main Blueprint](./readme.md) <br><br>
  <b>Master these trade-offs to avoid engineering distributed chaos! ⚖️</b>
</div>
