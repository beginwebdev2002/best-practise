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
    src --|> api_gateway
    api_gateway --|> routes
    api_gateway --|> middleware
    src --|> middleware_1
    middleware_1 --|> load_balancer
    middleware_1 --|> data_router
    src --|> processing_units
    processing_units --|> auth_unit
    auth_unit --|> logic
    auth_unit --|> data_access
    processing_units --|> catalog_unit
    catalog_unit --|> logic_1
    catalog_unit --|> data_access_1
    src --|> data_grid
    data_grid --|> schemas
    data_grid --|> config
    src --|> data_pumps
    data_pumps --|> writers
    data_pumps --|> recovery
    class src:::component
    note for api_gateway "Routing and basic validation"
    class api_gateway:::component
    class routes:::component
    class middleware:::component
    note for middleware_1 "Virtualized middleware for processing unit routing"
    class middleware_1:::component
    class load_balancer:::component
    class data_router:::component
    note for processing_units "Independent processing components"
    class processing_units:::component
    class auth_unit:::component
    class logic:::component
    note for data_access "Communicates with IMDG"
    class data_access:::component
    class catalog_unit:::component
    class logic_1:::component
    class data_access_1:::component
    note for data_grid "IMDG configuration and schema definitions"
    class data_grid:::component
    class schemas:::component
    class config:::component
    note for data_pumps "Background services syncing IMDG to DB"
    class data_pumps:::component
    class writers:::component
    class recovery:::component
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
```

## Layering Logic

- **api-gateway:** The initial entry point. Minimal logic.
- **middleware:** Manages the grid and distributes the load to the Processing Units.
- **processing-units:** The core. Contains business logic. Interacts only with the `data-grid` layer.
- **data-grid:** Defines how data is structured and cached in memory.
- **data-pumps:** Contains asynchronous workers that take data from the grid and flush it to the permanent database.
