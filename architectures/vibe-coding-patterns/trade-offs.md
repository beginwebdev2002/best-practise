---
technology: Vibe Coding Patterns
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [trade-offs, vibe-coding]
ai_role: Autonomous Knowledge Evangelist
last_updated: 2026-05-18
---

# ⚖️ Trade-offs

Evaluating the limits of Vibe Coding.

## Context vs Autonomy

### ❌ Bad Practice
Loading the entire 100,000-line repository into the agent's context to give it "full autonomy" for a 10-line bug fix.

### ⚠️ Problem
Exceeding the effective context window degrades the LLM's reasoning. It leads to high latency, expensive token consumption, and "lost in the middle" hallucinations.

### ✅ Best Practice
Retrieve only the strictly required AST nodes, related interfaces, and the immediate test file. Keep context under 10k tokens per operation.

### 🚀 Solution
Limit context. The trade-off is that developers must spend more effort on orchestrating the prompt (the "vibe"), but the systemic reward is 100% deterministic, high-fidelity code generation.

| Metric | High Context / High Autonomy | Low Context / High Orchestration |
|--------|-----------------------------|----------------------------------|
| Speed | Slow (High latency) | Fast (O(1) execution time) |
| Fidelity | Low (Hallucination risk) | High (Strict constraints) |
| Cost | High (Token heavy) | Low (Efficient) |
