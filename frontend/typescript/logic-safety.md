---
description: Vibe coding guidelines and architectural constraints for TypeScript Logic & Safety within the frontend domain.
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.5+"
tags: [typescript, type-safety, best-practices, clean-code, scalable-code]
ai_role: Senior TypeScript Expert
last_updated: 2026-03-22
---

# 🛡️ TypeScript Logic & Safety Best Practices

# 📖 Context & Scope
- **Primary Goal:** Enforce strict type safety and logical soundness in TypeScript.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** TypeScript 5.5+

## II. Logic & Safety (11-20)

## 11. Type Assertions (`as`) vs Narrowing
**Context:** Telling the compiler what a type is.
### ❌ Bad Practice
```typescript
const user = response.data as User;
console.log(user.id);
```
### ⚠️ Problem
`as` forces the compiler to trust you. If the runtime data doesn't match the interface, the app will crash silently.
### ✅ Best Practice
```typescript
const user = UserSchema.parse(response.data); // Using Zod for runtime validation
// OR
if (isValidUser(response.data)) { ... }
```
### 🚀 Solution
Avoid type assertions. Use runtime validation (Zod, Valibot) or Type Guards to ensure the data actually matches the type you expect.

## 12. Non-null Assertion Operator (`!`)
**Context:** Dealing with potentially `null` or `undefined` values.
### ❌ Bad Practice
```typescript
const name = user!.profile!.name;
```
### ⚠️ Problem
The `!` operator suppresses the compiler warning but doesn't handle the runtime reality. If `user` is null, this throws a `TypeError`.
### ✅ Best Practice
```typescript
const name = user?.profile?.name ?? 'Guest';
```
### 🚀 Solution
Use Optional Chaining (`?.`) and Nullish Coalescing (`??`) to handle missing values gracefully.

## 13. Lack of Discriminated Unions
**Context:** Modeling complex states like API responses.
### ❌ Bad Practice
```typescript
interface State {
    isLoading: boolean;
    data?: string;
    error?: string;
}
```
### ⚠️ Problem
This allows "impossible states" (e.g., `isLoading: true` AND `data: '...'`). It requires awkward optional checking.
### ✅ Best Practice
```typescript
type State =
    | { type: 'LOADING' }
    | { type: 'SUCCESS', data: string }
    | { type: 'ERROR', error: string };
```
### 🚀 Solution
Use Discriminated Unions (with a shared literal property like `type` or `kind`). This makes states mutually exclusive and simplifies logic.

## 14. Boolean casting (`!!`)
**Context:** Converting values to booleans.
### ❌ Bad Practice
```typescript
const hasAccess = !!user.token;
```
### ⚠️ Problem
`!!` is cryptic and less readable for beginners. It also doesn't provide type safety if the underlying value could be complex.
### ✅ Best Practice
```typescript
const hasAccess = Boolean(user.token);
// OR
const hasAccess = user.token !== undefined;
```
### 🚀 Solution
Use the `Boolean()` constructor or explicit comparisons for clarity.

## 15. Using `Object` for non-primitive types
**Context:** Restricting types to objects.
### ❌ Bad Practice
```typescript
function cache(obj: Object) { ... }
```
### ⚠️ Problem
The `Object` type (capital O) includes primitives like `string` or `number` because they have methods. `object` (lowercase) is also vague.
### ✅ Best Practice
```typescript
function cache(obj: Record<string, unknown>) { ... }
```
### 🚀 Solution
Use `Record<string, unknown>` for general objects or `Record<string, never>` for empty objects to ensure keys are strings and values are handled safely.

## 16. Function types vs Object types for functions
**Context:** Defining function signatures.
### ❌ Bad Practice
```typescript
type ClickHandler = {
    (e: Event): void;
};
```
### ⚠️ Problem
Using the object literal syntax for single functions is unnecessarily complex and harder to read.
### ✅ Best Practice
```typescript
type ClickHandler = (e: Event) => void;
```
### 🚀 Solution
Use the arrow function syntax for type aliases unless you need to define properties on the function itself (callable objects).

## 17. Catching `any` in try-catch
**Context:** Handling exceptions.
### ❌ Bad Practice
```typescript
try {
    doWork();
} catch (e) {
    console.error(e.message); // e is any by default
}
```
### ⚠️ Problem
In JavaScript, anything can be thrown (`throw "error"`). Accessing `.message` on a string or null will crash.
### ✅ Best Practice
```typescript
try {
    doWork();
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
    }
}
```
### 🚀 Solution
Always check the type of the caught error. In modern TS, use `useUnknownInCatchVariables: true` to force `e` to be `unknown`.

## 18. Literal types vs General types
**Context:** Narrowing strings/numbers to specific values.
### ❌ Bad Practice
```typescript
function setAlignment(dir: string) { ... }
```
### ⚠️ Problem
Accepting any `string` allows invalid inputs like `"center-left"` which the code won't handle.
### ✅ Best Practice
```typescript
type Direction = 'left' | 'right' | 'center';
function setAlignment(dir: Direction) { ... }
```
### 🚀 Solution
Use Union Literal types to restrict inputs to a known set of valid values.

## 19. Optional properties vs Union with `undefined`
**Context:** Defining fields that might not exist.
### ❌ Bad Practice
```typescript
interface Config {
    port: number | undefined;
}
```
### ⚠️ Problem
This requires the key `port` to be present, even if its value is `undefined`.
### ✅ Best Practice
```typescript
interface Config {
    port?: number;
}
```
### 🚀 Solution
Use `?` for properties that can be omitted entirely.

## 20. Array index access safety
**Context:** Accessing elements by index.
### ❌ Bad Practice
```typescript
const first = users[0];
console.log(first.id); // Potential crash if array is empty
```
### ⚠️ Problem
TypeScript assumes `users[0]` always exists if the array type is `User[]`.
### ✅ Best Practice
```typescript
const first = users[0];
if (first) {
    console.log(first.id);
}
```
### 🚀 Solution
Enable `noUncheckedIndexedAccess: true` in `tsconfig.json`. This forces index access to return `T | undefined`.

---
