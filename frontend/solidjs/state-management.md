---
technology: SolidJS
domain: frontend
level: Senior/Architect
version: "1.8+"
tags: [state-management, advanced, solidjs, best-practices, clean-code, scalable-code]
ai_role: Senior SolidJS State Management Expert
last_updated: 2026-05-10
---

# 🔄 SolidJS State Management Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to state management best practices in SolidJS.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** SolidJS 1.8+

## ⚡ II. State Management

## ⚡ 1. Direct Prop Destructuring
> [!NOTE]
> **Context:** Receiving props in functional components.
### ❌ Bad Practice
```tsx
function Profile({ user, settings }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{settings.theme}</p>
    </div>
  );
}
```
### ⚠️ Problem
SolidJS tracks reactivity via getters. If you destructure props (e.g., `{ user }`), the component loses reactivity because the destructured variable evaluates to a static reference at the time of component execution. When the parent updates the prop, the child component will not react.
### ✅ Best Practice
```tsx
import { splitProps } from 'solid-js';

function Profile(props) {
  // Option 1: Access directly (preferred)
  // return <h1>{props.user.name}</h1>

  // Option 2: Split props if needed for spreading
  const [local, others] = splitProps(props, ['user', 'settings']);

  return (
    <div {...others}>
      <h1>{local.user.name}</h1>
      <p>{local.settings.theme}</p>
    </div>
  );
}
```
> [!NOTE]
> **Internal Routing:** [./readme.md](./readme.md)

### 🚀 Solution
Never destructure props directly. Access props dynamically via `props.propertyName` or use `splitProps()` / `mergeProps()` utilities if you need to separate internal from forwarded properties while preserving reactive getters.
---
