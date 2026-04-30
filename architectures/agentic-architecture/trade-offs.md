---
technology: Agentic Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [ai-agents, trade-offs, architecture-decisions]
ai_role: Senior Software Architect
last_updated: 2026-04-17
---

# ⚖️ Agentic Architecture Trade-offs

## 🗺️ Map of Patterns (Agentic Modules)
- 🏠 **[Back to Agentic Architecture Guidelines](./readme.md)**

| Aspect | Monolithic Agent | Agentic Architecture (Orchestrator-Worker) |
| :--- | :--- | :--- |
| **Context Overhead** | High (Entire system state loaded) | Low (Scoped specifically to the sub-task) |
| **Execution Latency** | Low (Single LLM call) | High (Multiple sequential/parallel LLM calls) |
| **Determinism** | Very Low (Prone to hallucinations) | High (Structured outputs and verifications) |
| **Token Costs** | Moderate to High (Large prompt tokens) | Moderate (Many small requests, efficient reuse) |
| **Complexity** | Low (Easy to prototype) | High (Requires robust state & handoff management) |

## 1. Balancing Latency vs. Reliability

### ❌ Bad Practice
Using a multi-agent system for trivial, single-step tasks (like simple formatting) just for the sake of using "agents".

### ⚠️ Problem
This introduces severe network latency and unnecessary token costs for tasks that could have been deterministically resolved with a single LLM prompt or a standard deterministic function.

### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Agentic Architecture Guidelines](./readme.md).

Implement an initial routing layer that assesses task complexity. Bypass the Orchestrator-Worker pipeline for trivial tasks.

### 🚀 Solution
Evaluating the trade-offs allows the system to scale its intelligence dynamically. Simple tasks use O(1) latency fast paths, while complex synthesis utilizes the full multi-agent pipeline, balancing cost, speed, and accuracy perfectly.
