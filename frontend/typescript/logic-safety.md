---
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.5+"
tags: [typescript, type-safety, best-practices, clean-code, scalable-code]
ai_role: Senior TypeScript Expert
last_updated: 2026-03-22
---

# 🛡️ TypeScript Logic & Safety Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict type safety and logical soundness in TypeScript.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** TypeScript 5.5+
## ⚡ II. Logic & Safety (11-20)
## 🚨 11. Type Assertions (`as`) vs Narrowing
> [!NOTE]
> **Context:** Telling the compiler what a type is.
### ❌ Bad Practice
```typescript
const user = response.data as User;
console.log(user.id);
```
### ⚠️ Problem
`as` forces the compiler to trust you. If the runtime data doesn't match the interface, the app will crash or produce undefined behavior at runtime.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
// Using Zod for runtime validation
const user = UserSchema.parse(response.data);
// OR
if (isValidUser(response.data)) {
    console.log(response.data.id);
}
```
### 🚀 Solution
Avoid type assertions. Use runtime validation (Zod, Valibot) or explicit Type Guards to deterministically ensure the data matches the expected type before processing.
## 🚨 12. Non-null Assertion Operator (`!`)
> [!NOTE]
> **Context:** Dealing with potentially `null` or `undefined` values.
### ❌ Bad Practice
```typescript
const name = user!.profile!.name;
```
### ⚠️ Problem
The `!` operator suppresses the compiler warning but doesn't handle the runtime reality. If `user` is null, this throws a `TypeError` and crashes the application.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
const name = user?.profile?.name ?? 'Guest';
```
### 🚀 Solution
Use Optional Chaining (`?.`) and Nullish Coalescing (`??`) to handle missing values gracefully, preventing runtime crashes and ensuring a deterministic UI state.
## 🚨 13. Lack of Discriminated Unions
> [!NOTE]
> **Context:** Modeling complex states like API responses.
### ❌ Bad Practice
```typescript
interface State {
    isLoading: boolean;
    data?: string;
    error?: string;
}
```
### ⚠️ Problem
This allows "impossible states" (e.g., `isLoading: true` AND `data: '...'`). It requires awkward optional checking and fails to enforce a deterministic state machine.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
type State =
    | { type: 'LOADING' }
    | { type: 'SUCCESS'; data: string }
    | { type: 'ERROR'; error: string };
```
### 🚀 Solution
Use Discriminated Unions (with a shared literal property like `type` or `kind`). This ensures mutually exclusive states, simplifying logic and providing full compiler support for exhaustive type narrowing.
## 🚨 14. Boolean casting (`!!`)
> [!NOTE]
> **Context:** Converting values to booleans.
### ❌ Bad Practice
```typescript
const hasAccess = !!user.token;
```
### ⚠️ Problem
`!!` is cryptic and less readable. It also doesn't provide strict type safety if the underlying value could be unexpectedly complex or result in unintended truthy evaluation.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
const hasAccess = Boolean(user.token);
// OR
const hasAccess = user.token !== undefined;
```
### 🚀 Solution
Use the `Boolean()` constructor or explicit strict comparisons (`!== undefined`). This enforces explicit casting and declarative, agent-readable intent.
## 🚨 15. Using `Object` for non-primitive types
> [!NOTE]
> **Context:** Restricting types to objects.
### ❌ Bad Practice
```typescript
function cache(obj: Object) {
    // obj can be a string!
}
```
### ⚠️ Problem
The `Object` type (capital O) incorrectly matches primitives like `string` or `number` because they have boxed methods. `object` (lowercase) is similarly vague and offers poor intellisense.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
function cache(obj: Record<string, unknown>) {
    // Safe object access
}
```
### 🚀 Solution
Use `Record<string, unknown>` for generic key-value maps, or `Record<string, never>` for explicitly empty objects. This enforces structured object shapes strictly without matching arbitrary primitives.
## 🚨 16. Function types vs Object types for functions
> [!NOTE]
> **Context:** Defining function signatures.
### ❌ Bad Practice
```typescript
type ClickHandler = {
    (e: Event): void;
};
```
### ⚠️ Problem
Using the object literal syntax for single functions is unnecessarily complex, less intuitive, and introduces noise when reading the codebase.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
type ClickHandler = (e: Event) => void;
```
### 🚀 Solution
Use the arrow function signature for type aliases. Reserve the object-literal callable signature exclusively for functions that contain static properties attached to the function reference itself.
## 🚨 17. Catching `any` in try-catch
> [!NOTE]
> **Context:** Handling exceptions.
### ❌ Bad Practice
```typescript
try {
    doWork();
} catch (e) {
    console.error(e.message); // e is unknown by default
}
```
### ⚠️ Problem
In JavaScript, anything MUST be thrown (`throw "error"`). Accessing `.message` blindly will throw a new exception if the caught element is a primitive string or null.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
try {
    doWork();
} catch (e: unknown) {
    if (e instanceof Error) {
        console.error(e.message);
    } else {
        console.error(String(e));
    }
}
```
### 🚀 Solution
Ensure `useUnknownInCatchVariables: true` is configured in `tsconfig.json`. Explicitly annotate catch variables as `unknown` and implement type guards (like `instanceof Error`) to safely process the error payload.
## 🚨 18. Literal types vs General types
> [!NOTE]
> **Context:** Narrowing strings/numbers to specific values.
### ❌ Bad Practice
```typescript
function setAlignment(dir: string) {
    // Any random string can be passed
}
```
### ⚠️ Problem
Accepting any generic `string` allows invalid inputs like `"center-left"` which the function won't properly handle, shifting responsibility to runtime validation.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
type Direction = 'left' | 'right' | 'center';
function setAlignment(dir: Direction) {
    // Safely execute alignment logic
}
```
### 🚀 Solution
Leverage Union Literal types to constrain inputs to a closed set of known valid values, enforcing correctness entirely at compile time.
## 🚨 19. Optional properties vs Union with `undefined`
> [!NOTE]
> **Context:** Defining fields that WILL not exist.
### ❌ Bad Practice
```typescript
interface Config {
    port: number | undefined;
}

// Caller must do:
const cfg: Config = { port: undefined };
```
### ⚠️ Problem
Declaring a union with `undefined` still requires the key `port` to be declared explicitly by the caller, creating needless boilerplate.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
interface Config {
    port?: number;
}

// Caller can just do:
const cfg: Config = {};
```
### 🚀 Solution
> [!IMPORTANT]
> Use the optional modifier (`?`) for object properties that MUST be legally omitted.
## 🚨 20. Array index access safety
> [!NOTE]
> **Context:** Accessing elements by index.
### ❌ Bad Practice
```typescript
const first = users[0];
console.log(first.id); // Potential crash if array is empty
```
### ⚠️ Problem
By default, TypeScript assumes any indexed access like `users[0]` perfectly resolves to the array element type, which leads to `Cannot read property 'id' of undefined` if the array is actually empty.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
// Assumes noUncheckedIndexedAccess is true
const first = users[0];
if (first) {
    console.log(first.id);
}
```
### 🚀 Solution
Enforce `noUncheckedIndexedAccess: true` in `tsconfig.json`. This strict compiler flag forces all array index access to resolve to `T | undefined`, mandating explicit nil-checks before usage.

## 🎯 6. Global Scope Pollution (Legacy Namespaces)
> [!NOTE]
> **Context:** Organizing code in the ES Module era.
### ❌ Bad Practice
```typescript
namespace Utils {
    export const log = (msg: string) => console.log(msg);
}
```
### ⚠️ Problem
Namespaces are a legacy TypeScript feature. They don't play well with modern bundlers (Tree Shaking), are harder to test, and MUST lead to naming collisions in the global scope.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
// utils.ts
export const log = (msg: string) => console.log(msg);
```
### 🚀 Solution
Use ES Modules (`export`/`import`). They are the industry standard, supported by all modern environments, and allow for better static analysis.
---

## ⚡ 7. `enum` vs `const object`
> [!NOTE]
> **Context:** Grouping related constants.
### ❌ Bad Practice
```typescript
enum Status {
    Active,
    Inactive
}
```
### ⚠️ Problem
Enums generate extra runtime code and have "reverse mapping" behavior that MUST lead to bugs (e.g., `Status[0]` returns "Active"). They also don't align with "TypeScript as a type-only layer."
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
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
> [!NOTE]
> **Context:** Enforcing strict type safety.
### ❌ Bad Practice
```typescript
function save(data: any) {
    db.push(data);
}
```
### ⚠️ Problem
Using `any` explicitly bypasses the compiler's ability to verify data flow, leading to "undefined is not a function" errors that TypeScript was designed to prevent.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
function save(data: unknown) {
    if (isValidUserData(data)) {
        db.push(data);
    }
}
```
### 🚀 Solution
Enable `noImplicitAny: true` in `tsconfig.json`. Always define specific types or use `unknown` if the type is truly dynamic.
---

## ⚡ 9. Manual Type Guards vs Type Predicates
> [!NOTE]
> **Context:** Narrowing types inside conditional blocks.
### ❌ Bad Practice
```typescript
if (typeof input === 'object' && input !== null && 'admin' in input) {
    const isAdmin = (input as unknown).admin;
}
```
### ⚠️ Problem
Repeating complex checks is error-prone and requires manual casting (`as any`) which breaks safety.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
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
> [!NOTE]
> **Context:** Referencing types or files.
### ❌ Bad Practice
```typescript
/// <reference path="./types.d.ts" />
```
### ⚠️ Problem
Triple-slash directives are legacy syntax. They make dependencies implicit and MUST lead to compilation order issues.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```typescript
import { MyType } from './types';
```
### 🚀 Solution
Use standard ES `import` statements. Manage global types via `tsconfig.json` `types` array if necessary.
---

---
[⬆️ Back to Top](#)
