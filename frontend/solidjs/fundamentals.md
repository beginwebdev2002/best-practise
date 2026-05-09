---
technology: SolidJS
domain: frontend
level: Senior/Architect
version: "1.8+"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior SolidJS Expert
last_updated: 2026-05-09
---

# 🚀 Fundamentals

[⬆️ Back to Top](./readme.md)

## 🚀 I. Basics & Popular
## 🚨 1. Using JSX Map for Lists
> [!NOTE]
> **Context:** Rendering Lists
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
