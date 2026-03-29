---
description: Vibe coding guidelines and architectural constraints for Serverless within the Architecture domain.
tags: [serverless, architecture, best-practices, architecture]
topic: Serverless
complexity: Architect
last_evolution: 2026-03-29
vibe_coding_ready: true
technology: Serverless
domain: Architecture
level: Senior/Architect
version: Latest
ai_role: Senior Serverless Expert
last_updated: 2026-03-29---# Serverless - Data Flow
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
