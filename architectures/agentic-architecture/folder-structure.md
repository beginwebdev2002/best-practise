---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, multi-agent-systems, vibe-coding, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# Folder Structure

```mermaid
classDiagram
    class src
    class orchestrator
    class workers
    class memory

    src *-- orchestrator
    src *-- workers
    src *-- memory

    note for orchestrator "Main coordinator agent"
    note for workers "Specialized worker agents"
    note for memory "Shared context and schemas"

    class src:::default
    class orchestrator:::component
    class workers:::component
    class memory:::component
```
