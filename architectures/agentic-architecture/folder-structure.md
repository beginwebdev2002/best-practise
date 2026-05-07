---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, multi-agent-systems, vibe-coding, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---
# Agentic Architecture - Folder Structure
## Modular isolation of Prompts, Skills, and Contexts
```mermaid
classDiagram
    class src {
    }
    class orchestrator {
        note for orchestrator "Main coordinator agent"
    }
    class workers {
        note for workers "Specialized worker agents (Planner, Coder, Reviewer)"
    }
    class memory {
        note for memory "Shared context and validation schemas"
    }
    src *-- orchestrator
    src *-- workers
    src *-- memory
    class src:::default
    class orchestrator:::component
    class workers:::component
    class memory:::component
```
