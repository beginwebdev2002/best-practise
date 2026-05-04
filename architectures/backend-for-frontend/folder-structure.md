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
    src --|> handlers
    handlers --|> userDashboardHandler_ts
    src --|> config
    src --|> index_ts
    class src:::component
    class handlers:::component
    note for userDashboardHandler_ts "contains routing, business logic, and API calls"
    class userDashboardHandler_ts:::component
    class config:::component
    class index_ts:::component
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
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

```mermaid
classDiagram
    src --|> routes
    routes --|> dashboard_routes_ts
    src --|> controllers
    controllers --|> dashboard_controller_ts
    src --|> services
    services --|> aggregator_service_ts
    src --|> clients
    clients --|> user_client_ts
    clients --|> order_client_ts
    src --|> types
    types --|> dtos_ts
    src --|> app_ts
    class src:::component
    class routes:::component
    class dashboard_routes_ts:::component
    class controllers:::component
    class dashboard_controller_ts:::component
    class services:::component
    class aggregator_service_ts:::component
    class clients:::component
    class user_client_ts:::component
    class order_client_ts:::component
    class types:::component
    class dtos_ts:::component
    class app_ts:::component
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
```

### 🚀 Solution
Separate responsibilities clearly. `routes` handle HTTP concerns. `controllers` parse requests and format responses. `services` (or aggregators) orchestrate the calls to multiple downstream microservices. `clients` isolate the network logic (HTTP/gRPC) for communicating with downstream microservices. This structure enhances testability and maintainability.
