---
technology: Space-Based Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, folder-structure, space-based-architecture, best-practices]
ai_role: Senior Architect
last_updated: 2026-03-29
---

<div align="center">
  # 📁 Space-Based Architecture Folder Structure
</div>

---

This document outlines the strict directory blueprints for organizing logic within a Space-Based Architecture system.

```text
src/
├── api-gateway/            # Routing and basic validation
│   ├── routes/
│   └── middleware/
├── middleware/             # Virtualized middleware for processing unit routing
│   ├── load-balancer/
│   └── data-router/
├── processing-units/       # Independent processing components
│   ├── auth-unit/
│   │   ├── logic/
│   │   └── data-access/  # Communicates with IMDG
│   └── catalog-unit/
│       ├── logic/
│       └── data-access/
├── data-grid/              # IMDG configuration and schema definitions
│   ├── schemas/
│   └── config/
└── data-pumps/             # Background services syncing IMDG to DB
    ├── writers/
    └── recovery/
```
```mermaid
classDiagram
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    class Node1_src {
        src/
    }
    cssClass "Node1_src" default
    class Node2_apigateway {
        api-gateway/
    }
    Node1_src *-- Node2_apigateway
    cssClass "Node2_apigateway" default
    class Node3_routes {
        routes/
    }
    Node2_apigateway *-- Node3_routes
    cssClass "Node3_routes" default
    class Node4_middleware {
        middleware/
    }
    Node2_apigateway *-- Node4_middleware
    cssClass "Node4_middleware" default
    class Node5_middleware {
        middleware/
    }
    Node1_src *-- Node5_middleware
    cssClass "Node5_middleware" default
    class Node6_loadbalancer {
        load-balancer/
    }
    Node5_middleware *-- Node6_loadbalancer
    cssClass "Node6_loadbalancer" default
    class Node7_datarouter {
        data-router/
    }
    Node5_middleware *-- Node7_datarouter
    cssClass "Node7_datarouter" default
    class Node8_processingunits {
        processing-units/
    }
    Node1_src *-- Node8_processingunits
    cssClass "Node8_processingunits" default
    class Node9_authunit {
        auth-unit/
    }
    Node8_processingunits *-- Node9_authunit
    cssClass "Node9_authunit" default
    class Node10_logic {
        logic/
    }
    Node9_authunit *-- Node10_logic
    cssClass "Node10_logic" default
    class Node11_dataaccess {
        data-access/
    }
    Node9_authunit *-- Node11_dataaccess
    cssClass "Node11_dataaccess" default
    class Node12_catalogunit {
        catalog-unit/
    }
    Node8_processingunits *-- Node12_catalogunit
    cssClass "Node12_catalogunit" default
    class Node13_logic {
        logic/
    }
    Node12_catalogunit *-- Node13_logic
    cssClass "Node13_logic" default
    class Node14_dataaccess {
        data-access/
    }
    Node12_catalogunit *-- Node14_dataaccess
    cssClass "Node14_dataaccess" default
    class Node15_datagrid {
        data-grid/
    }
    Node1_src *-- Node15_datagrid
    cssClass "Node15_datagrid" default
    class Node16_schemas {
        schemas/
    }
    Node15_datagrid *-- Node16_schemas
    cssClass "Node16_schemas" default
    class Node17_config {
        config/
    }
    Node15_datagrid *-- Node17_config
    cssClass "Node17_config" default
    class Node18_datapumps {
        data-pumps/
    }
    Node1_src *-- Node18_datapumps
    cssClass "Node18_datapumps" default
    class Node19_writers {
        writers/
    }
    Node18_datapumps *-- Node19_writers
    cssClass "Node19_writers" default
    class Node20_recovery {
        recovery/
    }
    Node18_datapumps *-- Node20_recovery
    cssClass "Node20_recovery" default
```

## Layering Logic

- **api-gateway:** The initial entry point. Minimal logic.
- **middleware:** Manages the grid and distributes the load to the Processing Units.
- **processing-units:** The core. Contains business logic. Interacts only with the `data-grid` layer.
- **data-grid:** Defines how data is structured and cached in memory.
- **data-pumps:** Contains asynchronous workers that take data from the grid and flush it to the permanent database.
