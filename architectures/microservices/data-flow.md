---
technology: Microservices
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Microservices
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
---

# Microservices - Data Flow

## Request and Event Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant API_Gateway
    participant Auth_Service
    participant Product_Service

    Client->>API_Gateway: Request
    API_Gateway->>Auth_Service: Validate Token
    Auth_Service-->>API_Gateway: Valid
    API_Gateway->>Product_Service: Forward Request
    Product_Service-->>API_Gateway: Response
    API_Gateway-->>Client: Payload
```

### Constraints
- Services must be independently deployable.
