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

## Layering logic

```mermaid
classDiagram
    note for Src "Root source directory"
    note for Orchestrator "Main coordinator agent"
    note for Workers "Specialized worker agents (Planner, Coder, Reviewer)"
    note for Memory "Shared context and validation schemas"

    class Src:::component
    class Orchestrator:::component
    class Workers:::component
    class Memory:::component

    Src *-- Orchestrator
    Src *-- Workers
    Src *-- Memory
```