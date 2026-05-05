---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, vibe-coding, best-practices, orchestration]
ai_role: Autonomous Knowledge Evangelist
last_updated: 2026-05-18
---

# 🌊 Data Flow in Vibe Coding

## Core Data Flow Pattern

Data flows strictly in a unidirectional manner from human intent to deterministic AI output, validated via CI checks.

```mermaid
graph LR
    Intent[Human Intent] --> Context[Context Setup]
    Context --> Orchestrator[AI Orchestrator]
    Orchestrator --> Generation[Code Generation]
    Generation --> Validation[Validation Suite]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Intent component;
    class Context component;
    class Orchestrator layout;
    class Generation component;
    class Validation component;
```

### ❌ Bad Practice
```typescript
function complexFlow(data: any) {
  let state = data;
  state = modifyState(state);
  return sendToDB(state);
}
```

### ⚠️ Problem
Mutating state unpredictably breaks the deterministic nature required by AI agents.

### ✅ Best Practice
```typescript
interface DataState {
  readonly value: string;
}

function computeFlow(state: DataState): DataState {
  return { value: state.value + "_processed" };
}
```

### 🚀 Solution
Unidirectional data flow and immutable state guarantee that AI generation does not introduce unintended side-effects into the system.