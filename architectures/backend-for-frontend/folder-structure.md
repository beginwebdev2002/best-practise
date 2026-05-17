---
technology: Backend-For-Frontend (BFF)
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, folder-structure, bff, backend-for-frontend]
ai_role: Senior Architect
last_updated: 2026-03-29
---

<div align="center">
  # 📁 Backend-For-Frontend (BFF) Folder Structure
</div>

---

## Architecture Diagram & Folder Tree

```mermaid
graph TD
    Client[Web/Mobile Client] --> Routes[API Routes]
    Routes --> Controllers[Controllers/Resolvers]
    Controllers --> Aggregators[Data Aggregators]
    Aggregators --> Clients[Microservice Clients]
    Clients --> Microservices[(Downstream Microservices)]

    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Routes component;
    class Controllers component;
    class Aggregators component;
    class Clients component;
```

---

## 1. Directory Blueprint

### ❌ Bad Practice
```text
src/
├── handlers/
│   └── userDashboardHandler.ts (contains routing, business logic, and API calls)
├── config/
└── index.ts
```
```mermaid
classDiagram
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    class Node1_src {
        src/
    }
    cssClass "Node1_src" default
    class Node2_handlers {
        handlers/
    }
    Node1_src *-- Node2_handlers
    cssClass "Node2_handlers" default
    class Node3_userDashboardHandlertscontainsroutingbusinesslogicandAPIcalls {
        userDashboardHandler.ts (contains routing, business logic, and API calls)
    }
    Node2_handlers *-- Node3_userDashboardHandlertscontainsroutingbusinesslogicandAPIcalls
    cssClass "Node3_userDashboardHandlertscontainsroutingbusinesslogicandAPIcalls" component
    class Node4_config {
        config/
    }
    Node1_src *-- Node4_config
    cssClass "Node4_config" default
    class Node5_indexts {
        index.ts
    }
    Node1_src *-- Node5_indexts
    cssClass "Node5_indexts" component
```

### ⚠️ Problem
Placing routing, data aggregation, and downstream API calls in a single handler creates a monolithic structure within the BFF. It makes testing difficult, limits code reuse, and violates the single responsibility principle.

### ✅ Best Practice
```text
src/
├── routes/
│   └── dashboard.routes.ts
├── controllers/
│   └── dashboard.controller.ts
├── services/
│   └── aggregator.service.ts
├── clients/
│   ├── user.client.ts
│   └── order.client.ts
├── types/
│   └── dtos.ts
└── app.ts
```

### 🚀 Solution
Separate responsibilities clearly. `routes` handle HTTP concerns. `controllers` parse requests and format responses. `services` (or aggregators) orchestrate the calls to multiple downstream microservices. `clients` isolate the network logic (HTTP/gRPC) for communicating with downstream microservices. This structure enhances testability and maintainability.
