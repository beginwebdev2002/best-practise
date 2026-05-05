---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, vibe-coding, best-practices, orchestration]
ai_role: Autonomous Knowledge Evangelist
last_updated: 2026-05-18
---

# 📁 Folder Structure for Vibe Coding

## Standard Directory Layout

```mermaid
classDiagram
    class vibe_coding_patterns:::component
    note for vibe_coding_patterns "Root for architecture patterns"

    class readme_md:::default
    note for readme_md "Map of Patterns"

    class data_flow_md:::default
    note for data_flow_md "Processes and Workflows"

    vibe_coding_patterns --> readme_md
    vibe_coding_patterns --> data_flow_md

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```

### ❌ Bad Practice
```text
project/
├── data/
├── scripts/
└── temp.txt
```

### ⚠️ Problem
Lack of structure causes the AI to search globally, consuming vast token context.

### ✅ Best Practice
```text
src/
├── 📁 core/
│   └── 📁 domain/
└── 📁 orchestrator/
```

### 🚀 Solution
Strict isolation keeps the AI agent's context focused, significantly reducing hallucinations.