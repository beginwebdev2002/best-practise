---
technology: MVC
domain: Architecture
level: Senior/Architect
version: Latest
tags: [mvc, architecture, best-practices, architecture]
ai_role: Senior MVC Expert
last_updated: 2026-03-29
---

# Model-View-Controller (MVC) - Implementation Guide
## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class Controller {
        +handleRequest()
    }
    class Service {
        +executeBusinessLogic()
    }
    class Model {
        +saveToDatabase()
    }
    class View {
        +render()
    }
    Controller --> Service : delegates
    Controller --> View : chooses
    Service --> Model : manipulates
```

### Rules for implementation:
1. **Thin Controllers**: Move all business logic into Service classes.
2. **DTOs**: Pass Data Transfer Objects between layers to avoid leaking DB schemas.
3. **Dependency Injection**: Use DI to pass services into controllers for better testability.

```mermaid
graph LR
    Step1[Thin Controllers]
    Step2[DTOs]
    Step1 --> Step2
    Step3[Dependency Injection]
    Step2 --> Step3

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    class Step1 component;
    class Step2 component;
    class Step3 component;
```



### Anti-patterns:
- **Fat Controllers**: Containing raw SQL, business logic, or file system access.
- **Logic in Views**: Conditional statements that reflect business rules in the UI layer.
- **Database Logic in Controllers**: Controllers directly calling `ORM.find()` or similar.
