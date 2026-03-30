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

# Microservices - Implementation Guide

## Code patterns and Anti-patterns

### Entity Relationships

```mermaid
classDiagram
    class Gateway {
        +route()
    }
    class Service {
        +process()
    }
    Gateway --> Service : RPC/HTTP
```

### Rules
- Avoid synchronous cascading calls between services.
