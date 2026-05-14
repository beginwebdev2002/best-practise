---
technology: FSD
domain: Architecture
level: Senior/Architect
version: Latest
tags: [fsd, architecture, best-practices, architecture]
ai_role: Senior FSD Expert
last_updated: 2026-03-29
---

# Feature-Sliced Design (FSD) - Implementation Guide
## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +updateProfile()
    }
    class Order {
        +String id
        +Float total
        +String status
        +process()
    }
    class Product {
        +String id
        +String title
        +Float price
    }
    User "1" *-- "many" Order : places
    Order "1" *-- "many" Product : contains
```

### Rules for implementation:
1. **Public API**: Every slice and segment must have an `index.ts` (Public API) to expose its contents.
2. **Cross-Slice Imports**: Cross-slice imports within the same layer are strictly prohibited.
> [!IMPORTANT]
> 3. **Global State**: Global state (like Redux or Zustand) MUST be split across entities and features, not centralized in one huge store.


```mermaid
graph LR
    Step1[Define Public API] --> Step2[Isolate Cross-Slice Imports]
    Step2 --> Step3[Distribute Global State]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;

    class Step1,Step2,Step3 default;
```


### Anti-patterns:
- **God Object**: Creating a single feature that handles too many responsibilities.
- **Bypassing Layers**: Importing `shared` directly into `app` without going through intermediate layers if applicable, though `shared` is accessible everywhere. More importantly, `entities` importing from `features` is a strict violation.
