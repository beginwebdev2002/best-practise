---
description: Vibe coding guidelines and architectural constraints for TypeScript within the frontend domain.
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.0+"
tags: [typescript, type-safety, clean-code, best-practices, architecture]
ai_role: Senior TypeScript Architecture Expert
last_updated: 2026-03-22
---

# 🎨 TypeScript Best Practise

![TypeScript Logo](https://img.icons8.com/?size=100&id=uJM6fQYqDaZK&format=png&color=000000)

## 🚀 I. Fundamentals (1-10)

## ⚡ 1. `any` vs `unknown`
**Context:** Handling data of an uncertain type. `any` disables all type-checking, while `unknown` forces safety.
### ❌ Bad Practice
```typescript
function process(data: any) {
    console.log(data.name); // No error, but might crash at runtime
}
```
### ⚠️ Problem
`any` is a "get out of jail free" card that propagates through the codebase, effectively turning off TypeScript's benefits and hiding potential runtime exceptions.
### ✅ Best Practice
```typescript
function process(data: unknown) {
    if (data && typeof data === 'object' && 'name' in data) {
        console.log((data as { name: string }).name);
    }
}
```
### 🚀 Solution
Use `unknown` for values whose type is not yet determined. It requires a type check or assertion before usage, ensuring the developer acknowledges the data's structure.

---

## ⚡ 2. `null` vs `undefined` in APIs
**Context:** Distinguishing between "value not provided" and "value is empty."
### ❌ Bad Practice
```typescript
interface UserResponse {
    bio: string | null | undefined;
}
```
### ⚠️ Problem
Using both creates ambiguity. In JSON, `undefined` properties are often stripped, while `null` is preserved. Mixing them increases complexity in conditional checks.
### ✅ Best Practice
```typescript
interface UserResponse {
    bio?: string | null; // Optional if missing, null if explicitly empty
}
```
### 🚀 Solution
Standardize: use `undefined` (optional properties) for missing keys and `null` for intentional absence of value. Avoid using both for the same field unless strictly required by a legacy API.

---

## ⚡ 3. `Array<T>` vs `T[]`
**Context:** Visual consistency in array declarations.
### ❌ Bad Practice
```typescript
const users: Array<User> = [];
const complex: Array<string | number> = [];
```
### ⚠️ Problem
`Array<T>` is more verbose and can be confused with other generic types. It is harder to scan in complex signatures.
### ✅ Best Practice
```typescript
const users: User[] = [];
const complex: (string | number)[] = [];
```
### 🚀 Solution
Prefer the shorthand `T[]`. It is idiomatic, more readable, and clearly distinguishes arrays from other generic containers like `Record` or `Promise`.

---

## ⚡ 4. `interface` vs `type`
**Context:** Defining object structures and aliases.
### ❌ Bad Practice
```typescript
interface Point { x: number; y: number; }
interface ID extends string {} // Error: Interface can only extend objects
```
### ⚠️ Problem
`interface` is limited to objects and allows "declaration merging," which can lead to accidental property overrides in global scopes.
### ✅ Best Practice
```typescript
type Point = { x: number; y: number; };
type ID = string;
type Union = 'A' | 'B';
```
### 🚀 Solution
Use `type` for almost everything (unions, primitives, intersections). Use `interface` only when you specifically need declaration merging or for public library APIs where consumers might need to extend types.

---

## ⚡ 5. Function Overloads vs Union Types
**Context:** Handling functions with different input/output combinations.
### ❌ Bad Practice
```typescript
function format(input: string): string;
function format(input: number): string;
function format(input: any): string {
    return String(input);
}
```
### ⚠️ Problem
Overloads are verbose and can be harder to implement correctly. They often require `any` or complex type-casting in the implementation body.
### ✅ Best Practice
```typescript
function format(input: string | number): string {
    return String(input);
}
```
### 🚀 Solution
Prefer Union types when the implementation logic is identical for all types. Reserve overloads only for cases where the return type strictly depends on the input type and cannot be expressed via generics.

---

## 🎯 6. Global Scope Pollution (Legacy Namespaces)
**Context:** Organizing code in the ES Module era.
### ❌ Bad Practice
```typescript
namespace Utils {
    export const log = (msg: string) => console.log(msg);
}
```
### ⚠️ Problem
Namespaces are a legacy TypeScript feature. They don't play well with modern bundlers (Tree Shaking), are harder to test, and can lead to naming collisions in the global scope.
### ✅ Best Practice
```typescript
// utils.ts
export const log = (msg: string) => console.log(msg);
```
### 🚀 Solution
Use ES Modules (`export`/`import`). They are the industry standard, supported by all modern environments, and allow for better static analysis.

---

## ⚡ 7. `enum` vs `const object`
**Context:** Grouping related constants.
### ❌ Bad Practice
```typescript
enum Status {
    Active,
    Inactive
}
```
### ⚠️ Problem
Enums generate extra runtime code and have "reverse mapping" behavior that can lead to bugs (e.g., `Status[0]` returns "Active"). They also don't align with "TypeScript as a type-only layer."
### ✅ Best Practice
```typescript
const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
} as const;

type Status = typeof STATUS[keyof typeof STATUS];
```
### 🚀 Solution
Use `const` objects with `as const` and a derived union type. This is more predictable, emits cleaner code, and is easier to iterate over.

---

## ⚡ 8. Explicit `any` in Parameters
**Context:** Enforcing strict type safety.
### ❌ Bad Practice
```typescript
function save(data) { // Implicit any if strict: false
    db.push(data);
}
```
### ⚠️ Problem
Implicit `any` bypasses the compiler's ability to verify data flow, leading to "undefined is not a function" errors that TypeScript was designed to prevent.
### ✅ Best Practice
```typescript
function save(data: UserData) {
    db.push(data);
}
```
### 🚀 Solution
Enable `noImplicitAny: true` in `tsconfig.json`. Always define specific types or use `unknown` if the type is truly dynamic.

---

## ⚡ 9. Manual Type Guards vs Type Predicates
**Context:** Narrowing types inside conditional blocks.
### ❌ Bad Practice
```typescript
if (typeof input === 'object' && input !== null && 'admin' in input) {
    const isAdmin = (input as any).admin;
}
```
### ⚠️ Problem
Repeating complex checks is error-prone and requires manual casting (`as any`) which breaks safety.
### ✅ Best Practice
```typescript
function isAdmin(user: unknown): user is Admin {
    return !!user && typeof user === 'object' && 'admin' in user;
}

if (isAdmin(input)) {
    console.log(input.admin); // input is automatically narrowed to Admin
}
```
### 🚀 Solution
Use Type Predicates (`arg is Type`) to create reusable, safe narrowing functions.

---

## ⚡ 10. Triple-Slash Directives
**Context:** Referencing types or files.
### ❌ Bad Practice
```typescript
/// <reference path="./types.d.ts" />
```
### ⚠️ Problem
Triple-slash directives are legacy syntax. They make dependencies implicit and can lead to compilation order issues.
### ✅ Best Practice
```typescript
import { MyType } from './types';
```
### 🚀 Solution
Use standard ES `import` statements. Manage global types via `tsconfig.json` `types` array if necessary.

---


---
[⬆️ Back to Top](#)

## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [🛡️ Logic & Safety](./logic-safety.md)
- [📦 Objects & Functions](./objects-functions.md)
- [🧠 Professional & Niche Topics](./professional-niche.md)
