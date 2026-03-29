---
description: Vibe coding guidelines and architectural constraints for React Performance within the frontend domain.
tags: [react, performance, use, react-compiler, best-practices, architecture, clean-code]
topic: React Performance
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
technology: React
domain: frontend
level: Senior/Architect
version: "19+"
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

### 1. Manual Memoization vs React Compiler
**Context:** Avoiding unnecessary re-renders.
#### ❌ Bad Practice
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
#### ⚠️ Problem
Adding manual `useMemo` and `useCallback` clutters the codebase, introduces dependency array bugs, and makes code harder to refactor.
#### ✅ Best Practice
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
#### 🚀 Solution
Rely on the **React Compiler** (introduced in React 19+). The compiler automatically memoizes values and functions, meaning manual hooks are largely obsolete and code becomes purely declarative.
- **Performance Note:** The React Compiler analyzes your component structure and injects optimal memoization (similar to SolidJS's granular updates), eliminating the overhead of manual dependency tracking.
- **Security Note:** While the React Compiler does not directly impact security, it ensures components render exactly when their inputs change, reducing side effects that might otherwise expose temporary or stale data to users.

### 2. Resolving Promises During Render
**Context:** Conditionally handling promises without `useEffect` or `useState`.
#### ❌ Bad Practice
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
#### ⚠️ Problem
Using `useEffect` to unwrap promises leads to "waterfalls", unnecessary rendering cycles, and race conditions.
#### ✅ Best Practice
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
#### 🚀 Solution
Use the `use()` API inside components combined with `<Suspense>`.
- **Performance Note:** `use()` suspends the component rendering if the promise is not resolved. This seamlessly integrates with `<Suspense>`, providing a highly optimized rendering fallback behavior.
- **Security Note:** `use()` can also resolve context, mitigating prop-drilling vulnerabilities and ensuring components securely consume data directly from contexts they are explicitly authorized for. Always sanitize any text coming from external APIs before rendering.

[⬆️ Back to Top](#)
