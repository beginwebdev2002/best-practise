---
description: Vibe coding guidelines and architectural constraints for JavaScript within the frontend domain.
technology: JavaScript
domain: frontend
level: Senior/Architect
version: ES6-ES2024
tags: [javascript, clean-code, es6, performance, best-practices]
ai_role: Senior JavaScript Performance Expert
last_updated: 2026-03-22
---

# 🎨 JavaScript Best Practise

![JavaScript Logo](https://img.icons8.com/?size=100&id=108784&format=png&color=000000)

---
[⬆️ Back to Top](#)

## 🚀 I. Fundamentals (The Basics)

### 🚨 1. `var` vs `const/let`
**Context:** Scoping and hoisting mechanisms in modern JavaScript. `var` is function-scoped and hoisted, leading to unpredictable behavior and accidental global leakage.
#### ❌ Bad Practice
```javascript
var price = 100;
if (true) {
    var price = 200; // Overwrites outer variable
}
console.log(price); // 200
```
#### ⚠️ Problem
`var` does not respect block scope. Its hoisting behavior allows variables to be accessed before declaration (as `undefined`), which bypasses the Temporal Dead Zone (TDZ) safety mechanism, increasing cognitive load and bug density.
#### ✅ Best Practice
```javascript
const price = 100;
if (true) {
    const price = 200; // Block-scoped, unique to this block
}
console.log(price); // 100
```
#### 🚀 Solution
Use `const` by default to ensure immutability of the reference. Use `let` only when reassigning a variable is strictly necessary. This enforces block-level scoping and prevents accidental overrides.

---

### 🚨 2. Loose equality `==`
**Context:** JavaScript's type coercion rules are complex and often counter-intuitive.
#### ❌ Bad Practice
```javascript
if (userCount == '0') {
    // Executes if userCount is 0 (number) or '0' (string)
}
```
#### ⚠️ Problem
The Abstract Equality Comparison Algorithm (`==`) performs implicit type conversion. This leads to edge cases like `[] == ![]` being `true` or `0 == ''` being `true`, which can cause silent logic failures.
#### ✅ Best Practice
```javascript
if (userCount === 0) {
    // Strict comparison
}
```
#### 🚀 Solution
Always use strict equality `===` and inequality `!==`. This forces the developer to handle type conversions explicitly, making the code's intent clear and predictable.

---

### 🚨 3. Global Scope Pollution
**Context:** The global namespace is shared. Overwriting global properties can break third-party libraries or browser APIs.
#### ❌ Bad Practice
```javascript
// In a script file
const config = { api: '/v1' };
function init() { /* ... */ }
```
#### ⚠️ Problem
Variables declared in the top-level scope of a non-module script are attached to `window` (in browsers) or `global` (in Node). This increases the risk of name collisions and memory leaks.
#### ✅ Best Practice
```javascript
// use modules
export const config = { api: '/v1' };

// or IIFE if modules aren't available
(() => {
    const config = { api: '/v1' };
})();
```
#### 🚀 Solution
Use ES Modules (`import/export`) to encapsulate code. Modules have their own scope and do not leak to the global object.

---

### 🚨 4. String concatenation vs Template Literals
**Context:** Readability and handling of multi-line strings/expressions.
#### ❌ Bad Practice
```javascript
const greeting = 'Hello, ' + user.firstName + ' ' + user.lastName + '! ' +
    'Welcome to ' + siteName + '.';
```
#### ⚠️ Problem
Concatenation with `+` is error-prone, hard to read, and difficult to maintain for multi-line strings. It often leads to missing spaces and poor visual structure.
#### ✅ Best Practice
```javascript
const greeting = `Hello, ${user.firstName} ${user.lastName}! 
Welcome to ${siteName}.`;
```
#### 🚀 Solution
Use Template Literals (backticks). They allow for embedded expressions, multi-line strings, and superior readability.

---

### 🚨 5. Magic Numbers
**Context:** Numbers with no context make the codebase hard to maintain.
#### ❌ Bad Practice
```javascript
if (user.age >= 18) {
    grantAccess();
}
```
#### ⚠️ Problem
"18" is a magic number. If the legal age changes, you must find and replace every instance, risking errors if the same number is used for different contexts elsewhere.
#### ✅ Best Practice
```javascript
const LEGAL_AGE = 18;

if (user.age >= LEGAL_AGE) {
    grantAccess();
}
```
#### 🚀 Solution
Extract magic numbers into named constants. This provides semantic meaning and a single source of truth for configuration.

---

### 🚨 6. Boolean comparisons `(if x === true)`
**Context:** Redundancy in conditional logic.
#### ❌ Bad Practice
```javascript
if (isValid === true) { /* ... */ }
```
#### ⚠️ Problem
Comparing a boolean to `true` or `false` is redundant. It adds visual noise without increasing safety.
#### ✅ Best Practice
```javascript
if (isValid) { /* ... */ }
if (!isPending) { /* ... */ }
```
#### 🚀 Solution
Leverage JavaScript's truthiness/falsiness or direct boolean evaluation. It makes the code more concise and idiomatic.

---

### 🚨 7. Array/Object literal vs `new` constructor
**Context:** Object and Array instantiation.
#### ❌ Bad Practice
```javascript
const list = new Array(1, 2, 3);
const map = new Object();
```
#### ⚠️ Problem
The `Array` constructor is inconsistent: `new Array(3)` creates an empty array of length 3, while `new Array(3, 4)` creates `[3, 4]`. Literals are faster and more readable.
#### ✅ Best Practice
```javascript
const list = [1, 2, 3];
const map = {};
```
#### 🚀 Solution
Use literals `[]` and `{}`. They are visually cleaner and perform slightly better as they don't involve a function call.

---

### 🚨 8. Function length/complexity
**Context:** The Single Responsibility Principle (SRP).
#### ❌ Bad Practice
```javascript
function processOrder(order) {
    // 100 lines of validation, DB saving, email sending...
}
```
#### ⚠️ Problem
Large functions are hard to test, debug, and reuse. High cyclomatic complexity makes it difficult for the JIT compiler to optimize the function.
#### ✅ Best Practice
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
#### 🚀 Solution
Break functions into smaller, pure components. Aim for functions under 20 lines that do exactly one thing.

---

### 🚨 9. Deeply nested `if/else` (Arrow code)
**Context:** Cognitive load and code readability.
#### ❌ Bad Practice
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
#### ⚠️ Problem
"Arrow code" (code that expands horizontally) is hard to follow. It forces the reader to keep track of multiple nesting levels in their mental stack.
#### ✅ Best Practice
```javascript
function getData(user) {
    if (!user || !user.isActive || !user.hasPermission) {
        return null;
    }
    return fetchData();
}
```
#### 🚀 Solution
Use "Guard Clauses" to return early. This flattens the structure and handles edge cases first, leaving the happy path at the lowest nesting level.

---

### 🚨 10. Improper naming (Single letters)
**Context:** Self-documenting code.
#### ❌ Bad Practice
```javascript
const d = new Date();
const u = users.map(i => i.n);
```
#### ⚠️ Problem
Single-letter variables (except for standard loop indices like `i` or `j`) provide no context. They make the code unsearchable and confusing for other developers.
#### ✅ Best Practice
```javascript
const today = new Date();
const userNames = users.map(user => user.name);
```
#### 🚀 Solution
Use descriptive, camelCase names that convey the intent and data type of the variable.

---

## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [✨ Modern Syntax & Functional Programming](./modern-syntax.md)
- [⏳ Asynchronous & Logic](./async-logic.md)
- [🧠 Professional & Niche Topics](./professional-niche.md)
