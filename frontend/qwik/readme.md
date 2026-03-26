---
description: Vibe coding guidelines and architectural constraints for Qwik within the frontend domain.
technology: Qwik
domain: frontend
level: Senior/Architect
version: "1.x"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Qwik Expert
last_updated: 2026-03-22
---

# ⚡ Qwik Best Practices & Production-Ready Patterns

# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to modern Qwik patterns, specifically resumability and lazy loading for optimal best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Qwik 1.x

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** use `useSignal()`, `useStore()`, and `useTask$()` for local state and effects.
> - **Never** pass non-serializable objects (like closures, Promises, or DOM references) into generic properties.
> - **Always** utilize the `$` suffix for closures when necessary, like `onClick$`, to indicate lazy loading points.

## 🏗 Architecture Principles

- Adhere to the defined [Architectural Patterns](../../architectures/readme.md) when building applications.
- Strongly prefer **Feature Sliced Design (FSD)** for applications scaling across multiple teams.

## 🚀 I. Basics & Popular

## 1. Passing Closures as Props
**Context:** Component Props
### ❌ Bad Practice
```tsx
const Component = ({ onClick }) => <button onClick={onClick}>Click</button>;
```
### ⚠️ Problem
Closures cannot be serialized natively by Qwik, breaking resumability and throwing an error.
### ✅ Best Practice
```tsx
const Component = component$(({ onClick$ }: { onClick$: PropFunction<() => void> }) => (
  <button onClick$={onClick$}>Click</button>
));
```
### 🚀 Solution
Use the `$` suffix (`onClick$`) to mark the prop as a `PropFunction`, allowing Qwik to serialize the closure and load it lazily.
