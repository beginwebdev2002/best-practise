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

# JavaScript Best Practise

![JavaScript Logo](https://img.icons8.com/?size=100&id=108784&format=png&color=000000)

---
[⬆️ Back to Top](#)

## I. Fundamentals (The Basics)

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

---
[⬆️ Back to Top](#)

## II. Modern Syntax & FP (ES6-ES2024)

### 🚨 11. Manual object property assignment vs Shorthand
**Context:** Reducing boilerplate in object creation.
#### ❌ Bad Practice
```javascript
const name = 'Alice';
const user = {
    name: name,
    age: age
};
```
#### ⚠️ Problem
Redundant repetition of keys and values increases file size and makes the code noisier.
#### ✅ Best Practice
```javascript
const name = 'Alice';
const user = { name, age };
```
#### 🚀 Solution
Use Property Shorthand. When the key and variable name match, omit the value.

### 🚨 12. Using `arguments` vs Rest parameters
**Context:** Handling variable numbers of arguments.
#### ❌ Bad Practice
```javascript
function sum() {
    const args = Array.prototype.slice.call(arguments);
    return args.reduce((a, b) => a + b);
}
```
#### ⚠️ Problem
The `arguments` object is not a real array (it lacks methods like `map` or `reduce`). It is also incompatible with arrow functions and optimization in some V8 versions.
#### ✅ Best Practice
```javascript
const sum = (...args) => args.reduce((a, b) => a + b);
```
#### 🚀 Solution
Use Rest Parameters (`...args`). They create a real array and are more explicit about the function's intent.

### 🚨 13. Manual array copying vs Spread
**Context:** Immutability and array manipulation.
#### ❌ Bad Practice
```javascript
const original = [1, 2, 3];
const copy = [];
for (let i = 0; i < original.length; i++) {
    copy.push(original[i]);
}
```
#### ⚠️ Problem
Manual loops for copying are verbose and imperative. They increase the surface area for bugs (off-by-one errors).
#### ✅ Best Practice
```javascript
const original = [1, 2, 3];
const copy = [...original];
```
#### 🚀 Solution
Use the Spread Operator (`...`). It is concise, declarative, and highly optimized by modern engines.

### 🚨 14. Nested Destructuring
**Context:** Extracting data from complex objects.
#### ❌ Bad Practice
```javascript
const city = user.location.address.city;
const zip = user.location.address.zip;
```
#### ⚠️ Problem
Repetitive property access is verbose and risks "cannot read property of undefined" errors if any parent object is missing.
#### ✅ Best Practice
```javascript
const { location: { address: { city, zip } } } = user;
```
#### 🚀 Solution
Use nested destructuring to extract deeply nested values in a single statement. (Note: Combine with optional chaining if path existence isn't guaranteed).

### 🚨 15. Default Parameters
**Context:** Handling missing arguments.
#### ❌ Bad Practice
```javascript
function setRole(role) {
    role = role || 'guest';
    // ...
}
```
#### ⚠️ Problem
Using `||` for defaults is dangerous if the argument is a "falsy" but valid value (like `0`, `false`, or `''`).
#### ✅ Best Practice
```javascript
function setRole(role = 'guest') {
    // ...
}
```
#### 🚀 Solution
Use ES6 Default Parameters. They only apply if the argument is `undefined`.

### 🚨 16. `forEach` for data transformation vs `map/filter`
**Context:** Declarative vs Imperative programming.
#### ❌ Bad Practice
```javascript
const double = [];
numbers.forEach(n => {
    double.push(n * 2);
});
```
#### ⚠️ Problem
`forEach` relies on side effects (mutating an outer array). It is less expressive and harder to chain than functional alternatives.
#### ✅ Best Practice
```javascript
const double = numbers.map(n => n * 2);
```
#### 🚀 Solution
Use `map`, `filter`, and `reduce` for data transformations. They return new arrays and promote immutability.

### 🚨 17. Object mutation vs Immutability
**Context:** State management and predictability.
#### ❌ Bad Practice
```javascript
function updateAge(user) {
    user.age = 30; // Mutates original object
    return user;
}
```
#### ⚠️ Problem
Mutating objects passed by reference can lead to side effects in other parts of the application that share the same reference, making debugging a nightmare.
#### ✅ Best Practice
```javascript
const updateAge = (user) => ({ ...user, age: 30 });
```
#### 🚀 Solution
Treat objects as immutable. Use the spread operator to create copies with updated properties.

### 🚨 18. Switch statements vs Object Literals
**Context:** Simplifying conditional branching.
#### ❌ Bad Practice
```javascript
switch (action) {
    case 'CREATE': return doCreate();
    case 'UPDATE': return doUpdate();
    default: return doNothing();
}
```
#### ⚠️ Problem
`switch` statements are verbose, require `break` to prevent fallthrough bugs, and have a non-standard block scope.
#### ✅ Best Practice
```javascript
const actions = {
    CREATE: doCreate,
    UPDATE: doUpdate
};
return (actions[action] || doNothing)();
```
#### 🚀 Solution
Use an Object Literal (or Map) as a lookup table. It is cleaner, faster, and more extensible.

### 🚨 19. Not using Optional Chaining `?.`
**Context:** Safe property access in nested objects.
#### ❌ Bad Practice
```javascript
const street = user && user.address && user.address.street;
```
#### ⚠️ Problem
The "logical AND" chain is verbose and repetitive. It quickly becomes unreadable with deeper nesting.
#### ✅ Best Practice
```javascript
const street = user?.address?.street;
```
#### 🚀 Solution
Use Optional Chaining (`?.`). It short-circuits to `undefined` if any part of the chain is nullish.

### 🚨 20. Not using Nullish Coalescing `??`
**Context:** Providing fallback values safely.
#### ❌ Bad Practice
```javascript
const timeout = config.timeout || 5000;
```
#### ⚠️ Problem
If `config.timeout` is `0`, the code will incorrectly fall back to `5000` because `0` is falsy.
#### ✅ Best Practice
```javascript
const timeout = config.timeout ?? 5000;
```
#### 🚀 Solution
Use Nullish Coalescing (`??`). It only falls back if the value is `null` or `undefined`, allowing `0`, `false`, and `''` to be valid.

---

---
[⬆️ Back to Top](#)

## III. Asynchronous & Logic

### 🚨 21. Callback Hell vs Promises
**Context:** Managing asynchronous execution flow.
#### ❌ Bad Practice
```javascript
getData(url, (err, res) => {
    getDetails(res.id, (err, details) => {
        saveData(details, (err, ok) => {
            // Callback Hell
        });
    });
});
```
#### ⚠️ Problem
Deeply nested callbacks (the "Pyramid of Doom") make error handling extremely difficult and code unreadable.
#### ✅ Best Practice
```javascript
fetchData(url)
    .then(res => fetchDetails(res.id))
    .then(details => saveData(details))
    .catch(err => handleError(err));
```
#### 🚀 Solution
Use Promises to flatten the structure and centralize error handling with `.catch()`.

### 🚨 22. Promise.then() nesting vs Async/Await
**Context:** Modern syntax for asynchronous code.
#### ❌ Bad Practice
```javascript
function load() {
    return api.get().then(res => {
        return api.process(res).then(processed => {
            return processed;
        });
    });
}
```
#### ⚠️ Problem
Even with Promises, `.then()` nesting can occur. It still feels like "callback style" logic.
#### ✅ Best Practice
```javascript
async function load() {
    const res = await api.get();
    const processed = await api.process(res);
    return processed;
}
```
#### 🚀 Solution
Use `async/await`. It allows asynchronous code to be written and read like synchronous code, improving maintainability.

### 🚨 23. Sequential `await` in loops vs `Promise.all`
**Context:** Parallelizing independent asynchronous operations.
#### ❌ Bad Practice
```javascript
for (const id of ids) {
    await fetchItem(id); // Pauses loop for each request
}
```
#### ⚠️ Problem
Sequential `await` in a loop causes a "waterfall" effect, where each request waits for the previous one to finish, significantly increasing total execution time.
#### ✅ Best Practice
```javascript
const promises = ids.map(id => fetchItem(id));
await Promise.all(promises);
```
#### 🚀 Solution
Use `Promise.all` to execute independent promises in parallel. This utilizes the full network/IO bandwidth.

### 🚨 24. Missing `try/catch` in async
**Context:** Handling failures in async functions.
#### ❌ Bad Practice
```javascript
async function getData() {
    const data = await fetch(url); // If this fails, the process might crash
    return data;
}
```
#### ⚠️ Problem
Unhandled exceptions in `async` functions result in unhandled promise rejections, which can lead to silent failures or process termination in Node.js.
#### ✅ Best Practice
```javascript
async function getData() {
    try {
        const data = await fetch(url);
        return data;
    } catch (error) {
        logError(error);
    }
}
```
#### 🚀 Solution
Wrap `await` calls in `try/catch` blocks or use a higher-order function to catch errors.

### 🚨 25. Floating point math errors (`0.1 + 0.2`)
**Context:** Precision issues in IEEE 754 arithmetic.
#### ❌ Bad Practice
```javascript
if (0.1 + 0.2 === 0.3) { /* False! */ }
```
#### ⚠️ Problem
$\text{0.1} + \text{0.2} = \text{0.30000000000000004}$ due to binary representation limits. This leads to critical bugs in financial or scientific applications.
#### ✅ Best Practice
```javascript
const EPSILON = Number.EPSILON;
const areEqual = (a, b) => Math.abs(a - b) < EPSILON;

// Or for money:
const totalCents = (10 + 20); // 30 cents
```
#### 🚀 Solution
Use `Number.EPSILON` for comparisons or represent decimals as integers (e.g., cents instead of dollars) to avoid floating point drift.

### 🚨 26. Multiple Boolean flags vs State Machine
**Context:** Managing complex component logic.
#### ❌ Bad Practice
```javascript
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
```
#### ⚠️ Problem
Multiple flags allow for "impossible states" (e.g., `isLoading` and `isError` both being `true`). This makes logic branches exponentially complex.
#### ✅ Best Practice
```javascript
const [status, setStatus] = useState('IDLE'); // IDLE, LOADING, ERROR, SUCCESS
```
#### 🚀 Solution
Use a single state variable or a state machine. This ensures only one state is active at a time and simplifies transitions.

### 🚨 27. Sync logic in Event Loop
**Context:** Keeping the UI responsive.
#### ❌ Bad Practice
```javascript
function processLargeArray(arr) {
    // Blocks the main thread for 2 seconds
    arr.sort().forEach(item => complexCalc(item));
}
```
#### ⚠️ Problem
JavaScript is single-threaded. Heavy synchronous computation blocks the Event Loop, causing the UI to freeze and preventing user interaction.
#### ✅ Best Practice
```javascript
// Use Web Workers or break into chunks
function processInChunks(arr) {
    if (arr.length === 0) return;
    const chunk = arr.splice(0, 100);
    process(chunk);
    setTimeout(() => processInChunks(arr), 0);
}
```
#### 🚀 Solution
Offload heavy tasks to Web Workers or use `requestIdleCallback`/`setTimeout` to break long tasks into smaller chunks, allowing the browser to render between frames.

### 🚨 28. Overusing `classes` where functions suffice
**Context:** Paradigm choice (OOP vs FP).
#### ❌ Bad Practice
```javascript
class Calculator {
    add(a, b) { return a + b; }
}
const calc = new Calculator();
```
#### ⚠️ Problem
Classes introduce unnecessary overhead (prototype chain, `this` binding issues) and make tree-shaking harder for bundlers.
#### ✅ Best Practice
```javascript
export const add = (a, b) => a + b;
```
#### 🚀 Solution
Use simple functions and modules for logic. Use classes only when you need to manage complex stateful instances with shared behavior.

### 🚨 29. Hard-coded Error messages vs Error Classes
**Context:** Robust error handling and debugging.
#### ❌ Bad Practice
```javascript
throw new Error('User not found');
```
#### ⚠️ Problem
Parsing error messages in `catch` blocks is brittle. If the string changes, the error handling logic breaks.
#### ✅ Best Practice
```javascript
class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User ${userId} not found`);
        this.name = 'UserNotFoundError';
        this.code = 404;
    }
}
```
#### 🚀 Solution
Extend the `Error` class to create custom error types. Use `instanceof` check in catch blocks to handle specific errors differently.

### 🚨 30. Unhandled Rejections
**Context:** Reliability of asynchronous flows.
#### ❌ Bad Practice
```javascript
// No .catch() or try/catch
fetch('/api/data');
```
#### ⚠️ Problem
Unhandled rejections create silent failures. In production environments, this can lead to memory leaks as the promise state stays pending or rejected without being cleared.
#### ✅ Best Practice
```javascript
window.addEventListener('unhandledrejection', event => {
    reportToSentry(event.reason);
});
```
#### 🚀 Solution
Always handle promise rejections. Implement a global unhandled rejection listener as a safety net for monitoring.

---

---
[⬆️ Back to Top](#)

## IV. Professional & Niche (Senior Level)

### 🚨 31. Memory Leaks: Unremoved Event Listeners
**Context:** Long-lived applications (SPAs).
#### ❌ Bad Practice
```javascript
window.addEventListener('resize', () => this.handleResize());
// Component unmounts, but listener remains
```
#### ⚠️ Problem
The event listener keeps a reference to the component/context, preventing garbage collection even after the component is destroyed.
#### ✅ Best Practice
```javascript
const handler = () => this.handleResize();
window.addEventListener('resize', handler);
// Cleanup:
window.removeEventListener('resize', handler);
```
#### 🚀 Solution
Always remove event listeners in cleanup phases (e.g., `componentWillUnmount` or `useEffect` return). Use `AbortController` for an even more modern approach to listener cleanup.

### 🚨 32. Memory Leaks: Forgotten Intervals/Timeouts
**Context:** Managing temporal background tasks.
#### ❌ Bad Practice
```javascript
setInterval(() => {
    fetchStatus();
}, 1000);
```
#### ⚠️ Problem
Intervals continue to run indefinitely until the page is closed, even if the data they process is no longer needed, consuming CPU and memory.
#### ✅ Best Practice
```javascript
const intervalId = setInterval(fetchStatus, 1000);
// Later:
clearInterval(intervalId);
```
#### 🚀 Solution
Store the ID returned by `setTimeout` or `setInterval` and clear it when the task is no longer relevant.

### 🚨 33. Closures inside loops (Memory/Scope issues)
**Context:** Understanding the Event Loop and closure capture.
#### ❌ Bad Practice
```javascript
for (var i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 100); // Prints '5' five times
}
```
#### ⚠️ Problem
`var` is function-scoped. By the time the `setTimeout` executes, the loop has finished and `i` is 5. Each closure shares the same reference to `i`.
#### ✅ Best Practice
```javascript
for (let i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 100); // Prints 0, 1, 2, 3, 4
}
```
#### 🚀 Solution
Use `let` in loop headers. It creates a new binding for each iteration, ensuring the closure captures the value of `i` at that specific moment.

### 🚨 34. Throwing Strings instead of `new Error()`
**Context:** Ensuring useful stack traces.
#### ❌ Bad Practice
```javascript
throw 'Something went wrong';
```
#### ⚠️ Problem
Throwing a string provides no stack trace. It makes it nearly impossible to determine where the error originated in a complex call stack.
#### ✅ Best Practice
```javascript
throw new Error('Something went wrong');
```
#### 🚀 Solution
Always throw an instance of `Error` (or a subclass). This captures the `stack` property, which is vital for debugging.

### 🚨 35. Modifying Built-in Prototypes
**Context:** Ecosystem compatibility and stability.
#### ❌ Bad Practice
```javascript
Array.prototype.last = function() {
    return this[this.length - 1];
};
```
#### ⚠️ Problem
"Monkey patching" built-ins can lead to collisions if a future ECMAScript version implements a method with the same name but different behavior. It also breaks for-in loops if not handled carefully.
#### ✅ Best Practice
```javascript
const last = (arr) => arr[arr.length - 1];
```
#### 🚀 Solution
Use utility functions or wrapper classes instead of modifying global prototypes.

### 🚨 36. Premature Optimization (e.g., bitwise for rounding)
**Context:** Readability vs Micro-benchmarks.
#### ❌ Bad Practice
```javascript
const floor = ~~x; // Double bitwise NOT to floor
```
#### ⚠️ Problem
While `~~` is slightly faster in some engines, it makes the code cryptic. It also only works for numbers within the 32-bit integer range.
#### ✅ Best Practice
```javascript
const floor = Math.floor(x);
```
#### 🚀 Solution
Prioritize readability. Modern JIT compilers are smart enough to optimize `Math.floor`. Only use bitwise tricks if profiling proves it's a critical bottleneck in a hot path.

### 🚨 37. V8 Hidden Classes: Changing object shape after initialization
**Context:** V8 JIT optimization.
#### ❌ Bad Practice
```javascript
function User(name) {
    this.name = name;
}
const u1 = new User('Alice');
u1.age = 25; // Dynamically adding property
```
#### ⚠️ Problem
V8 creates "Hidden Classes" to optimize object property access. Adding properties after initialization changes the "shape" of the object, causing V8 to drop to a slower "Dictionary Mode" for that object.
#### ✅ Best Practice
```javascript
function User(name, age) {
    this.name = name;
    this.age = age;
}
const u1 = new User('Alice', 25);
```
#### 🚀 Solution
Initialize all object properties in the constructor or a factory function. Maintain a consistent object "shape" to keep V8 in the optimized path.

### 🚨 38. Array Hole (Sparse Arrays) performance
**Context:** Memory allocation and JIT optimization.
#### ❌ Bad Practice
```javascript
const arr = new Array(100);
arr[50] = 'val';
```
#### ⚠️ Problem
Creating "holes" in arrays makes them "sparse". Sparse arrays are stored differently (as hash maps) which is much slower for iteration and access than "packed" arrays.
#### ✅ Best Practice
```javascript
const arr = Array.from({ length: 100 }, () => null);
```
#### 🚀 Solution
Initialize arrays with default values (like `null` or `0`) instead of leaving empty slots. This keeps the array in "packed" mode.

### 🚨 39. Using `eval()` or `new Function()`
**Context:** Security and performance.
#### ❌ Bad Practice
```javascript
const result = eval('2 + 2');
```
#### ⚠️ Problem
`eval()` executes strings as code, opening a massive XSS security vulnerability if the string contains user input. It also prevents the JIT compiler from optimizing the surrounding scope.
#### ✅ Best Practice
```javascript
const result = new Function('a', 'b', 'return a + b')(2, 2); // Slightly better, but still risky
// Better:
const operations = { '+': (a, b) => a + b };
```
#### 🚀 Solution
Avoid `eval()`. Use lookup tables, JSON parsing, or safe math libraries to handle dynamic logic.

### 🚨 40. Micro-optimizations that hurt readability
**Context:** Maintaining a healthy codebase.
#### ❌ Bad Practice
```javascript
for (let i = 0, len = arr.length; i < len; i++) { /* ... */ }
```
#### ⚠️ Problem
Caching `arr.length` was necessary 15 years ago. Today, modern engines optimize this automatically. Adding extra variables for micro-gains makes the code harder to read.
#### ✅ Best Practice
```javascript
for (const item of arr) { /* ... */ }
```
#### 🚀 Solution
Focus on "Big O" complexity and clean code. Only micro-optimize after profiling identifies a specific performance hotspot.
