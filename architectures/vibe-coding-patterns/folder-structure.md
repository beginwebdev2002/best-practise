---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [folder-structure, vibe-coding, ai-agents]
ai_role: Senior Software Architect
last_updated: 2026-05-08
---

# 📁 Folder Structure: Context Isolation

A predictable folder structure is MANDATORY for AI agents to locate and ingest context deterministically without scanning unrelated files.

## Structure Model

```mermaid
classDiagram
    class ProjectRoot:::component
    note for ProjectRoot "Root application directory"
    class AgentsDir:::default
    note for AgentsDir ".agents/ directory containing global rules"
    class ArchitecturesDir:::default
    note for ArchitecturesDir "architectures/ containing pattern blueprints"
    class SrcDir:::default
    note for SrcDir "src/ containing implementation code"

    ProjectRoot *-- AgentsDir
    ProjectRoot *-- ArchitecturesDir
    ProjectRoot *-- SrcDir

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```

## 1. Monolithic Rule Management

### ❌ Bad Practice
```text
/src
  index.ts
  rules.txt
  logic.ts
```

### ⚠️ Problem
Mixing rules and logic in the same directory leads to context pollution. AI agents struggle to distinguish between instructional meta-data and actual application code.

### ✅ Best Practice
```text
/.agents
  global-rules.md
/architectures
  readme.md
/src
  index.ts
```

### 🚀 Solution
Strictly isolate meta-instructions into dedicated directories (e.g., `.agents/` and `architectures/`). This allows AI agents to predictably load constraints before analyzing the `src/` directory, achieving high-fidelity generation.
