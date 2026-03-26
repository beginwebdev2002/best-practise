---
description: Vibe coding guidelines and architectural constraints for TypeScript Professional & Niche topics within the frontend domain.
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.5+"
tags: [typescript, advanced, best-practices, clean-code, scalable-code]
ai_role: Senior TypeScript Expert
last_updated: 2026-03-22
---

# 🧠 TypeScript Professional & Niche Best Practices

# 📖 Context & Scope
- **Primary Goal:** Advanced TypeScript features, metaprogramming, and precise utility types.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** TypeScript 5.5+

## IV. Professional & Niche (31-40)

## 31. Using `satisfies` to preserve literal types
**Context:** Checking an object against a type without widening it.
### ❌ Bad Practice
```typescript
const config: Record<string, string> = {
    host: 'localhost'
};
// config.host is type 'string', not 'localhost'
```
### ⚠️ Problem
Direct type annotation widens properties to the most general type, losing specific literal information needed for inference.
### ✅ Best Practice
```typescript
const config = {
    host: 'localhost'
} satisfies Record<string, string>;
// config.host is type 'localhost'
```
### 🚀 Solution
Use `satisfies` (TS 4.9+). It validates the structure but preserves the narrowest possible type for the value.

## 32. `const` type parameters (TS 5.0)
**Context:** Improving inference for generic constants.
### ❌ Bad Practice
```typescript
function route<T extends string[]>(paths: T) { ... }
route(['/home', '/about']); // T is string[]
```
### ⚠️ Problem
Generic inference often widens string arrays to `string[]` unless the caller adds `as const`.
### ✅ Best Practice
```typescript
function route<const T extends string[]>(paths: T) { ... }
route(['/home', '/about']); // T is readonly ['/home', '/about']
```
### 🚀 Solution
Use `const` before a type parameter to force the compiler to treat the input as a constant, preserving literal types without requiring the caller to use `as const`.

## 33. Branding/Tagging for Nominal Typing
**Context:** Preventing accidental mixing of identical primitive types (e.g., `UserId` and `OrderId`).
### ❌ Bad Practice
```typescript
type UserId = string;
type OrderId = string;

const ship = (u: UserId, o: OrderId) => {};
ship('order_123', 'user_456'); // No error, but logic is wrong!
```
### ⚠️ Problem
TypeScript is structural. Two type aliases of `string` are identical and interchangeable.
### ✅ Best Practice
```typescript
type Brand<K, T> = K & { __brand: T };
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

// Usage requires a cast at creation, but provides safety after
const uid = 'user_1' as UserId;
```
### 🚀 Solution
Use "Branding" (adding a phantom property) to simulate nominal typing for critical identifiers.

## 34. Covariance/Contravariance in callbacks
**Context:** Ensuring safe function assignments.
### ❌ Bad Practice
```typescript
interface Logger {
    log: (msg: string) => void; // Defined as a property
}
```
### ⚠️ Problem
Function properties are checked **bivariantly**, which is less strict and can lead to runtime errors when assigning functions with more specialized arguments.
### ✅ Best Practice
```typescript
interface Logger {
    log(msg: string): void; // Defined as a method
}
```
### 🚀 Solution
Use method syntax in interfaces for stricter **contravariant** checking of parameters.

## 35. Avoiding "God Objects" through Mapped Types
**Context:** Transforming object structures dynamically.
### ❌ Bad Practice
```typescript
interface API {
    getUser: () => void;
    getPost: () => void;
}
```
### ⚠️ Problem
Manually adding properties to large interfaces is repetitive and error-prone.
### ✅ Best Practice
```typescript
type Resource = 'User' | 'Post';
type API = {
    [K in Resource as `get${K}`]: () => void;
};
```
### 🚀 Solution
Use Mapped Types and Key Remapping (`as`) to generate interface structures from a single source of truth (like a union of keys).

## 36. Template Literal Types for string-based APIs
**Context:** Enforcing patterns in strings.
### ❌ Bad Practice
```typescript
function setPadding(value: string) { ... } // Accepts "10" (invalid)
```
### ⚠️ Problem
Strings used for CSS or IDs often have strict patterns that `string` doesn't capture.
### ✅ Best Practice
```typescript
type CssValue = `${number}${'px' | 'em' | 'rem'}`;
function setPadding(value: CssValue) { ... }
```
### 🚀 Solution
Use Template Literal types to enforce specific string patterns at compile time.

## 37. Exhaustiveness checking with `never`
**Context:** Ensuring all cases in a union are handled.
### ❌ Bad Practice
```typescript
function handle(action: 'START' | 'STOP') {
    switch (action) {
        case 'START': return 1;
        case 'STOP': return 0;
    }
}
```
### ⚠️ Problem
If you add `'PAUSE'` to the union, the compiler won't warn you that `handle` is now missing a case.
### ✅ Best Practice
```typescript
function handle(action: 'START' | 'STOP' | 'PAUSE') {
    switch (action) {
        case 'START': return 1;
        case 'STOP': return 0;
        default: {
            const _exhaustive: never = action; // Error: 'PAUSE' is not assignable to never
            return _exhaustive;
        }
    }
}
```
### 🚀 Solution
Assign the `default` case to a variable of type `never`. This triggers a compile error if any member of the union is unhandled.

## 38. Recursive Type Aliases
**Context:** Modeling nested structures like JSON or file trees.
### ❌ Bad Practice
```typescript
type Json = string | number | boolean | JsonObject | JsonArray;
interface JsonObject { [key: string]: Json; }
```
### ⚠️ Problem
Older TS versions required interfaces for recursion. Modern TS allows direct recursion.
### ✅ Best Practice
```typescript
type JSONValue =
    | string | number | boolean | null
    | { [key: string]: JSONValue }
    | JSONValue[];
```
### 🚀 Solution
Use recursive type aliases for cleaner definitions of deeply nested data structures.

## 39. `infer` keyword in conditional types
**Context:** Extracting internal types from complex structures.
### ❌ Bad Practice
```typescript
// Hardcoded extraction
type GetArrayType<T> = T extends string[] ? string : never;
```
### ⚠️ Problem
Hardcoding extractions limits reusability and doesn't scale.
### ✅ Best Practice
```typescript
type GetArrayType<T> = T extends (infer U)[] ? U : never;
```
### 🚀 Solution
Use `infer` within conditional types to let TypeScript dynamically capture and name types from within generics.

## 40. Tuple types for fixed-length data
**Context:** Representing arrays with specific structures (e.g., coordinates).
### ❌ Bad Practice
```typescript
const point: number[] = [10, 20];
const [x, y, z] = point; // z is undefined, but TS doesn't know
```
### ⚠️ Problem
`number[]` doesn't capture the length, leading to potential out-of-bounds errors during destructuring.
### ✅ Best Practice
```typescript
const point: [number, number] = [10, 20];
// const [x, y, z] = point; // Error: Tuple has 2 elements
```
### 🚀 Solution
Use Tuples for arrays where the number of elements and their positions are fixed and meaningful.
