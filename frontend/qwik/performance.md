---
technology: Qwik
domain: frontend
level: Senior/Architect
version: "1.x"
tags: [performance, advanced, qwik, best-practices, clean-code, scalable-code]
ai_role: Senior Qwik Performance Expert
last_updated: 2026-03-22
---

# 🚀 Qwik Advanced Performance Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to advanced performance best practices in Qwik.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Qwik 1.x

## ⚡ II. Advanced Performance

## 🚨 1. Synchronous Closures
> [!NOTE]
> **Context:** Component Event Handlers
### ❌ Bad Practice
```tsx
const Component = component$(() => {
  const handleClick = () => console.log('clicked');
  return <button onClick={handleClick}>Click</button>;
});
```
### ⚠️ Problem
If you define synchronous functions and bind them to events, Qwik must bundle all that javascript code eagerly, undermining resumability and slowing down the initial page load time.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```tsx
import { component$, $ } from '@builder.io/qwik';

const Component = component$(() => {
  const handleClick = $(() => console.log('clicked'));
  return <button onClick$={handleClick}>Click</button>;
});
```
### 🚀 Solution
> [!IMPORTANT]
> Ensure all event handlers use the `$` suffix (like `onClick$`) and their corresponding logic is wrapped in `$()`. This explicit syntax breaks the application into tiny resumable closures that Qwik MUST fetch only when the user interacts with them.
---
