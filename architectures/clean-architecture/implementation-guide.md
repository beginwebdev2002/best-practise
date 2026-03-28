# Clean Architecture - Implementation Guide

## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class UseCase {
        +execute()
    }
    class Entity {
        +validate()
    }
    class RepositoryInterface {
        <<interface>>
        +save()
    }
    UseCase --> Entity
    UseCase --> RepositoryInterface
```

### Rules
- Dependency Inversion Principle must be strictly followed.
- Entities encapsulate the most general and high-level rules.
