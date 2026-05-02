---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, multi-agent-systems, vibe-coding, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-05-02
---

# 📁 Agentic Architecture Folder Structure Best Practices

<div align="center">
  **Strict directory blueprints for Multi-Agent Systems.**
</div>

---

## 🏗️ Structure Rules

```mermaid
classDiagram
    class src:::component
    class orchestrator:::component
    class workers:::component
    class memory:::component
    class prompts:::component
    class schemas:::component

    src --> orchestrator
    src --> workers
    src --> memory
    src --> prompts
    src --> schemas

    note for orchestrator "Main coordinator agent"
    note for workers "Specialized worker agents (Planner, Coder, Reviewer)"
    note for memory "Shared context and state management"
    note for prompts "System prompts and persona definitions"
    note for schemas "Zod/JSON validation schemas"

    %% Design Tokens
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```

## 📌 Core Constraints
1. **Isolated Prompts:** System prompts MUST be stored in `prompts/` and loaded dynamically.
2. **Validation Layer:** Schemas for agent I/O MUST reside in `schemas/`.
