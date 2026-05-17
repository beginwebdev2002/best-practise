---
technology: Hexagonal Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [best-practices, folder-structure, hexagonal-architecture, ports-and-adapters]
ai_role: Senior Software Architect
last_updated: 2026-03-22
---

# 📁 Folder Structure Best Practices for Hexagonal Architecture

<div align="center">
  **Strict directory blueprints for zero-approval AI parsing.**
</div>
---
## 🌳 The Root Hierarchy

A properly defined Hexagonal architecture clearly separates its concerns at the file-system level. AI Agents are expected to enforce this strict separation.

```mermaid
graph TD
    Src[src/] --> Core[core/]
    Src --> Adapters[adapters/]
    Core --> Ports[ports/]
    Core --> Domain[domain/]
    Ports --> In[in/]
    Ports --> Out[out/]
    Adapters --> Primary[primary/]
    Adapters --> Secondary[secondary/]

    %% Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Src component;
    class Core component;
    class Adapters component;
    class Ports component;
    class Domain component;
```
## 🏗️ Example Directory Content

```text
src/
├── 📁 core/                 # The Heart of the System (No External Tech)
│   ├── 📁 domain/           # Entities, Value Objects, Business Rules
│   │   ├── User.ts
│   │   └── AccountId.ts
│   └── 📁 ports/            # Interfaces defining interactions
│       ├── 📁 in/           # Primary Ports (Use Cases / Commands)
│       │   └── CreateUserUseCase.ts
│       └── 📁 out/          # Secondary Ports (SPIs / Repositories)
│           ├── UserRepositoryPort.ts
│           └── EmailSenderPort.ts
└── 📁 adapters/             # Concrete implementations
    ├── 📁 primary/          # Entry Points (Driving Adapters)
    │   ├── 📁 http/         # REST Controllers / Express Routes
    │   │   └── UserController.ts
    │   └── 📁 cli/          # Console Commands
    └── 📁 secondary/        # Exit Points (Driven Adapters)
        ├── 📁 database/     # ORMs (TypeORM, Prisma)
        │   └── PostgresUserRepository.ts
        └── 📁 external/     # 3rd Party APIs (SendGrid, Stripe)
            └── SendGridEmailSender.ts
```
```mermaid
classDiagram
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    class Node1_src {
        src/
    }
    cssClass "Node1_src" default
    class Node2_core {
        core/
    }
    Node1_src *-- Node2_core
    cssClass "Node2_core" default
    class Node3_domain {
        domain/
    }
    Node2_core *-- Node3_domain
    cssClass "Node3_domain" default
    class Node4_Userts {
        User.ts
    }
    Node3_domain *-- Node4_Userts
    cssClass "Node4_Userts" component
    class Node5_AccountIdts {
        AccountId.ts
    }
    Node3_domain *-- Node5_AccountIdts
    cssClass "Node5_AccountIdts" component
    class Node6_ports {
        ports/
    }
    Node2_core *-- Node6_ports
    cssClass "Node6_ports" default
    class Node7_in {
        in/
    }
    Node6_ports *-- Node7_in
    cssClass "Node7_in" default
    class Node8_CreateUserUseCasets {
        CreateUserUseCase.ts
    }
    Node7_in *-- Node8_CreateUserUseCasets
    cssClass "Node8_CreateUserUseCasets" component
    class Node9_out {
        out/
    }
    Node6_ports *-- Node9_out
    cssClass "Node9_out" default
    class Node10_UserRepositoryPortts {
        UserRepositoryPort.ts
    }
    Node9_out *-- Node10_UserRepositoryPortts
    cssClass "Node10_UserRepositoryPortts" component
    class Node11_EmailSenderPortts {
        EmailSenderPort.ts
    }
    Node9_out *-- Node11_EmailSenderPortts
    cssClass "Node11_EmailSenderPortts" component
    class Node12_adapters {
        adapters/
    }
    Node1_src *-- Node12_adapters
    cssClass "Node12_adapters" default
    class Node13_primary {
        primary/
    }
    Node12_adapters *-- Node13_primary
    cssClass "Node13_primary" default
    class Node14_http {
        http/
    }
    Node13_primary *-- Node14_http
    cssClass "Node14_http" default
    class Node15_UserControllerts {
        UserController.ts
    }
    Node14_http *-- Node15_UserControllerts
    cssClass "Node15_UserControllerts" component
    class Node16_cli {
        cli/
    }
    Node13_primary *-- Node16_cli
    cssClass "Node16_cli" default
    class Node17_secondary {
        secondary/
    }
    Node12_adapters *-- Node17_secondary
    cssClass "Node17_secondary" default
    class Node18_database {
        database/
    }
    Node17_secondary *-- Node18_database
    cssClass "Node18_database" default
    class Node19_PostgresUserRepositoryts {
        PostgresUserRepository.ts
    }
    Node18_database *-- Node19_PostgresUserRepositoryts
    cssClass "Node19_PostgresUserRepositoryts" component
    class Node20_external {
        external/
    }
    Node17_secondary *-- Node20_external
    cssClass "Node20_external" default
    class Node21_SendGridEmailSenderts {
        SendGridEmailSender.ts
    }
    Node20_external *-- Node21_SendGridEmailSenderts
    cssClass "Node21_SendGridEmailSenderts" component
```
## ⛔ Boundary Constraints

1. **Isolation in `core/`:** Code inside `core/` is forbidden from importing modules from `adapters/`.
2. **Implementation in `adapters/`:** Code inside `adapters/` relies heavily on implementing the interfaces declared in `core/ports/`.
3. **Primary vs Secondary File Naming:** Append descriptive suffixes to Adapters to clarify intent (e.g., `PostgresUserRepository`, `StripePaymentService`).
