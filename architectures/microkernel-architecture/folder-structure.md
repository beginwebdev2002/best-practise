---
technology: Microkernel Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [plugin-architecture, extensibility, solid-principles, core-system, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-05-02
---

# 📁 Microkernel Architecture Folder Structure Best Practices

<div align="center">
  **Absolute isolation of the Core engine from volatile Plugins.**
</div>

---

## 🏗️ Structure Rules

```mermaid
classDiagram
    class src:::component
    class core:::component
    class plugins:::component
    class shared:::component

    src --> core
    src --> plugins
    src --> shared

    note for core "Core system orchestrator and registry interfaces"
    note for plugins "Independent modules implementing core interfaces"
    note for shared "Data types and common utilities"

    %% Design Tokens
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
```

## 📌 Core Constraints
1. **Isolated Registries:** The `core/` directory MUST contain the registry logic and interface definitions.
2. **Independent Plugins:** Each plugin in `plugins/` MUST be self-contained and potentially extractable into a separate package.
