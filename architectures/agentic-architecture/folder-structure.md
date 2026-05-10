---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, multi-agent-systems, vibe-coding, best-practices, folder-structure]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# 📁 Agentic Architecture: Folder Structure Blueprint

> [!NOTE]
> **Internal Routing:** [Agentic Architecture Map](./readme.md)

## Modular Isolation of Prompts, Skills, and Contexts

```mermaid
classDiagram
    class src {
        +orchestrator/
        +workers/
        +memory/
        +shared/
    }
    class orchestrator {
        +main.ts
        +state-manager.ts
    }
    class workers {
        +planner/
        +coder/
        +reviewer/
    }
    class memory {
        +vector-db/
        +session-store/
    }
    class shared {
        +schemas/
        +prompts/
    }

    src *-- orchestrator
    src *-- workers
    src *-- memory
    src *-- shared
```

## 1. Context Boundary Enforcement

### ❌ Bad Practice
```text
src/
├── agents.ts      // Contains all prompts, schemas, and API keys
├── utils.ts
└── main.ts
```

### ⚠️ Problem
Coupling all agent logic in a single directory prevents specialized testing and encourages monolithic prompt construction, leading to context window pollution.

### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** [Folder Structure Rules](./folder-structure.md)

```text
src/
├── orchestrator/          # Only coordination logic
├── workers/
│   ├── planner/           # Planner specific prompts/skills
│   └── coder/             # Coder specific tools/AST parsers
├── shared/
│   └── schemas/           # Zod/Type definitions for I/O validation
```

### 🚀 Solution
The codebase MUST STRICTLY enforce boundary limits. Domain logic for specific personas MUST be isolated within `workers/`, while deterministic I/O schemas MUST reside in `shared/schemas/` to ensure contract validation across the orchestrator boundary.
