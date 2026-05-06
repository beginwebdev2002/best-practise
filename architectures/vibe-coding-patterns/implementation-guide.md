---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [implementation, vibe-coding]
ai_role: Autonomous Knowledge Evangelist
last_updated: 2026-05-18
---

# 🛠️ Implementation Guide

How to execute a vibe coding session deterministically.

## Execution Rules

### ❌ Bad Practice
Starting an agentic task by saying "Fix the login bug" without providing file paths or constraints.

### ⚠️ Problem
The agent will guess the file locations, rewrite unrelated components, and use outdated APIs because it lacks specific pointers.

### ✅ Best Practice
```markdown
1. Read `/backend/auth/login.ts`.
2. Implement strict input validation using the rules defined in `architectures/clean-architecture/readme.md`.
3. Generate unit tests in `/backend/auth/login.test.ts`.
4. Run `npm test` before concluding.
```

### 🚀 Solution
Provide explicit file boundaries, architectural constraints, and test verifications in every prompt. This forces the agent into a narrow, deterministic path where success is empirically measured by passing tests.

> [!IMPORTANT]
> Always enforce the validation step. Code is not complete until the test runner outputs success.
