---
technology: Vibe Coding
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, architecture, best-practices, folder-structure]
ai_role: Senior Software Architect
last_updated: 2026-05-10
---

# 📁 Vibe Coding Folder Structure

## Context
Standardized, component-driven directory layout for Vibe Coding multi-agent workflows.

### ❌ Bad Practice
```text
src/
  agents.js
  prompts.txt
  helpers/
```

### ⚠️ Problem
Flat or arbitrary folder structures collapse domain boundaries. AI Agents fail to load contextual scope efficiently because related schemas, implementations, and tests are decoupled.

### ✅ Best Practice
```text
src/
  features/
    auth/
      agents/
        auth-agent.ts
      schemas/
        auth-schema.json
      tests/
        auth.spec.ts
```

### 🚀 Solution
Feature-Sliced folder structures explicitly map domains. This ensures the Planner Agent loads O(1) context by targeting specific directory scopes rather than scanning an entire generic `helpers` folder.

## 🗺️ Component Relations
```mermaid
classDiagram
    class Feature {
        +AgentLogic
        +Schemas
        +Tests
    }
    class AgentLogic {
        +executeTask()
    }
    class Schemas {
        +validate()
    }
    Feature *-- AgentLogic
    Feature *-- Schemas
```
