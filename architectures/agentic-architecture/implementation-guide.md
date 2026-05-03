---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, orchestration, implementation-guide, vibe-coding, best-practices]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# 🛠️ Agentic Architecture Implementation Guide

This document defines rules for establishing strict agent personas and functional constraints.

## 1. Defining Strict Agent Personas and Outputs

### ❌ Bad Practice
```typescript
async function askAgent(prompt: string) {
    const response = await llm.complete(prompt);
    // Hope the LLM returns JSON as requested
    const data = JSON.parse(response.text);
    return data;
}
```

### ⚠️ Problem
Relying on the LLM to format unstructured text into code or valid JSON without enforcement guarantees runtime failures, hallucinated properties, and type mismatches. "Hoping" for correct output is not an architecture.

### ✅ Best Practice
```typescript
import { z } from 'zod';

const TaskResultSchema = z.object({
    status: z.enum(['success', 'failure']),
    reason: z.string(),
    data: z.unknown()
});

async function askAgent(prompt: string) {
    // LLM SDK must support forced structured output using schemas
    const response = await llm.complete({
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_schema', schema: TaskResultSchema }
    });

    // Validated at runtime boundary
    return TaskResultSchema.parse(response.structuredData);
}
```

### 🚀 Solution
Strictly bind agent outputs to explicitly defined schemas (e.g., Zod). Utilizing the provider's structured output mode combined with runtime parsing eliminates malformed data propagation. This deterministic validation is the absolute foundation for resilient Multi-Agent execution.
