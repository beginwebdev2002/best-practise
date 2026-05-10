---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, multi-agent-systems, vibe-coding, best-practices, data-flow]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# 🌊 Agentic Architecture: Data Flow Blueprint

> [!NOTE]
> **Internal Routing:** [Agentic Architecture Map](./readme.md)

## Orchestrator-to-Worker Data Flow

```mermaid
stateDiagram-v2
    [*] --> Orchestrator_Receive
    Orchestrator_Receive --> Planner_Delegate: Decompose Task
    Planner_Delegate --> Orchestrator_ReviewPlan: Return Structured Plan
    Orchestrator_ReviewPlan --> Coder_Delegate: Dispatch Execution Steps
    Coder_Delegate --> Orchestrator_ReviewCode: Return AST/Code
    Orchestrator_ReviewCode --> Reviewer_Delegate: Validate Code Standards
    Reviewer_Delegate --> Orchestrator_Finalize: Approval/Rejection
    Orchestrator_Finalize --> [*]: Emit Final State
```

## 1. Immutable State Transitions

### ❌ Bad Practice
```typescript
// Worker agent mutates global state directly during execution
class WorkerAgent {
    async execute(task: string) {
        globalContext.update(task); // HIDDEN SIDE EFFECT
        return "done";
    }
}
```

### ⚠️ Problem
When worker agents mutate global state independently, it causes race conditions and untraceable side-effects. The Orchestrator loses determinism over the process, leading to hallucinated context chains.

### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** [Data Flow Rules](./data-flow.md)

```typescript
// Worker strictly returns a state delta to be validated
interface StateDelta {
    mutations: ReadonlyArray<unknown>;
}

class DeterministicWorkerAgent {
    async execute(task: string): Promise<StateDelta> {
        return { mutations: [{ type: 'ADD_FILE', payload: task }] };
    }
}
```

### 🚀 Solution
Workers MUST STRICTLY execute computations and return a deterministic `StateDelta`. Only the Orchestrator MUST apply state changes, ensuring atomic and traceable workflows.
