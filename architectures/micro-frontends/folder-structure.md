---
description: Vibe coding guidelines and architectural constraints for Micro-frontends Folder Structure within the Architecture domain.
tags: [micro-frontends, architecture, module-federation, frontend, folder-structure, vibe-coding]
topic: Micro-frontends Folder Structure
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
technology: Micro-frontends
domain: Architecture
level: Senior/Architect
version: Agnostic
ai_role: Senior Architect
last_updated: 2026-03-22
---

<div align="center">
  # 📁 Micro-frontends Folder Structure
</div>

---

This document defines strict rules for the directory structure and logical layering in the Micro-frontends architecture to ensure maximum isolation.

## Directory Layout Rules

### 1. Monorepo vs Polyrepo Constraints

#### ❌ Bad Practice
```text
monorepo/
├── packages/
│   ├── shared-ui/ (contains business logic!)
│   ├── app-shell/
│   ├── mfe-auth/ (imports directly from app-shell)
```

#### ⚠️ Problem
Storing business logic in shared libraries or directly importing cross-package code defeats the purpose of micro-frontends. It binds deployment cycles together, meaning a change in `shared-ui` forces all dependent MFEs to re-test and redeploy simultaneously.

#### ✅ Best Practice
```text
workspace/
├── apps/
│   ├── app-shell/ (Entry point, Router, Module Federation config)
│   ├── mfe-catalog/ (Independent application)
│   └── mfe-checkout/ (Independent application)
├── packages/
│   ├── design-system/ (Pure, dumb UI components only)
│   └── event-bus/ (Agnostic communication contract types)
```

#### 🚀 Solution
Structure your repository (whether mono or polyrepo) to ensure each application folder (`mfe-*`) operates as a completely standalone entity. Shared libraries must be restricted strictly to agnostic utilities and purely visual design system components. Ensure zero business logic crossover.
