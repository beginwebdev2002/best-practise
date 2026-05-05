---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, folder-structure, orchestration]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# 📁 Agentic Architecture Folder Structure

```mermaid
graph TD
    User[User Request] --> Orchestrator[Orchestrator Agent]
    Orchestrator --> |Decomposes task| Planner[Planner Agent]
    Planner -.-> |Plan| Orchestrator
    Orchestrator --> |Delegates| Coder[Coder Agent]
    Orchestrator --> |Delegates| Reviewer[Reviewer Agent]
    Coder -.-> |Code output| Reviewer
    Reviewer -.-> |Verification| Orchestrator
    Orchestrator --> DB[(Shared Context / Memory)]

    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class User component;
    class Orchestrator layout;
    class Planner component;
    class Coder component;
    class Reviewer component;
    class DB default;
```

## Directory Blueprint
```text
src/
├── 📁 orchestrator/     # Main coordinator agent
├── 📁 workers/          # Specialized worker agents (Planner, Coder, Reviewer)
└── 📁 memory/           # Shared context and validation schemas
```
