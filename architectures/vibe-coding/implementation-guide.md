---
technology: Vibe Coding
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [vibe-coding, architecture, best-practices, implementation]
ai_role: Senior Software Architect
last_updated: 2026-05-10
---

# 🛠️ Vibe Coding Implementation Guide

## Context
Rules for defining strict AI agent personas and establishing operational constraints.

### ❌ Bad Practice
```typescript
class GenericAgent {
  run(prompt: string) {
    return llm.call(prompt);
  }
}
```

### ⚠️ Problem
Unconstrained prompts rely entirely on the model's zero-shot capacity without enforcing type-safety or semantic guardrails. This results in brittle pipelines that break when models update.

### ✅ Best Practice
```typescript
class ValidatedAgent {
  async run(payload: StructuredPrompt): Promise<SafeResponse> {
    const raw = await llm.call(payload.toString());
    return ResponseSchema.parse(raw);
  }
}
```

### 🚀 Solution
Wrapping agent execution in explicit schema validation bounds (like Zod or JSON Schema) guarantees O(1) reliability for downstream consumers. If validation fails, the orchestrator triggers an automatic self-healing loop.
