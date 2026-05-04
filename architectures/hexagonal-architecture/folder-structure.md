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
    src --|> core
    core --|> domain
    domain --|> User_ts
    domain --|> AccountId_ts
    core --|> ports
    ports --|> in
    in --|> CreateUserUseCase_ts
    ports --|> out
    out --|> UserRepositoryPort_ts
    out --|> EmailSenderPort_ts
    src --|> adapters
    adapters --|> primary
    primary --|> http
    http --|> UserController_ts
    primary --|> cli
    adapters --|> secondary
    secondary --|> database
    database --|> PostgresUserRepository_ts
    secondary --|> external
    external --|> SendGridEmailSender_ts
    class src:::component
    note for core "The Heart of the System (No External Tech"
    class core:::component
    note for domain "Entities, Value Objects, Business Rules"
    class domain:::component
    class User_ts:::component
    class AccountId_ts:::component
    note for ports "Interfaces defining interactions"
    class ports:::component
    note for in "Primary Ports (Use Cases / Commands"
    class in:::component
    class CreateUserUseCase_ts:::component
    note for out "Secondary Ports (SPIs / Repositories"
    class out:::component
    class UserRepositoryPort_ts:::component
    class EmailSenderPort_ts:::component
    note for adapters "Concrete implementations"
    class adapters:::component
    note for primary "Entry Points (Driving Adapters"
    class primary:::component
    note for http "REST Controllers / Express Routes"
    class http:::component
    class UserController_ts:::component
    note for cli "Console Commands"
    class cli:::component
    note for secondary "Exit Points (Driven Adapters"
    class secondary:::component
    note for database "ORMs (TypeORM, Prisma"
    class database:::component
    class PostgresUserRepository_ts:::component
    note for external "3rd Party APIs (SendGrid, Stripe"
    class external:::component
    class SendGridEmailSender_ts:::component
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
```
## ⛔ Boundary Constraints

1. **Isolation in `core/`:** Code inside `core/` is forbidden from importing modules from `adapters/`.
2. **Implementation in `adapters/`:** Code inside `adapters/` relies heavily on implementing the interfaces declared in `core/ports/`.
3. **Primary vs Secondary File Naming:** Append descriptive suffixes to Adapters to clarify intent (e.g., `PostgresUserRepository`, `StripePaymentService`).
