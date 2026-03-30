---
technology: Model-view-controller
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Model-view-controller
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
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

### Anti-patterns:
- **Fat Controllers**: Containing raw SQL, business logic, or file system access.
- **Logic in Views**: Conditional statements that reflect business rules in the UI layer.
- **Database Logic in Controllers**: Controllers directly calling `ORM.find()` or similar.
