---
description: Vibe coding guidelines and architectural constraints for React within the frontend domain.
tags: [react, best-practices, architecture, clean-code, scalable-code, modern-react, server-components]
topic: React
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
technology: React
domain: frontend
level: Senior/Architect
version: "19+"
ai_role: Senior React Expert
last_updated: 2026-03-22
---

# ⚛️ React Production-Ready Best Practices

# 📖 Context & Scope
- **Primary Goal:** Provide architectural best practices for modern React development.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** React 19+

> [!NOTE]
> When building React applications in 2026, always implement the React best practices described here to ensure maximum performance, maintainability, and security.

## 🏗 Architecture Principles

- Adhere to the defined [Architectural Patterns](../../architectures/readme.md) when building applications.
- Strongly prefer **Feature Sliced Design (FSD)** for applications scaling across multiple teams.

## 🚀 I. Basics & Popular

### 1. Direct DOM Manipulation
**Context:** Updating elements in a React component.
#### ❌ Bad Practice
```tsx
function Component() {
  const handleClick = () => {
    document.getElementById('my-element').style.color = 'red';
  };
  return <div id="my-element" onClick={handleClick}>Click me</div>;
}
```
#### ⚠️ Problem
Direct DOM manipulation bypasses React's virtual DOM, causing inconsistencies between the actual DOM and React's internal state.
#### ✅ Best Practice
```tsx
function Component() {
  const [isActive, setIsActive] = useState(false);
  return (
    <div
      style={{ color: isActive ? 'red' : 'black' }}
      onClick={() => setIsActive(!isActive)}
    >
      Click me
    </div>
  );
}
```
#### 🚀 Solution
Always use state and props to drive the UI. React uses a virtual DOM to efficiently update the real DOM based on state changes.
- **Performance Note:** React's virtual DOM diffing algorithm is highly optimized. Bypassing it can lead to forced synchronous layouts and jank.
- **Security Note:** Direct DOM manipulation can open up Cross-Site Scripting (XSS) vulnerabilities if user input is not properly sanitized before being inserted into the DOM.

### 2. Large Component Files
**Context:** Managing component complexity.
#### ❌ Bad Practice
A single 2000-line file containing the entire page's logic and UI.
#### ⚠️ Problem
Massive components are difficult to read, test, and maintain. They often violate the Single Responsibility Principle.
#### ✅ Best Practice
Break down the UI into smaller, reusable components, each with a single responsibility.
#### 🚀 Solution
Extract logic into custom hooks and presentational elements into separate files.

## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [🔄 State Management](./state-management.md)
- [⚡ Performance](./performance.md)

[⬆️ Back to Top](#)
