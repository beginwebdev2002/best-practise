---
technology: Angular
domain: frontend
level: Senior/Architect
version: "20+"
tags: [angular, best-practices, clean-code, signals, components]
ai_role: Senior Angular Expert
last_updated: 2026-04-05
---

# 🧩 Components & Signals

[⬆️ Back to Top](./readme.md)

### 🚨 1. Using `@Input()` Decorator
> [!NOTE]
> **Context:** Component Inputs
### ❌ Bad Practice
```typescript
@Input() title: string = '';
```
### ⚠️ Problem
The `@Input()` decorator operates outside the Signals reactivity system. Changes are not tracked granularly, requiring checks of the entire component tree (Dirty Checking) via Zone.js.
### ✅ Best Practice
```typescript
title = input<string>('');
```

### Structural Comparison: Signals vs RxJS

| Feature | Signals (`signal`, `computed`) | RxJS (`BehaviorSubject`, `Observable`) |
| :--- | :--- | :--- |
| **Execution** | Synchronous | Asynchronous (typically) |
| **State Tracking** | Automatic (granular dependency tracking) | Manual (subscriptions required) |
| **Complexity** | Low (simple getter/setter) | High (complex operator chains) |
| **Best For** | Synchronous UI state | Asynchronous events, complex streams |

### 🚀 Solution
Use Signal Inputs (`input()`). This allows Angular to precisely know *which* specific component requires an update, paving the way for Zoneless applications.
---


### 🚨 2. Using `@Output()` Decorator
> [!NOTE]
> **Context:** Component Outputs
### ❌ Bad Practice
```typescript
@Output() save = new EventEmitter<void>();
```
### ⚠️ Problem
The classic `EventEmitter` adds an unnecessary layer of abstraction over RxJS Subject and does not integrate with the Angular functional API.
### ✅ Best Practice
```typescript
save = output<void>();
```
### 🚀 Solution
Use the `output()` function. It provides strict typing, better performance, and a unified API with Signal Inputs.
---


### 🚨 3. Two-Way Binding with `@Input()` and `@Output()`
> [!NOTE]
> **Context:** Model Synchronization
### ❌ Bad Practice
```typescript
@Input() value: string;
@Output() valueChange = new EventEmitter<string>();
```
### ⚠️ Problem
Boilerplate code that is easy to break if you make a mistake in naming the `Change` event.
### ✅ Best Practice
```typescript
value = model<string>();
```
### 🚀 Solution
> [!IMPORTANT]
> Use `model()`. This creates a Signal that MUST be both read and written to, automatically synchronizing its state with the parent.
---


### 🚨 4. Structural Directives (`*ngIf`, `*ngFor`)
> [!NOTE]
> **Context:** Template Control Flow
### ❌ Bad Practice
```html
<div *ngIf="isLoaded; else loading">
  <li *ngFor="let item of items">{{ item }}</li>
</div>
```
### ⚠️ Problem
Directives require importing `CommonModule` or `NgIf/NgFor`, increasing bundle size. Micro-template syntax is complex for static analysis and type-checking.
### ✅ Best Practice
```html
@if (isLoaded()) {
  @for (item of items(); track item.id) {
    <li>{{ item.name }}</li>
  }
} @else {
  <app-loader />
}
```
### 🚀 Solution
Use the built-in Control Flow (`@if`, `@for`). It is built into the compiler, requires no imports, supports improved type-narrowing, and runs faster.
---


### 🚨 5. Subscribing in Components (Logic in `ngOnInit`)
> [!NOTE]
> **Context:** Data Fetching
### ❌ Bad Practice
```typescript
data: unknown;
ngOnInit() {
  this.service.getData().subscribe(res => this.data = res);
}
```
### ⚠️ Problem
Imperative subscriptions lead to memory leaks (if you forget to `unsubscribe`), "Callback Hell", and state desynchronization. Requires manual subscription management.
### ✅ Best Practice
```typescript
data = toSignal(this.service.getData());
```
### 🚀 Solution
Use `toSignal()` to convert an Observable into a Signal. This automatically manages the subscription and integrates the data stream into the reactivity system.
---
