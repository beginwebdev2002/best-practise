---
technology: React
domain: frontend
level: Senior/Architect
version: "19+"
tags: [react, performance, use, react-compiler, best-practices, architecture, clean-code]
ai_role: Senior React Performance Expert
last_updated: 2026-03-22
---

# ⚡ React Performance & Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Outline advanced techniques for optimal performance in React 19+.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** React 19+
## 📚 Topics

### 🚨 1. Manual Memoization vs React Compiler
> [!NOTE]
> **Context:** Avoiding unnecessary re-renders.
### ❌ Bad Practice
```tsx
import { useMemo, useCallback } from 'react';

function UserList({ users }) {
  const sortedUsers = useMemo(() => users.sort(), [users]);
  const handleSelect = useCallback((id) => selectUser(id), []);

  return (
    <ul>
      {sortedUsers.map(u => <li key={u.id} onClick={() => handleSelect(u.id)}>{u.name}</li>)}
    </ul>
  );
}
```
### ⚠️ Problem
Adding manual `useMemo` and `useCallback` clutters the codebase, introduces dependency array bugs, and makes code harder to refactor.
### ✅ Best Practice
```tsx
function UserList({ users }) {
  const sortedUsers = users.sort();
  const handleSelect = (id) => selectUser(id);

  return (
    <ul>
      {sortedUsers.map(u => <li key={u.id} onClick={() => handleSelect(u.id)}>{u.name}</li>)}
    </ul>
  );
}
```

### Structural Comparison: Manual Memoization vs React Compiler

| Feature | Manual Memoization (`useMemo`, `useCallback`) | React Compiler |
| :--- | :--- | :--- |
| **Developer Experience** | High cognitive load (dependency arrays) | Zero config (automatic) |
| **Code Clarity** | Cluttered with hooks | strictly structured and declarative |
| **Bug Risk** | High (stale closures, missing deps) | Low (compiler-verified) |
| **Optimization** | Component-level only | Structural and deep |

### 🚀 Solution
Rely on the **React Compiler** (introduced in React 19+). The compiler automatically memoizes values and functions, meaning manual hooks are largely obsolete and code becomes purely declarative. This optimizes components structurally and removes manual dependency tracking overhead.

### 🚨 2. Resolving Promises During Render
> [!NOTE]
> **Context:** Conditionally handling promises without `useEffect` or `useState`.
### ❌ Bad Practice
```tsx
import { useEffect, useState } from 'react';

function Profile({ profilePromise }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    profilePromise.then(res => setData(res));
  }, [profilePromise]);

  if (!data) return <p>Loading...</p>;
  return <div>{data.name}</div>;
}
```
### ⚠️ Problem
Using `useEffect` to unwrap promises leads to "waterfalls", unnecessary rendering cycles, and race conditions.
### ✅ Best Practice
```tsx
import { use, Suspense } from 'react';

function Profile({ profilePromise }) {
  const data = use(profilePromise);
  return <div>{data.name}</div>;
}

// Parent Usage
// <Suspense fallback={<p>Loading...</p>}>
//   <Profile profilePromise={profilePromise} />
// </Suspense>
```
### 🚀 Solution
Use the `use()` API inside components combined with `<Suspense>`. `use()` suspends the component rendering if the promise is not resolved. This seamlessly integrates with `<Suspense>`, providing a highly optimized rendering fallback behavior and ensuring safe resolution of asynchronous data.

[⬆️ Back to Top](#)
