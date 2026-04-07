---
technology: Serverless
domain: Architecture
level: Senior/Architect
version: Latest
tags: [serverless, architecture, best-practices, architecture]
ai_role: Senior Serverless Expert
last_updated: 2026-03-29
---

# Serverless - Implementation Guide
## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class Function {
        +handler(event, context)
    }
    class Resource {
        +arn
    }
    Function --> Resource
```

### Rules
- Minimize dependencies to reduce cold start times.
