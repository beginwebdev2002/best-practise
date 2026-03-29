---
technology: Serverless
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Serverless
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
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
