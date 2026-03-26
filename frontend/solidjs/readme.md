---
description: Vibe coding guidelines and architectural constraints for SolidJS within the frontend domain.
technology: SolidJS
domain: frontend
level: Senior/Architect
version: "1.8+"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior SolidJS Expert
last_updated: 2026-03-22
---

# ⚡ SolidJS Best Practices & Production-Ready Patterns

# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to modern SolidJS patterns, specifically fine-grained reactivity and functional APIs for optimal best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** SolidJS 1.8+

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** use `createSignal()`, `createMemo()`, and `createEffect()` for local state and side effects.
> - **Never** destructure props directly; use `splitProps()` or `mergeProps()` instead.
> - **Always** utilize the built-in control flow (`<Show>`, `<For>`, `<Switch>`) instead of mapping or ternary operators in JSX.

## 🏗 Architecture Principles

- Adhere to the defined [Architectural Patterns](../../architectures/readme.md) when building applications.
- Strongly prefer **Feature Sliced Design (FSD)** for applications scaling across multiple teams.

## 🚀 I. Basics & Popular

## 1. Using JSX Map for Lists
**Context:** Rendering Lists
### ❌ Bad Practice
```tsx
return <ul>{items().map(item => <li>{item.name}</li>)}</ul>;
```
### ⚠️ Problem
Using `.map` creates the DOM nodes once and does not react to array changes optimally, leading to unnecessary re-renders or lost reactivity.
### ✅ Best Practice
```tsx
return <ul><For each={items()}>{item => <li>{item.name}</li>}</For></ul>;
```
### 🚀 Solution
Use the `<For>` component. It caches DOM elements and handles granular updates when the array changes.
