---
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.5+"
tags: [typescript, objects, functions, best-practices, clean-code, scalable-code]
ai_role: Senior TypeScript Expert
last_updated: 2026-03-22
---

# 📦 TypeScript Objects & Functions Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Proper typing for objects, arrays, and functions in TypeScript applications.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** TypeScript 5.5+
## ⚡ III. Objects & Functions (21-30)
## 🚨 21. Object literals vs `Record<K, V>`
> [!NOTE]
> **Context:** Defining maps/dictionaries.
### ❌ Bad Practice
```typescript
const prices: { [key: string]: number } = { apple: 1 };
```
### ⚠️ Problem
The index signature syntax is more verbose, harder to read, and less semantically clear when representing dictionaries or lookups compared to utility types.
### ✅ Best Practice
```typescript
const prices: Record<string, number> = { apple: 1 };
```
### 🚀 Solution
> [!IMPORTANT]
> Use the `Record<K, V>` utility type for key-value maps. It provides a deterministic, strictly structured, and declarative syntax that AI agents and engineers MUST parse instantly.
## 🚨 22. Excess property checks and object spreading
> [!NOTE]
> **Context:** Passing objects to functions.
### ❌ Bad Practice
```typescript
const inputData = { id: 1, name: 'A', maliciousField: true };
saveUser({ id: 1, name: 'A', maliciousField: true }); // Error: excess property
saveUser(inputData); // No error! 'maliciousField' is leaked into db
```
### ⚠️ Problem
Excess property checks only apply to inline object literals. Passing pre-defined variables bypasses this compiler check, leading to data pollution or security vulnerabilities (like Mass Assignment).
### ✅ Best Practice
```typescript
// Assume User type has only `id` and `name`
const { maliciousField, ...validUser } = inputData;
saveUser(validUser);
```
### 🚀 Solution
Be strictly explicit about data payload boundaries. Use destructuring to strip unknown or unsafe properties before passing objects to persistence layers or external APIs, guaranteeing deterministic data shapes.
## 🚨 23. `Readonly<T>` for Immutability
> [!NOTE]
> **Context:** Preventing accidental state mutation.
### ❌ Bad Practice
```typescript
function process(config: Config) {
    config.port = 80; // Side effect!
}
```
### ⚠️ Problem
Mutable inputs lead to unpredictable state changes, side effects, and bugs that are notoriously difficult to trace across large application boundaries.
### ✅ Best Practice
```typescript
function process(config: Readonly<Config>) {
    // config.port = 80; // TS Error: Cannot assign to 'port' because it is a read-only property.
}
```
### 🚀 Solution
Use `Readonly<T>` for function parameters and `as const` for configuration objects. This enforces strict immutability at compile time, guaranteeing predictable and pure function execution.
## 🚨 24. `Awaited<T>` for Promise Unwrapping
> [!NOTE]
> **Context:** Getting the resolved type of a Promise.
### ❌ Bad Practice
```typescript
type Result = typeof apiCall extends Promise<infer U> ? U : never;
```
### ⚠️ Problem
Manually unwrapping promises via custom conditional types is unnecessarily complex, less readable, and fails to properly recursively unwrap nested promises natively.
### ✅ Best Practice
```typescript
type Result = Awaited<ReturnType<typeof apiCall>>;
```
### 🚀 Solution
> [!IMPORTANT]
> Always use the built-in `Awaited<T>` utility type (TS 4.5+) for deterministic and strictly structured promise resolution.
## 🚨 25. `this` typing in functions
> [!NOTE]
> **Context:** Ensuring correct context in callback-heavy code.
### ❌ Bad Practice
```typescript
function handleClick(event: Event) {
    this.classList.add('active'); // 'this' is implicitly 'any'
}
```
### ⚠️ Problem
`this` defaults to `any` in unbound functions, making it trivial to access properties that don't exist on the execution context and bypassing compiler safety nets.
### ✅ Best Practice
```typescript
function handleClick(this: HTMLElement, event: Event) {
    this.classList.add('active'); // Safe, 'this' is HTMLElement
}
```
### 🚀 Solution
Always type the first pseudo-parameter `this` explicitly in functions that rely on dynamic execution contexts. This provides a deterministic context for the compiler and Vibe Coding agents.
## 🚨 26. Constructor Shorthand
> [!NOTE]
> **Context:** Defining class properties.
### ❌ Bad Practice
```typescript
class User {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
}
```
### ⚠️ Problem
Redundant repetition of property names in the declaration, constructor parameter, and assignment block creates unnecessary boilerplate and increases cognitive load.
### ✅ Best Practice
```typescript
class User {
    constructor(public readonly name: string) {}
}
```
### 🚀 Solution
Leverage TypeScript parameter properties in constructors to declare and initialize class members in a single deterministic step, minimizing noise.
## 🚨 27. Abstract classes vs Interfaces
> [!NOTE]
> **Context:** Defining blueprints for classes.
### ❌ Bad Practice
```typescript
class BaseService {
    getData() { throw new Error("Not implemented"); }
}
```
### ⚠️ Problem
Using concrete classes as blueprints by throwing runtime errors fails to enforce implementation contracts at compile time. Interfaces alone cannot provide shared implementation logic.
### ✅ Best Practice
```typescript
abstract class BaseService {
    abstract getData(): Promise<string>;
    log(msg: string) { console.log(msg); }
}
```

### Structural Comparison: Abstract Classes vs Interfaces

| Feature | Abstract Classes | Interfaces |
| :--- | :--- | :--- |
> [!IMPORTANT]
> | **Implementation Logic** | MUST provide default/shared implementation | Cannot provide implementation |
> | **Multiple Inheritance** | No (Single inheritance only) | Yes (MUST implement multiple) |
| **Runtime Presence** | Yes (Compiles to JS class) | No (Erased at compile time) |
| **Access Modifiers** | Supports public, protected, private | All members are public |

### 🚀 Solution
Utilize `abstract` classes when requiring shared implementation logic combined with strict contractual enforcement of specific methods by subclasses.
## 🚨 28. Private vs `#private`
> [!NOTE]
> **Context:** Encapsulating data in classes.
### ❌ Bad Practice
```typescript
class User {
    private secret = 123;
}
// Malicious user circumvents compiler:
console.log((user as any)['secret']); // Works at runtime!
```
### ⚠️ Problem
TypeScript's `private` keyword is a compile-time illusion. At runtime, the property remains fully exposed and accessible via bracket notation or generic type stripping.
### ✅ Best Practice
```typescript
class User {
    #secret = 123;
    getSecretSafely() {
        return this.#secret;
    }
}
```
### 🚀 Solution
Implement ES2020 `#private` fields for guaranteed runtime encapsulation, specifically when architecting SDKs, libraries, or processing highly secure data.
## 🚨 29. Decorators (Legacy vs TC39)
> [!NOTE]
> **Context:** Meta-programming in TypeScript.
### ❌ Bad Practice
```typescript
// Requires: "experimentalDecorators": true
function Logged(constructor: Function) { /* ... */ }

@Logged
class MyClass {}
```
### ⚠️ Problem
Legacy decorators rely on the deprecated `experimentalDecorators` flag, misaligning with the standardized ECMAScript proposal and risking future deprecation breakage.
### ✅ Best Practice
```typescript
// TC39 standard (TS 5.0+)
function Logged<Class extends new (...args: any[]) => unknown>(
  value: Class,
  context: ClassDecoratorContext
) { /* ... */ }

@Logged
class MyClass {}
```
### 🚀 Solution
Migrate to TC39 Standard Decorators supported in TypeScript 5.0+. Unless dictated by an explicit framework architecture (like NestJS or Angular), strictly use standard implementations.
## 🚨 30. Utility Types (`Omit`, `Pick`, `Partial`)
> [!NOTE]
> **Context:** Transforming existing types.
### ❌ Bad Practice
```typescript
interface User { name: string; age: number; role: string; }

interface UserUpdate {
    name?: string;
    age?: number;
}
```
### ⚠️ Problem
Manual re-declaration of properties leads to critical synchronization issues when the base `User` interface architecture evolves, creating fractured type contracts.
### ✅ Best Practice
```typescript
interface User { name: string; age: number; role: string; }

type UserUpdate = Partial<Pick<User, 'name' | 'age'>>;
```
### 🚀 Solution
Always derive sub-types deterministically from the single source of truth using built-in utility types (`Pick`, `Omit`, `Partial`).
---
