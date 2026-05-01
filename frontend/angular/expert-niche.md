---
technology: Angular
domain: frontend
level: Senior/Architect
version: 20+
tags: [expert, niche, angular, best-practices, clean-code, scalable-code]
ai_role: Senior Angular Expert
last_updated: 2026-05-01
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
```typescript
count = signal(0);
doubleCount = signal(0);

constructor() {
  effect(() => {
    this.doubleCount.set(this.count() * 2);
  });
}
```
### ⚠️ Problem
Using `effect` to derive or synchronize local state is an anti-pattern. Effects are asynchronous (microtask timing), which means the state can momentarily be inconsistent ("glitch") before the effect runs, leading to UI flicker or bugs.
### ✅ Best Practice
```typescript
count = signal(0);
doubleCount = computed(() => this.count() * 2);
```
### 🚀 Solution
Use `computed` for derived state. Computed signals evaluate lazily and synchronously when read, ensuring true Glitch Freedom and eliminating unnecessary change detection cycles.
## ⚡ 59. Memory leaks in `root` Effects
> [!NOTE]
> **Context:** Application Lifecycle
### ❌ Bad Practice
```typescript
@Injectable({ providedIn: 'root' })
export class GlobalService {
  constructor() {
    effect(() => {
      // Listens to global events indefinitely
      console.log('State changed', this.state());
    });
  }
}
```
### ⚠️ Problem
Effects created in `root` services live for the entire lifecycle of the application. If the service relies on dynamic instantiation or lazy loading and is later destroyed, the effect will continue to execute, causing memory leaks and unexpected behavior.
### ✅ Best Practice
```typescript
@Injectable({ providedIn: 'root' })
export class GlobalService implements OnDestroy {
  private effectRef = effect(() => {
    console.log('State changed', this.state());
  }, { manualCleanup: true });

  ngOnDestroy() {
    this.effectRef.destroy();
  }
}
```
### 🚀 Solution
When creating effects in long-lived or dynamic services, explicitly configure them with `{ manualCleanup: true }` and destroy the reference during the service's `ngOnDestroy` lifecycle hook. This ensures deterministic resource management.
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
