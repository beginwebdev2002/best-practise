---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, ai-agents, deterministic-generation, architecture, best-practices]
ai_role: Senior Vibe Coding Expert
last_updated: 2026-05-09
---

# 📁 Folder Structure (Vibe Coding Patterns)

```mermaid
classDiagram
    class VibeCodingProject:::component
    class ContextStore:::component
    class Agents:::component
    class Benchmarks:::component

    VibeCodingProject *-- ContextStore
    VibeCodingProject *-- Agents
    VibeCodingProject *-- Benchmarks

    note for ContextStore "Contains rules and context"
    note for Agents "Holds LLM worker definitions"
    note for Benchmarks "Holds AST fidelity rules"

    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```

---

## 1. Scattered Configuration Files

### ❌ Bad Practice
```text
project/
  agent.js
  schema.json
  main.ts
```

### ⚠️ Problem
Agent configurations, schemas, and source code are intertwined. Multi-agent systems cannot reliably locate the structural constraints, resulting in unpredictable runtime behavior.

### ✅ Best Practice
```text
project/
  context/
  agents/
  benchmarks/
  src/
```

### 🚀 Solution
Strictly isolate `context`, `agents`, and `benchmarks` into dedicated modules. This composition provides O(1) directory lookup for Orchestrator Agents, preventing schema-to-code collisions.
