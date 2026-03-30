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

# Serverless - Data Flow

## Request and Event Lifecycle

```mermaid
sequenceDiagram
    participant Client
    participant API_Gateway
    participant LambdaFunction
    participant DynamoDB

    Client->>API_Gateway: HTTP Request
    API_Gateway->>LambdaFunction: Trigger Execution
    LambdaFunction->>DynamoDB: Persist Data
    DynamoDB-->>LambdaFunction: Ack
    LambdaFunction-->>API_Gateway: Return
    API_Gateway-->>Client: HTTP Response
```

### Constraints
- Functions must be stateless.
