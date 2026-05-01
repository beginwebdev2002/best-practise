---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, multi-agent-systems, vibe-coding, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# 📁 Agentic Architecture Folder Structure

Modular isolation of Prompts, Skills, and Contexts.

```mermaid
classDiagram
    class src:::component
    note for src "Root Application Source"

    class orchestrator:::default
    note for orchestrator "Main coordinator agent"

    class workers:::default
    note for workers "Specialized worker agents"

    class memory:::component
    note for memory "Shared context and validation schemas"

    src --> orchestrator
    src --> workers
    src --> memory
```

### ❌ Bad Practice
Mixing orchestrator logic, worker prompts, and memory inside the same directory.

### ⚠️ Problem
Difficult to upgrade individual agent personas or swap out underlying LLM providers.

### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Agentic Architecture Map](./readme.md).

Strict separation of concerns by isolating schemas, memory, and specialized agent logic into distinct directories.

### 🚀 Solution
A deterministic directory structure ensures that scaling the number of agents does not pollute the orchestrator's domain.
