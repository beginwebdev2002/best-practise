---
technology: Qwik
domain: frontend
level: Senior/Architect
version: "1.x"
tags: [state-management, advanced, qwik, best-practices, clean-code, scalable-code]
ai_role: Senior Qwik State Management Expert
last_updated: 2026-03-22
---

# 🔄 Qwik State Management Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to state management best practices in Qwik.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Qwik 1.x

## ⚡ II. State Management

## 🚨 1. Storing Unserializable Data
> [!NOTE]
> **Context:** Reactive Stores and State Object
### ❌ Bad Practice
```tsx
import { component$, useStore, useTask$ } from '@builder.io/qwik';

export const MyComponent = component$(() => {
  const store = useStore({
    ws: null,
  });

  useTask$(() => {
    store.ws = new WebSocket('ws://localhost:8080'); // Throws Serialization Error
  });

  return <div>Connecting...</div>;
});
```
### ⚠️ Problem
Objects like WebSockets, DOM elements, Timeouts, or native Maps/Sets cannot be JSON serialized. Putting them into `useStore` breaks Qwik's core serialization engine, causing fatal errors when the server attempts to transmit state to the client for resumability.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Qwik Index](./readme.md).

```tsx
import { component$, useSignal, useTask$, useVisibleTask$ } from '@builder.io/qwik';

export const MyComponent = component$(() => {
  // Use useSignal initialized with undefined on server
  const ws = useSignal<WebSocket>();

  // Only run in browser (where websocket lives)
  useVisibleTask$(() => {
    ws.value = new WebSocket('ws://localhost:8080');
    return () => ws.value?.close();
  });

  return <div>Connecting...</div>;
});
```
### 🚀 Solution
Do not put instances like WebSockets or DOM references into `useStore`. Use `useSignal()` when you need isolated references that initialize lazily on the client using `useVisibleTask$()`, or handle them outside the reactive serialization boundaries.
---

This deterministic approach is strictly more resilient regarding security and performance compared to the anti-pattern.
