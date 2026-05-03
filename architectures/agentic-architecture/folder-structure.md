---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, folder-structure, vibe-coding, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# 📁 Agentic Architecture Folder Structure

This document outlines the modular isolation of Prompts, Skills, and Contexts for Multi-Agent Systems.

## Core Hierarchy

```mermaid
classDiagram
    class src:::component
    class orchestrator:::component
    class workers:::component
    class memory:::component
    class prompts:::component
    class schemas:::component

    note for src "Root application source code"
    note for orchestrator "Main coordinator agent logic"
    note for workers "Specialized worker agents (Planner, Coder, Reviewer)"
    note for memory "Shared context management and validation"
    note for prompts "Isolated prompt templates"
    note for schemas "Zod/JSON validation schemas"

    src --> orchestrator
    src --> workers
    src --> memory
    src --> prompts
    src --> schemas

    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```

## 1. Modular Isolation of Agent Capabilities

### ❌ Bad Practice
```text
src/
├── app.ts
├── agent.ts // Contains prompt strings, logic, and schema definitions mixed together
```

### ⚠️ Problem
Mixing logic, prompt string manipulation, and payload structures within a single file breaks separation of concerns. This causes immense difficulty when tuning prompts, updating schemas, or attempting to scale the agent to handle multiple specialized roles.

### ✅ Best Practice
```text
src/
├── orchestrator/
│   └── main-agent.ts
├── workers/
│   ├── planner.ts
│   └── coder.ts
├── prompts/
│   └── system-prompts.ts
└── schemas/
    └── task-schema.ts
```

### 🚀 Solution
Strictly enforce FSD-like layer separation. Prompts must be decoupled from execution logic, and schemas must exist as independent artifacts. This structure guarantees that an AI model can parse schemas or modify prompts without inadvertently corrupting execution routines or internal states.
