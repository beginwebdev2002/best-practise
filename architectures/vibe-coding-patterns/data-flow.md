---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [data-flow, vibe-coding, ai-agents]
ai_role: Senior Software Architect
last_updated: 2026-05-08
---

# 🌊 Data Flow: Context Injection and Execution

The data flow in vibe coding dictates how an AI agent ingests context, plans execution, and writes deterministic code.

## Flow Process

```mermaid
graph LR
    User[User Prompt] --> Context[Context Aggregator]
    Rules[Global Rules] --> Context
    Context --> Planner[AI Planner]
    Planner --> Exec[Execution Agent]
    Exec --> Output[Deterministic Output]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;

    class User component;
    class Context component;
    class Rules component;
    class Planner default;
    class Exec default;
    class Output component;
```

## 1. Unbounded Context Injection Flow

### ❌ Bad Practice
```typescript
// Sending raw user input directly to the LLM without global rules
const result = await llm.generateCode(userPrompt);
```

### ⚠️ Problem
Feeding unbounded, unfiltered prompts directly to the execution agent causes hallucinations. The agent lacks global constraints and produces non-deterministic code.

### ✅ Best Practice
```typescript
// Strictly aggregating rules and constraints before execution
const rules = await loadGlobalConstraints();
const context = await buildDeterministicContext(userPrompt, rules);
const plan = await planner.createPlan(context);
const result = await llm.executePlan(plan);
```

### 🚀 Solution
A multi-stage pipeline MUST be enforced. Context is aggressively filtered, combined with strict architectural rules, and processed into an execution plan BEFORE code generation occurs. This ensures O(1) ambiguity and strictly deterministic results.
