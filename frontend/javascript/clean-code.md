---
technology: JavaScript
domain: frontend
level: Senior/Architect
version: ES2022+
tags: [javascript, best-practices, clean-code, logic]
ai_role: Senior JavaScript Expert
last_updated: 2026-05-05
---

# 🧹 Clean Code & Logic

[⬆️ Back to Top](./readme.md)

### 🚨 6. Boolean comparisons `(if x === true)`
> [!NOTE]
> **Context:** Redundancy in conditional logic.
### ❌ Bad Practice
```javascript
if (isValid === true) { /* ... */ }
```
### ⚠️ Problem
Comparing a boolean to `true` or `false` is redundant. It adds visual noise without increasing safety.
### ✅ Best Practice
```javascript
if (isValid) { /* ... */ }
if (!isPending) { /* ... */ }
```
### 🚀 Solution
Leverage JavaScript's truthiness/falsiness or direct boolean evaluation. It makes the code more concise and idiomatic.
---


### 🚨 7. Array/Object literal vs `new` constructor
> [!NOTE]
> **Context:** Object and Array instantiation.
### ❌ Bad Practice
```javascript
const list = new Array(1, 2, 3);
const map = new Object();
```
### ⚠️ Problem
The `Array` constructor is inconsistent: `new Array(3)` creates an empty array of length 3, while `new Array(3, 4)` creates `[3, 4]`. Literals are faster and more readable.
### ✅ Best Practice
```javascript
const list = [1, 2, 3];
const map = {};
```
### 🚀 Solution
Use literals `[]` and `{}`. They are visually cleaner and perform slightly better as they don't involve a function call.
---


### 🚨 8. Function length/complexity
> [!NOTE]
> **Context:** The Single Responsibility Principle (SRP).
### ❌ Bad Practice
```javascript
function processOrder(order) {
    // 100 lines of validation, DB saving, email sending...
}
```
### ⚠️ Problem
Large functions are hard to test, debug, and reuse. High cyclomatic complexity makes it difficult for the JIT compiler to optimize the function.
### ✅ Best Practice
```javascript
function validateOrder(order) { /* ... */ }
function saveToDatabase(order) { /* ... */ }
function notifyUser(order) { /* ... */ }

function processOrder(order) {
    validateOrder(order);
    saveToDatabase(order);
    notifyUser(order);
}
```
### 🚀 Solution
Break functions into smaller, pure components. Aim for functions under 20 lines that do exactly one thing.
---


### 🚨 9. Deeply nested `if/else` (Arrow code)
> [!NOTE]
> **Context:** Cognitive load and code readability.
### ❌ Bad Practice
```javascript
function getData(user) {
    if (user) {
        if (user.isActive) {
            if (user.hasPermission) {
                return fetchData();
            }
        }
    }
}
```
### ⚠️ Problem
"Arrow code" (code that expands horizontally) is hard to follow. It forces the reader to keep track of multiple nesting levels in their mental stack.
### ✅ Best Practice
```javascript
function getData(user) {
    if (!user || !user.isActive || !user.hasPermission) {
        return null;
    }
    return fetchData();
}
```
### 🚀 Solution
Use "Guard Clauses" to return early. This flattens the structure and handles edge cases first, leaving the happy path at the lowest nesting level.
---


### 🚨 10. Improper naming (Single letters)
> [!NOTE]
> **Context:** Self-documenting code.
### ❌ Bad Practice
```javascript
const d = new Date();
const u = users.map(i => i.n);
```
### ⚠️ Problem
Single-letter variables (except for standard loop indices like `i` or `j`) provide no context. They make the code unsearchable and confusing for other developers.
### ✅ Best Practice
```javascript
const today = new Date();
const userNames = users.map(user => user.name);
```
### 🚀 Solution
Use descriptive, camelCase names that convey the intent and data type of the variable.
---
