---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, multi-agent-systems, vibe-coding, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---
# Agentic Architecture - Data Flow
## Orchestrator-to-Worker execution paths
```mermaid
sequenceDiagram
    participant Orchestrator
    participant Planner
    participant Coder
    participant Reviewer
    participant Memory

    Orchestrator->>Planner: Task context
    Planner-->>Orchestrator: Execution plan
    Orchestrator->>Coder: Specific sub-task
    Coder-->>Reviewer: Code payload
    Reviewer-->>Orchestrator: Validation result
    Orchestrator->>Memory: Persist validated state
```
