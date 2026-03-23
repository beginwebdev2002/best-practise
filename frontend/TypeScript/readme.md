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

# TypeScript Best Practise

![TypeScript Logo](https://img.icons8.com/?size=100&id=uJM6fQYqDaZK&format=png&color=000000)

## I. Fundamentals (1-10)

## 1. `any` vs `unknown`
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

## 2. `null` vs `undefined` in APIs
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

## 3. `Array<T>` vs `T[]`
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

## 4. `interface` vs `type`
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

## 5. Function Overloads vs Union Types
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

## 6. Global Scope Pollution (Legacy Namespaces)
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

## 7. `enum` vs `const object`
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

## 8. Explicit `any` in Parameters
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

## 9. Manual Type Guards vs Type Predicates
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

## 10. Triple-Slash Directives
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
