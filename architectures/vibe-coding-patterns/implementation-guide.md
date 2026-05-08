---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [implementation, vibe-coding, ai-agents]
ai_role: Senior Software Architect
last_updated: 2026-05-08
---

# 🛠️ Implementation Guide: Deterministic Prompting

This guide outlines the strict rules for implementing Vibe Coding patterns in daily workflows.

## 1. Ambiguous Task Definition

### ❌ Bad Practice
```markdown
Write a login function. Make it fast and secure.
```

### ⚠️ Problem
Using weak adjectives like 'fast' and 'secure' causes the AI to hallucinate specific implementations that may violate enterprise security standards.

### ✅ Best Practice
```markdown
> [!IMPORTANT]
> Write a login function in TypeScript 5.5+. It MUST use O(1) lookup complexity and STRICTLY implement Argon2 hashing for passwords. Return a predictable JSON schema.
```

### 🚀 Solution
Quantify adjectives and use explicit hard constraints (MUST, MANDATORY, STRICTLY). By wrapping critical constraints in GitHub Alerts, the AI parser is forced to prioritize deterministic parameters over creative assumptions.
