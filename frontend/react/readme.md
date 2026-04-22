---
technology: React
domain: frontend
level: Senior/Architect
version: "19+"
tags: [react, best-practices, architecture, clean-code, scalable-code, modern-react, server-components]
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

### 🚨 1. Direct DOM Manipulation
> [!NOTE]
> **Context:** Updating elements in a React component.
### ❌ Bad Practice
```tsx
function Component() {
  const handleClick = () => {
    document.getElementById('my-element').style.color = 'red';
  };
  return <div id="my-element" onClick={handleClick}>Click me</div>;
}
```
### ⚠️ Problem
Direct DOM manipulation bypasses React's virtual DOM, causing inconsistencies between the actual DOM and React's internal state, leading to forced synchronous layouts and potential XSS vulnerabilities.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
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
### 🚀 Solution
Always use state and props to drive the UI. React uses a virtual DOM to efficiently update the real DOM based on state changes, ensuring deterministic rendering loops.

### 🚨 2. Large Component Files
> [!NOTE]
> **Context:** Managing component complexity.
### ❌ Bad Practice
```tsx
function MassiveDashboard() {
  // 500 lines of state and hooks
  // 1000 lines of JSX layout
  return <div>...</div>;
}
```
### ⚠️ Problem
Massive components are difficult to read, test, and maintain. They violate the Single Responsibility Principle and trigger overly broad re-renders when local state changes.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```tsx
function Dashboard() {
  return (
    <DashboardLayout>
      <Sidebar />
      <MainContent />
    </DashboardLayout>
  );
}
```
### 🚀 Solution
Break down the UI into smaller, reusable components. Extract logic into custom hooks and modularize presentational elements into separate, encapsulated files.
## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [🔄 State Management](./state-management.md)
- [⚡ Performance](./performance.md)
- [🛡️ Security](./security.md)
- [🧪 Testing](./testing.md)

[⬆️ Back to Top](#)
