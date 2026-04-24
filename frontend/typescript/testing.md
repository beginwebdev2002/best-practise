---
technology: TypeScript
domain: frontend
level: Senior/Architect
version: "5.5+"
tags: [typescript, testing, best-practices, deterministic-code, type-safety, vibe-coding]
ai_role: Senior TypeScript Testing Expert
last_updated: 2026-04-05
---

# 🧪 TypeScript Testing Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict type safety and architectural constraints in testing environments.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** TypeScript 5.5+

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Never** use `any` in test mocks or assertions.
> - **Always** leverage TypeScript's utility types to construct precise mocks.

---

## 🚀 I. Mocking and Stubs

### 🚨 1. Bypassing Type Safety with `any`
> [!NOTE]
> **Context:** Creating mock objects for dependencies during unit testing.
### ❌ Bad Practice
```typescript
const mockUserService: any = {
  getUser: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' })
};
// If UserService changes, this mock will silently pass but break in production.
```
### ⚠️ Problem
Using `any` completely disables the compiler's safety checks. When interfaces evolve, tests using `any` will yield false positives, failing to protect the application from regressions.
### ✅ Best Practice
```typescript
import { mock } from 'jest-mock-extended';
import { UserService } from './user.service';

const mockUserService = mock<UserService>();
mockUserService.getUser.mockResolvedValue({ id: 1, name: 'Alice', email: 'alice@test.com' });
```
### 🚀 Solution
Use deep mocking libraries (like `jest-mock-extended`) or precisely type your stubs using `Partial<T>` and strictly typecast with `as unknown as T` if absolutely necessary, to ensure mocks structurally match the actual interface.

---

## 🏗 II. Assertions

### 🚨 2. Loose Type Assertions
> [!NOTE]
> **Context:** Validating returned data structures in test cases.
### ❌ Bad Practice
```typescript
test('returns user', async () => {
  const result = await fetchUser();
  expect(result).toBeDefined();
  expect((result as any).name).toBe('Alice');
});
```
### ⚠️ Problem
Casting to `any` within an assertion defeats the purpose of testing the contract. It masks underlying type changes and reduces confidence in the test suite.
### ✅ Best Practice
```typescript
test('returns user', async () => {
  const result = await fetchUser();

  // Define a type guard or explicitly type the expected response
  type UserResponse = { id: number; name: string };

  expect(result).toBeDefined();
  expect((result as UserResponse).name).toBe('Alice');
});
```
### 🚀 Solution
Leverage strict typing within assertions. Define the expected types or rely on inferred return types to guarantee that the shape of the data matches the expected contract seamlessly.

---
[⬆️ Back to Top](#)
