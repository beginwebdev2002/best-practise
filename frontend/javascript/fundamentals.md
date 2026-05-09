---
technology: JavaScript
domain: frontend
level: Senior/Architect
version: ES6-ES2024
tags: [javascript, clean-code, es6, performance, best-practices]
ai_role: Senior JavaScript Performance Expert
last_updated: 2026-05-09
---

# 🚀 Fundamentals

[⬆️ Back to Top](./readme.md)

## 🚀 I. Fundamentals (The Basics)


Please refer to the specialized guides for detailed best practices:

- [📜 Basic Syntax & Fundamentals](./basic-syntax.md)
- [🧹 Clean Code & Logic](./clean-code.md)


## 🚨 0. Common Pitfall
> [!NOTE]
> **Context:** An example of a common JavaScript pitfall.
### ❌ Bad Practice
```javascript
var name = "Alice";
```
### ⚠️ Problem
Using `var` leads to unpredictable scoping issues and hoisting bugs.
### ✅ Best Practice
```javascript
const name = "Alice";
```
### 🚀 Solution
Strictly use `const` and `let` to ensure block scoping and predictability.
