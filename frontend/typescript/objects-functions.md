---
description: Vibe coding guidelines and architectural constraints for TypeScript Objects & Functions within the frontend domain.
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.5+"
tags: [typescript, objects, functions, best-practices, clean-code, scalable-code]
ai_role: Senior TypeScript Expert
last_updated: 2026-03-22
---

# 📦 TypeScript Objects & Functions Best Practices

# 📖 Context & Scope
- **Primary Goal:** Proper typing for objects, arrays, and functions in TypeScript applications.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** TypeScript 5.5+

## III. Objects & Functions (21-30)

## 21. Object literals vs `Record<K, V>`
**Context:** Defining maps/dictionaries.
### ❌ Bad Practice
```typescript
const prices: { [key: string]: number } = { apple: 1 };
```
### ⚠️ Problem
The index signature syntax is more verbose and harder to read.
### ✅ Best Practice
```typescript
const prices: Record<string, number> = { apple: 1 };
```
### 🚀 Solution
Use the `Record` utility type for key-value maps.

## 22. Excess property checks and object spreading
**Context:** Passing objects to functions.
### ❌ Bad Practice
```typescript
const extra = { id: 1, name: 'A', extra: true };
saveUser({ id: 1, name: 'A', extra: true }); // Error: excess property
saveUser(extra); // No error, but 'extra' is leaked into db
```
### ⚠️ Problem
Excess property checks only happen on object literals. Spreading or passing variables can bypass this, leading to data pollution.
### ✅ Best Practice
```typescript
const { extra, ...validUser } = data;
saveUser(validUser);
```
### 🚀 Solution
Be explicit about what data you pass. Use destructuring to strip unknown properties before passing objects to storage or APIs.

## 23. `Readonly<T>` for Immutability
**Context:** Preventing accidental state mutation.
### ❌ Bad Practice
```typescript
function process(config: Config) {
    config.port = 80; // Side effect!
}
```
### ⚠️ Problem
Mutable inputs lead to unpredictable state changes and bugs that are hard to trace in large applications.
### ✅ Best Practice
```typescript
function process(config: Readonly<Config>) {
    // config.port = 80; // Error
}
```
### 🚀 Solution
Use `Readonly<T>` for function parameters and `as const` for configuration objects to enforce immutability at compile time.

## 24. `Awaited<T>` for Promise Unwrapping
**Context:** Getting the resolved type of a Promise.
### ❌ Bad Practice
```typescript
type Result = typeof apiCall extends Promise<infer U> ? U : never;
```
### ⚠️ Problem
Manually unwrapping promises via conditional types is complex and doesn't handle nested promises.
### ✅ Best Practice
```typescript
type Result = Awaited<ReturnType<typeof apiCall>>;
```
### 🚀 Solution
Use the `Awaited` utility type (TS 4.5+) for clean promise unwrapping.

## 25. `this` typing in functions
**Context:** Ensuring correct context in callback-heavy code.
### ❌ Bad Practice
```typescript
function handleClick(this: any, event: Event) {
    this.classList.add('active');
}
```
### ⚠️ Problem
`this` defaults to `any`, making it easy to access properties that don't exist on the actual execution context.
### ✅ Best Practice
```typescript
function handleClick(this: HTMLElement, event: Event) {
    this.classList.add('active');
}
```
### 🚀 Solution
Always type the first "fake" `this` parameter in functions that rely on a specific execution context.

## 26. Constructor Shorthand
**Context:** Defining class properties.
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
Redundant repetition of property names in declaration, parameter, and assignment.
### ✅ Best Practice
```typescript
class User {
    constructor(public readonly name: string) {}
}
```
### 🚀 Solution
Use parameter properties in constructors to declare and initialize class members in one step.

## 27. Abstract classes vs Interfaces
**Context:** Defining blueprints for classes.
### ❌ Bad Practice
```typescript
class BaseService {
    getData() { throw new Error("Not implemented"); }
}
```
### ⚠️ Problem
Normal classes don't force implementation, leading to runtime errors. Interfaces don't allow shared logic.
### ✅ Best Practice
```typescript
abstract class BaseService {
    abstract getData(): Promise<string>;
    log(msg: string) { console.log(msg); }
}
```
### 🚀 Solution
Use `abstract` classes when you need to provide shared logic while forcing sub-classes to implement specific methods.

## 28. Private vs `#private`
**Context:** Encapsulating data in classes.
### ❌ Bad Practice
```typescript
class User {
    private secret = 123;
}
console.log(user['secret']); // Works at runtime
```
### ⚠️ Problem
TypeScript's `private` keyword is only for compile-time. At runtime, the property is fully accessible.
### ✅ Best Practice
```typescript
class User {
    #secret = 123;
}
```
### 🚀 Solution
Use ES2020 `#private` fields for true runtime encapsulation if you are building libraries or high-security components.

## 29. Decorators (Legacy vs TC39)
**Context:** Meta-programming in TypeScript.
### ❌ Bad Practice
```typescript
// Using experimentalDecorators: true
@Logged
class MyClass {}
```
### ⚠️ Problem
Legacy decorators are non-standard and might break in future versions of Node/Browsers.
### ✅ Best Practice
Use the new TC39 Decorators (TS 5.0+) which align with the official JavaScript proposal.
### 🚀 Solution
If starting a new project, avoid decorators unless using a framework that mandates them (like NestJS or Angular).

## 30. Utility Types (`Omit`, `Pick`, `Partial`)
**Context:** Transforming existing types.
### ❌ Bad Practice
```typescript
interface UserUpdate {
    name?: string;
    age?: number;
}
```
### ⚠️ Problem
Manual re-declaration of properties leads to synchronization issues when the base `User` interface changes.
### ✅ Best Practice
```typescript
type UserUpdate = Partial<Pick<User, 'name' | 'age'>>;
```
### 🚀 Solution
Always derive sub-types from the source of truth using built-in utility types.

---
