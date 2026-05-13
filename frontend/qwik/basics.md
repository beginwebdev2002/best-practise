---
technology: Qwik
domain: frontend
level: Senior/Architect
version: "1.x"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Qwik Expert
last_updated: 2026-03-22
---

# 🚀 Qwik Basics & Popular Patterns

[⬆️ Back to Top](./readme.md)

### 🚨 1. eagerly Loading Code
> [!NOTE]
> **Context:** Loading code in Qwik
### ❌ Bad Practice
```tsx
export const MyComponent = () => {
    const data = eagerlyLoadData(); // blocking!
    return <div>{data}</div>;
}
```
### ⚠️ Problem
Loading code eagerly blocks rendering and defeats the purpose of resumability.
### ✅ Best Practice
```tsx
export const MyComponent = component$(() => {
    const data = useResource$(() => loadDataLazy());
    return <Resource value={data} onResolved={(d) => <div>{d}</div>} />;
});
```
### 🚀 Solution
Wrap components with `component$()` and use `useResource$()` to guarantee lazy loading and non-blocking resumability.

### 🚨 2. Passing Closures as Props
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
