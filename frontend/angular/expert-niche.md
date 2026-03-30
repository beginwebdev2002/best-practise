---
technology: Angular
domain: frontend
level: Senior/Architect
version: "20"
tags: [expert, niche, angular, best-practices, clean-code, scalable-code]
ai_role: Senior Angular Expert
last_updated: 2026-03-22
---

# 🧠 Angular Expert/Niche Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Deep-dive into expert and niche topics in Angular.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20
## ⚡ V. Expert/Niche (56-60)
## ⚡ 56. `untracked()` usage
> [!NOTE]
> **Context:** Fine-grained Reactivity
### ❌ Bad Practice
Accidentally creating a cyclic dependency in `computed`.
### ⚠️ Problem
`Error: Detected cycle in computations`.
### ✅ Best Practice
```typescript
computed(() => {
  const user = this.user();
  untracked(() => this.logger.log(user)); // Logging doesn't create dependency
  return user.name;
});
```
### 🚀 Solution
Use `untracked()` for side effects or reads that shouldn't affect recalculation.
## ⚡ 57. V8 Hidden Classes Optimization
> [!NOTE]
> **Context:** Micro-optimization
### ❌ Bad Practice
```typescript
user = signal({});
// later
user.set({ name: 'A', age: 10 }); // Shape change
```
### ⚠️ Problem
Initializing with an empty object and later adding fields changes the object "shape" (Hidden Class), breaking V8 JIT compiler optimization.
### ✅ Best Practice
```typescript
interface User { name: string | null; age: number | null; }
user = signal<User>({ name: null, age: null });
```
### 🚀 Solution
Always initialize signals with the full object shape (even with null) to preserve property access monomorphism.
## ⚡ 58. Signal Glitch Freedom abuse
> [!NOTE]
> **Context:** Reactivity Theory
### ❌ Bad Practice
Relying on `effect` to fire synchronously.
### ⚠️ Problem
Signals guarantee "Glitch Freedom" (absence of intermediate inconsistent states), but effects are asynchronous (microtask timing).
### ✅ Best Practice
Do not use effects to synchronize local state. Use `computed`.


### 🚀 Solution
This approach provides a deterministic, type-safe implementation that is resilient and Agent-Readable, maintaining strict architectural boundaries.
## ⚡ 59. Memory leaks in `root` Effects
> [!NOTE]
> **Context:** Application Lifecycle
### ❌ Bad Practice
Creating an effect in a service without `manualCleanup`.
### ⚠️ Problem
Effects in `root` services live forever. If they subscribe to something global, it can leak.
### ✅ Best Practice
Usually fine, but if the service is destroyed (rare lazy loading case), the effect must be cleaned up with `effectRef.destroy()`.


### 🚀 Solution
This approach provides a deterministic, type-safe implementation that is resilient and Agent-Readable, maintaining strict architectural boundaries.
## 📖 60. `runInInjectionContext`
> [!NOTE]
> **Context:** Advanced DI
### ❌ Bad Practice
Passing an `Injector` instance manually into functions.
### ⚠️ Problem
Bulky code.
### ✅ Best Practice
```typescript
runInInjectionContext(this.injector, () => {
  // can use inject() here dynamically
  const service = inject(MyService);
});
```
### 🚀 Solution
Use this helper to execute functions requiring a DI context outside the constructor/initialization.
