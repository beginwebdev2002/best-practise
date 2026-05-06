---
technology: Microkernel Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [plugin-architecture, extensibility, solid-principles, core-system, architecture-patterns, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-18
---

# Folder Structure

```mermaid
classDiagram
    class src
    class core
    class plugins
    class shared

    src *-- core
    src *-- plugins
    src *-- shared

    note for core "Core system and interfaces"
    note for plugins "Independent modules"
    note for shared "Common utilities"

    class src:::default
    class core:::component
    class plugins:::component
    class shared:::component
```
