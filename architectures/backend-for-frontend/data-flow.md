---
technology: Backend-For-Frontend (BFF)
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, data-flow, system-design, bff, backend-for-frontend]
ai_role: Senior Architect
last_updated: 2026-04-28
---

<div align="center">
  # 📊 Backend-For-Frontend (BFF) Data Flow
</div>

---

## Request Lifecycle

The BFF acts as a dedicated intermediary between a specific client and multiple downstream microservices.

```mermaid
sequenceDiagram
    actor MobileClient as Mobile Client
    participant MobileBFF as Mobile BFF
    participant UserService as User Microservice
    participant OrderService as Order Microservice

    MobileClient->>MobileBFF: GET /api/v1/dashboard
    activate MobileBFF

    par Parallel Downstream Requests
        MobileBFF->>UserService: GET /users/me
        MobileBFF->>OrderService: GET /orders?recent=true
    end

    UserService-->>MobileBFF: User Profile Data
    OrderService-->>MobileBFF: Recent Orders Data

    Note over MobileBFF: Aggregate, filter, and format data<br/>specifically for mobile UI

    MobileBFF-->>MobileClient: Formatted Dashboard JSON
    deactivate MobileBFF
```

## Core Principles

1. **Aggregation:** The BFF aggregates responses from multiple services to reduce the number of client-side requests.
2. **Formatting:** The BFF formats data precisely according to what the client needs, stripping out unnecessary fields to save bandwidth.
3. **Protocol Translation:** The BFF can translate between client-friendly protocols (e.g., HTTP/REST, GraphQL) and internal service protocols (e.g., gRPC, AMQP).



```mermaid
graph LR
    A[Aggregation] --> B[Formatting]
    B --> C[Protocol Translation]
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    class A,B,C default;
```
