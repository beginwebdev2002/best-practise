---
description: Hexagonal Architecture Data Flow rules for AI agents and developers. Understanding execution sequences across Ports and Adapters.
technology: Hexagonal Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [best-practices, data-flow, hexagonal-architecture, ports-and-adapters]
ai_role: Senior Software Architect
last_updated: 2026-03-22
---

# 🔄 Hexagonal Architecture Data Flow Best Practices

<div align="center">
  **Execution paths and communication between layers.**
</div>

---

## 🔁 The Sequence of Execution

In Hexagonal Architecture, a request from the outside world must pierce through the layers strictly via defined Interfaces (Ports).

```mermaid
sequenceDiagram
    participant UI as Primary Adapter (Controller)
    participant IP as Input Port (Interface)
    participant Domain as Core Domain (Use Case)
    participant OP as Output Port (Interface)
    participant DB as Secondary Adapter (Repository)

    UI->>IP: Invoke Execute(Command)
    IP->>Domain: Transform Command to Domain Logic
    Domain->>OP: Request Data (findById)
    OP->>DB: Perform SQL/NoSQL Query
    DB-->>OP: Return Entity State
    OP-->>Domain: Return Entity
    Domain->>Domain: Apply Business Invariants
    Domain->>OP: Save New State (save)
    OP->>DB: Persist Changes
    DB-->>OP: Ack
    OP-->>Domain: Success
    Domain-->>IP: Return Result/DTO
    IP-->>UI: Form HTTP/RPC Response
```

## ⛔ Boundary Constraints (Data Flow Rules)

1. **No External Imports in Domain:** The Core Domain must NEVER import code from an Adapter (e.g., `import { PostgresDB } from '../adapters/db'`). It only implements Interfaces.
2. **Adapter Injection:** Adapters are injected into the Domain (typically during app startup) via the Output Ports (Interfaces).
3. **Primary vs Secondary:**
   - Primary Adapters (Driving) call the Domain (Input Ports). Examples: REST Controllers, CLI scripts, Event Listeners.
   - Secondary Adapters (Driven) are called by the Domain (Output Ports). Examples: Database Repositories, SMTP Clients, External API clients.
4. **Data Translation:** Data must be mapped at the boundary. Do not pass the internal DB Model directly out to the Primary Adapter. Use DTOs at the Ports.
