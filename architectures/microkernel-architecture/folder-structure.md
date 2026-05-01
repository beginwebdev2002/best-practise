---
technology: Microkernel Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [plugin-architecture, extensibility, solid-principles, core-system, architecture-patterns, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-18
---

# 📁 Microkernel Architecture Folder Structure

Absolute isolation of the Core engine from volatile Plugins.

```mermaid
classDiagram
    class src:::component
    note for src "Root Application Source"

    class core:::default
    note for core "Core system orchestrator and registry interfaces"

    class plugins:::default
    note for plugins "Independent modules implementing core interfaces"

    class shared:::component
    note for shared "Data types and common utilities"

    src --> core
    src --> plugins
    src --> shared
```

### ❌ Bad Practice
Mixing core logic, plugin implementations, and shared utilities inside the same directory.

### ⚠️ Problem
Creates cyclic dependencies and makes it difficult to package the core separately from plugins.

### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Microkernel Architecture Map](./readme.md).

Strict separation of concerns by isolating core orchestration, plugins, and shared boundaries.

### 🚀 Solution
A deterministic directory structure ensures that adding or modifying plugins does not touch the core files.
