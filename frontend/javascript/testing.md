---
technology: JavaScript
domain: frontend
level: Senior/Architect
version: ES6-ES2024
tags: [javascript, testing, best-practices, clean-code, tdd, vibe-coding]
ai_role: Senior JavaScript Testing Expert
last_updated: 2026-04-05
---

# 🧪 JavaScript Testing Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce robust, deterministic, and maintainable testing standards for modern JavaScript applications.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** ES6-ES2024

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** favor AAA (Arrange, Act, Assert) pattern.
> - **Never** write tests that rely on global state or execution order.

---

## 🚀 I. Test Structure

### 🚨 1. Implicit Test Dependencies
> [!NOTE]
> **Context:** Tests that share state or depend on a specific execution order.
### ❌ Bad Practice
```javascript
let user;

test('create user', () => {
  user = { id: 1, name: 'Alice' };
  expect(user.id).toBe(1);
});

test('update user', () => {
  // Relies on the user object created in the previous test
  user.name = 'Bob';
  expect(user.name).toBe('Bob');
});
```
### ⚠️ Problem
Tests that depend on global variables or execution order are brittle. If the test runner executes them in parallel or out of order, they will fail unpredictably, leading to flaky test suites.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```javascript
test('create user', () => {
  const user = { id: 1, name: 'Alice' };
  expect(user.id).toBe(1);
});

test('update user', () => {
  const user = { id: 1, name: 'Alice' }; // Independent setup
  user.name = 'Bob';
  expect(user.name).toBe('Bob');
});
```

### Structural Comparison: Unit Testing vs Integration Testing vs E2E

| Feature | Unit Testing | Integration Testing | End-to-End (E2E) Testing |
| :--- | :--- | :--- | :--- |
| **Scope** | Single isolated function/component | Multiple connected units | Full application workflow |
| **Speed** | Extremely O(1) complexity (<1ms) | O(1) complexity to Medium | Slow (seconds to minutes) |
| **Cost to Write/Maintain**| Low | Medium | High |
| **Confidence Level** | Low (doesn't catch contract issues) | Medium | High (simulates real user) |

### 🚀 Solution
Ensure every test is fully isolated. Use `beforeEach` or setup functions to instantiate fresh state for every individual test case.

---

## ⚙️ II. Asynchronous Code

### 🚨 2. Unhandled Promise Rejections
> [!NOTE]
> **Context:** Testing asynchronous functions.
### ❌ Bad Practice
```javascript
test('fetches data', () => {
  fetchData().then(data => {
    expect(data).toBe('success');
  });
});
```
### ⚠️ Problem
If `fetchData` takes time, the test function will complete synchronously before the Promise resolves. The assertion is never executed, and the test passes falsely.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```javascript
test('fetches data', async () => {
  const data = await fetchData();
  expect(data).toBe('success');
});
```
### 🚀 Solution
Always use `async/await` when testing asynchronous code. This ensures the test runner waits for the Promise to resolve or reject before marking the test as complete.

---
[⬆️ Back to Top](#)
