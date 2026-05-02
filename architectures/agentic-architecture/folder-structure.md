---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [folder-structure, orchestration, ai-agents, modularity]
ai_role: Senior Software Architect
last_updated: 2026-04-18
---
# 📁 Folder Structure: Modular Isolation

> [!IMPORTANT]
> To prevent context bleeding, strictly isolate Agent logic, prompts, and memory states.

```mermaid
classDiagram
    class src {
        +orchestrator/
        +workers/
        +memory/
        +prompts/
        +schemas/
    }
    note for src "Root directory for Agentic ecosystem"

    class orchestrator:::component
    note for orchestrator "Central coordinator"
    class workers:::component
    note for workers "Specialized agents"
    class memory:::default
    note for memory "Shared context states"
    class prompts:::default
    note for prompts "Isolated prompt templates"
    class schemas:::default
    note for schemas "Validation schemas"

    src --> orchestrator
    src --> workers
    src --> memory
    src --> prompts
    src --> schemas

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```

## The Pattern Lifecycle: Global Context Bleed

### ❌ Bad Practice
```typescript
// Agent persona, logic, and context mixed in one file
export class FullAgent {
    prompt = "You are a planner and coder. Here is the schema...";
    async run() { /* monolithic logic */ }
}
```

### ⚠️ Problem
Mixing prompts, agent configuration, and logic creates rigid, untestable components. If the prompt changes, the application logic is at risk. It hinders Vibe Coding by forcing large contexts into every file.

### ✅ Best Practice
```typescript
// Specialized isolation
import { plannerPrompt } from '../prompts/planner.prompt';
import { plannerSchema } from '../schemas/planner.schema';

export class PlannerWorker {
    private promptTemplate = plannerPrompt;

    async execute(task: string) {
        // Enforces deterministic outputs via schema validation
    }
}
```

### 🚀 Solution
Isolating prompts into a `/prompts` directory and schemas into `/schemas` maintains architectural integrity. Workers only import their specific dependencies, reducing context pollution and enabling deterministic AI behavior.
