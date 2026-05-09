---
technology: Qwik
domain: frontend
level: Senior/Architect
version: "1.x"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Qwik Expert
last_updated: 2026-05-09
---

# 🚀 Fundamentals

[⬆️ Back to Top](./readme.md)

## 🚀 I. Basics & Popular
## 🚨 1. Passing Closures as Props
> [!NOTE]
> **Context:** Component Props
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
