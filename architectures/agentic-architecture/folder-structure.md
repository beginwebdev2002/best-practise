---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, folder-structure, architecture, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

<div align="center">
  # 📁 Agentic Architecture Folder Structure
</div>

---

## Component Relations

```mermaid
classDiagram
    class src {
    }
    class orchestrator {
        +MainCoordinator
    }
    class workers {
        +PlannerAgent
        +CoderAgent
        +ReviewerAgent
    }
    class memory {
        +SharedContext
        +ValidationSchemas
    }

    src *-- orchestrator
    src *-- workers
    src *-- memory

    note for orchestrator "Main coordinator agent"
    note for workers "Specialized worker agents"
    note for memory "Shared context and validation schemas"

    %% Design Tokens
    class orchestrator:::layout
    class workers:::component
    class memory:::default
```
