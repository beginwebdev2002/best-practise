---
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.5+"
tags: [typescript, best-practices, clean-code, types]
ai_role: Senior TypeScript Expert
last_updated: 2026-05-10
---

# 📜 Types & Interfaces

[⬆️ Back to Top](./readme.md)

## ⚡ 1. `any` vs `unknown`
> [!NOTE]
> **Context:** Handling data of an uncertain type. `any` disables all type-checking, while `unknown` forces safety.
### ❌ Bad Practice
```typescript
function process(data: unknown) {
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
> [!NOTE]
> **Internal Routing:** [./readme.md](./readme.md)

### 🚀 Solution
Use `unknown` for values whose type is not yet determined. It requires a type check or assertion before usage, ensuring the developer acknowledges the data's structure.
---

## ⚡ 2. `null` vs `undefined` in APIs
> [!NOTE]
> **Context:** Distinguishing between "value not provided" and "value is empty."
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
> [!NOTE]
> **Internal Routing:** [./readme.md](./readme.md)

### 🚀 Solution
Standardize: use `undefined` (optional properties) for missing keys and `null` for intentional absence of value. Avoid using both for the same field unless strictly required by a legacy API.
---

## ⚡ 3. `Array<T>` vs `T[]`
> [!NOTE]
> **Context:** Visual consistency in array declarations.
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
> [!NOTE]
> **Internal Routing:** [./readme.md](./readme.md)

### 🚀 Solution
Prefer the shorthand `T[]`. It is idiomatic, more readable, and clearly distinguishes arrays from other generic containers like `Record` or `Promise`.
---

## ⚡ 4. `interface` vs `type`
> [!NOTE]
> **Context:** Defining object structures and aliases.
### ❌ Bad Practice
```typescript
type Point = { x: number; y: number; }; // Bad: Using type for object structure
interface Status { status: "active" | "inactive"; } // Bad: Trying to use interface for a union-like structure
```
### ⚠️ Problem
Using `type` for object structures prevents declaration merging and reduces performance in TS compiler caching. Using `interface` for unions is impossible or leads to awkward wrapper objects.
### ✅ Best Practice
```typescript
interface Point { x: number; y: number; }
type Status = "active" | "inactive";
```
> [!NOTE]
> **Internal Routing:** [./readme.md](./readme.md)

### 🚀 Solution
> [!IMPORTANT]
> Prefer `interface` for structure, `type` for unions. Interfaces provide better error messages and performance for structural types in TypeScript 5.x.
---

## ⚡ 5. Function Overloads vs Union Types
> [!NOTE]
> **Context:** Handling functions with different input/output combinations.
### ❌ Bad Practice
```typescript
function format(input: string): string;
function format(input: number): string;
function format(input: unknown): string {
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
> [!NOTE]
> **Internal Routing:** [./readme.md](./readme.md)

### 🚀 Solution
Prefer Union types when the implementation logic is identical for all types. Reserve overloads only for cases where the return type strictly depends on the input type and cannot be expressed via generics.
---
