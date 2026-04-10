---
technology: Event Sourcing
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, data-flow, event-sourcing, best-practices]
ai_role: Senior Architect
last_updated: 2026-03-29
---

<div align="center">
  # 📊 Event Sourcing Data Flow
</div>

---

## The Request and Event Lifecycle

In Event Sourcing, the flow of data is distinct from traditional CRUD applications.

1. **Command Execution:** The client sends a Command (e.g., `CreateOrderCommand`) to the Application Service.
2. **State Reconstruction:** The Application Service loads the Aggregate from the Event Store by fetching all past events for that Aggregate ID and replaying them sequentially to reconstruct the current state.
3. **Business Logic Evaluation:** The Aggregate evaluates the Command against its current state to ensure business invariants are met.
4. **Event Emission:** If the Command is valid, the Aggregate produces one or more Events (e.g., `OrderCreatedEvent`) representing the outcome.
5. **Event Persistence:** The new Events are appended to the Event Store. This is the single source of truth.
6. **Projection:** A message broker or Event Bus listens to the Event Store and publishes the new events. Projectors consume these events to update separated Read Models (CQRS), ensuring queries are highly optimized.
