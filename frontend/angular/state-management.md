---
description: Vibe coding guidelines and architectural constraints for Angular State Management, focusing on Zoneless reactivity, Signals, and modern functional APIs.
technology: Angular
domain: frontend
level: Senior/Architect
complexity: Advanced
topic: Angular State Management
vibe_coding_ready: true
last_evolution: 2026-03-28
version: "20"
tags: [state-management, signals, zoneless, angular, best-practices, clean-code, scalable-code]
ai_role: Senior Angular State Management Expert
---

> 📦 [best-practise](../../README.md) / 🖥️ [frontend](../readme.md) / 🅰️ [angular](./readme.md)

# 📦 Angular State Management: Zoneless Reactivity & Signals

# 📖 Context & Scope
- **Primary Goal:** Enforce strictly functional state management patterns using Angular 20's Zoneless architecture.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20+

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - Avoid RxJS `BehaviorSubject` for local and synchronous global component state.
> - Strictly use `signal()`, `computed()`, and `effect()` to manage all dynamic data states.
> - Never use the `@Input()` and `@Output()` decorators for sharing state across component trees; rely solely on functional `input()` and `output()`.

---

## 🏗 Architecture & Data Flow

State management in Angular 20 relies entirely on the granular reactivity provided by Signals. This architecture inherently supports Zoneless change detection by exactly tracking which views need updates without relying on `zone.js`.

```mermaid
graph TD
    Store[Signal Store / Global Service] -->|Signals| Comp1[Component A]
    Store -->|Signals| Comp2[Component B]
    Comp1 -->|input()| Child[Child Component]
    Comp2 -->|model()| Child2[Two-Way Child]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Store layout;
    class Comp1 component;
    class Comp2 component;
    class Child default;
    class Child2 default;
```

---

## 🚀 I. Local State Management

### 🚨 1. Managing Component State with Signals
**Context:** Synchronous local state.
#### ❌ Bad Practice
```typescript
isLoading: boolean = false;
data: any[] = [];

fetchData() {
  this.isLoading = true;
  this.api.get().subscribe(res => {
    this.data = res;
    this.isLoading = false;
  });
}
```
#### ⚠️ Problem
Relying on raw primitive properties means Angular relies on `zone.js` to run Change Detection globally whenever an event completes.
#### ✅ Best Practice
```typescript
isLoading = signal(false);
data = signal<Data[]>([]);

fetchData() {
  this.isLoading.set(true);
  this.api.get().subscribe(res => {
    this.data.set(res);
    this.isLoading.set(false);
  });
}
```
#### 🚀 Solution
Use `signal()`. It forces the developer to explicitly use `.set()` or `.update()`, signaling to the framework exactly when and where the change occurred.

---

## ⚙️ II. Derived State

### 🚨 2. Computing Values
**Context:** Creating derived state based on other state values.
#### ❌ Bad Practice
```typescript
items = signal([1, 2, 3]);
total = 0;

updateTotal() {
  this.total = this.items().reduce((a, b) => a + b, 0);
}
```
#### ⚠️ Problem
Manually syncing state variables is error-prone. If you update `items` but forget to call `updateTotal()`, the state becomes inconsistent.
#### ✅ Best Practice
```typescript
items = signal([1, 2, 3]);
total = computed(() => this.items().reduce((a, b) => a + b, 0));
```
#### 🚀 Solution
Use `computed()`. The calculated value is memoized and only re-evaluates when its specific signal dependencies (in this case, `items`) change.

---

## ⚡ III. Side Effects

### 🚨 3. Handling Side Effects Safely
**Context:** Executing logic when a signal changes.
#### ❌ Bad Practice
Using getters or Angular lifecycle hooks like `ngDoCheck` to monitor value changes and trigger side effects like logging or generic HTTP calls.
#### ⚠️ Problem
This causes severe performance degradation as the logic is run on every change detection cycle, regardless of whether the specific state actually changed.
#### ✅ Best Practice
```typescript
constructor() {
  effect(() => {
    console.log(`Current items count: ${this.items().length}`);
    // Effect will re-run automatically only when this.items() changes.
  });
}
```
#### 🚀 Solution
Use `effect()`. Effects track dependencies automatically and ensure the side effect runs solely when required. Always define them within an injection context (like a constructor).

---

## 🔗 IV. Component Communication

### 🚨 4. Modern Data Passing
**Context:** Passing data between parent and child components.
#### ❌ Bad Practice
```typescript
@Input() user: User;
@Output() userUpdate = new EventEmitter<User>();
```
#### ⚠️ Problem
Requires boilerplate, depends on decorators which are less ideal for dynamic composition, and heavily couples the components to legacy Zone-based tracking.
#### ✅ Best Practice
```typescript
// For one-way data flow
user = input.required<User>();

// For two-way data binding synchronization
userProfile = model<User>();
```
#### 🚀 Solution
Use the `input()` and `model()` functional APIs. They return signals that can be directly used in `computed()` properties within the child component.

---

[⬆️ Back to Top](#)
