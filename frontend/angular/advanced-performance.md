---
description: Vibe coding guidelines and architectural constraints for Angular Advanced Performance within the frontend domain.
technology: Angular
domain: frontend
level: Senior/Architect
version: "20"
tags: [performance, advanced, angular, best-practices, clean-code, scalable-code]
ai_role: Senior Angular Performance Expert
last_updated: 2026-03-22
---

# 🚀 Angular Advanced Performance Best Practices & Expert Patterns

# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to advanced performance best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20

## III. Advanced Performance (31-45)

## 31. Eager Loading of Heavy Components
**Context:** Bundle Size
### ❌ Bad Practice
```html
<app-chart [data]="data" />
```
### ⚠️ Problem
A charting library (e.g., ECharts) loads immediately, blocking TTI (Time to Interactive), even if the chart is below the "fold".
### ✅ Best Practice
```html
@defer (on viewport) {
  <app-chart [data]="data" />
} @placeholder {
  <div>Loading chart...</div>
}
```
### 🚀 Solution
Use `@defer`. This defers component code loading until a trigger occurs (viewport, interaction, timer).

## 32. Heavy Computation in Main Thread
**Context:** Event Loop Blocking
### ❌ Bad Practice
Sorting an array of 100k elements directly in the component.
### ⚠️ Problem
Freezes the UI.
### ✅ Best Practice
Offload computations to a Web Worker.
### 🚀 Solution
Use Angular Web Workers. In v20, this is easily configured via the CLI.

## 33. Memory Leaks in `effect()`
**Context:** Signal Effects
### ❌ Bad Practice
```typescript
effect(() => {
  const timer = setInterval(() => ..., 1000);
  // No cleanup
});
```
### ⚠️ Problem
Effects restart when dependencies change. If you don't clean up timers/subscriptions inside an effect, they accumulate.
### ✅ Best Practice
```typescript
effect((onCleanup) => {
  const timer = setInterval(() => ..., 1000);
  onCleanup(() => clearInterval(timer));
});
```
### 🚀 Solution
Always use the `onCleanup` callback to release resources.

## 34. Excessive Change Detection with `NgZone.run()`
**Context:** Zone Integration
### ❌ Bad Practice
Wrapping third-party libraries in `ngZone.run()` unnecessarily.
### ⚠️ Problem
Forces redundant checks of the entire component tree.
### ✅ Best Practice
```typescript
ngZone.runOutsideAngular(() => {
  // Heavy chart rendering or canvas animation
});
```
### 🚀 Solution
Run frequent events (scroll, mousemove, animationFrame) *outside* the Angular zone. Update signals only when UI updates are required.

## 35. Signals equality check default
**Context:** Signal Performance
### ❌ Bad Practice
```typescript
data = signal({ id: 1 }, { equal: undefined }); // Default checks reference
```
### ⚠️ Problem
If you create a new object with the same data `{ id: 1 }`, the signal triggers an update, even though the data hasn't fundamentally changed.
### ✅ Best Practice
```typescript
import { isEqual } from 'lodash-es';
data = signal(obj, { equal: isEqual });
```
### 🚀 Solution
Use a custom comparison function for complex objects to avoid redundant re-renders.

## 36. Lacking `trackBy` in iterables
**Context:** Re-rendering Lists
### ❌ Bad Practice
```html
<li *ngFor="let item of items">{{ item }}</li>
```
### ⚠️ Problem
Without tracking, any array change leads to the recreation of all DOM nodes in the list. $O(n)$ DOM operations.
### ✅ Best Practice
```html
@for (item of items; track item.id)
```
### 🚀 Solution
Always use a unique key in `track`. This allows Angular to move DOM nodes instead of recreating them.

## 37. Recursive Template without Caching
**Context:** Tree Rendering
### ❌ Bad Practice
Recursive component call without `OnPush` and memoization.
### ⚠️ Problem
Exponential growth in change detection checks.
### ✅ Best Practice
Using the `Memoization` pattern or `computed()` to prepare the tree data structure.

## 38. Global Styles Leakage
**Context:** CSS Encapsulation
### ❌ Bad Practice
```css
/* global.css */
button { padding: 10px; }
```
### ⚠️ Problem
Global styles unpredictably affect components.
### ✅ Best Practice
Use `ViewEncapsulation.Emulated` (default) and specific selectors.
### 🚀 Solution
Keep styles locally within components.

## 39. Large Component Bundle
**Context:** Split Chunks
### ❌ Bad Practice
A single huge component of 3000 lines.
### ⚠️ Problem
Poor readability, rendering lazy loading of UI parts impossible.
### ✅ Best Practice
Decompose into "dumb" (UI) and "smart" components.
### 🚀 Solution
Break down the UI into small, reusable blocks.

## 40. Image Optimization Ignorance
**Context:** Core Web Vitals (LCP)
### ❌ Bad Practice
```html
<img src="large-hero.jpg" />
```
### ⚠️ Problem
The browser loads the full image, shifting the layout (CLS).
### ✅ Best Practice
```html
<img ngSrc="hero.jpg" width="800" height="600" priority />
```
### 🚀 Solution
Use the `NgOptimizedImage` directive. It automatically handles lazy loading, preconnect, and srcset.

## 41. Hydration Mismatch
**Context:** SSR / SSG
### ❌ Bad Practice
Rendering `Date.now()` or random numbers (`Math.random()`) directly in the template.
### ⚠️ Problem
The server generates one number, the client another. This causes "flickering" and a hydration error; Angular discards the server DOM and renders from scratch.
### ✅ Best Practice
Use stable data or defer random generation until `afterNextRender`.
### 🚀 Solution
Pay attention to template determinism with SSR.

## 42. Synchronous `inject()` inside loops
**Context:** DI Performance
### ❌ Bad Practice
Calling `inject()` inside a function that loops.
### ⚠️ Problem
Although `inject` is fast, in hot paths these are unnecessary DI tree lookups.
### ✅ Best Practice
Inject dependency once at the class/file constant level.

## 43. Unused Signal Dependencies
**Context:** Signal Graph
### ❌ Bad Practice
Reading a signal inside `computed` whose value doesn't affect the result (an unexecuted logical branch).
### ⚠️ Problem
Angular dynamically builds the dependency graph. If you accidentally read a signal, it becomes a dependency.
### ✅ Best Practice
Use `untracked()` to read signals whose changes should not trigger a recalculation.

## 44. Excessive Wrappers (`div` soup)
**Context:** DOM Size
### ❌ Bad Practice
```html
<div><div><div><app-comp></app-comp></div></div></div>
```
### ⚠️ Problem
Increases DOM tree depth, slowing down Style Recalculation and Layout.
### ✅ Best Practice
Use `<ng-container>` to group elements without creating extra DOM nodes.

## 45. Neglecting `runOutsideAngular` for Events
**Context:** High-frequency events
### ❌ Bad Practice
`@HostListener('window:scroll')`
### ⚠️ Problem
Every scroll event triggers Change Detection.
### ✅ Best Practice
Subscribe manually in `runOutsideAngular` and update the signal only when necessary.

---
