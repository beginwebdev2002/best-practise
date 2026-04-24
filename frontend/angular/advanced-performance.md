---
technology: Angular
domain: frontend
level: Senior/Architect
version: 20+
tags: [performance, advanced, angular, best-practices, clean-code, scalable-code]
ai_role: Senior Angular Performance Expert
last_updated: 2026-03-22
---

# 🚀 Angular Advanced Performance Best Practices & Expert Patterns

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Enforce strict adherence to advanced performance best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20
## ⚡ III. Advanced Performance (31-45)
## ⚡ 31. Eager Loading of Heavy Components
> [!NOTE]
> **Context:** Bundle Size
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

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Use `@defer`. This defers component code loading until a trigger occurs (viewport, interaction, timer).
## ⚡ 32. Heavy Computation in Main Thread
> [!NOTE]
> **Context:** Event Loop Blocking
### ❌ Bad Practice
Sorting an array of 100k elements directly in the component.
### ⚠️ Problem
Freezes the UI.
### ✅ Best Practice
Offload computations to a Web Worker.

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Use Angular Web Workers. In v20, this is easily configured via the CLI.
## ⚡ 33. Memory Leaks in `effect()`
> [!NOTE]
> **Context:** Signal Effects
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

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Always use the `onCleanup` callback to release resources.
## ⚡ 34. Excessive Change Detection with `NgZone.run()`
> [!NOTE]
> **Context:** Zone Integration
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

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Run frequent events (scroll, mousemove, animationFrame) *outside* the Angular zone. Update signals only when UI updates are required.
## ⚡ 35. Signals equality check default
> [!NOTE]
> **Context:** Signal Performance
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

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Use a custom comparison function for complex objects to avoid redundant re-renders.
## ⚡ 36. Lacking `trackBy` in iterables
> [!NOTE]
> **Context:** Re-rendering Lists
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

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Always use a unique key in `track`. This allows Angular to move DOM nodes instead of recreating them.
## ⚡ 37. Recursive Template without Caching
> [!NOTE]
> **Context:** Tree Rendering
### ❌ Bad Practice
```html
<ng-template #tree let-node>
  {{ node.name }}
  <ng-container *ngFor="let child of node.children">
    <ng-container *ngTemplateOutlet="tree; context: { $implicit: child }"></ng-container>
  </ng-container>
</ng-template>
<ng-container *ngTemplateOutlet="tree; context: { $implicit: root }"></ng-container>
```
### ⚠️ Problem
Recursive component calls without `OnPush` or memoization cause exponential growth in change detection checks, blocking the main thread during deep tree rendering.
### ✅ Best Practice
```typescript
@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    {{ node().name }}
    @for (child of node().children; track child.id) {
      <app-tree-node [node]="child" />
    }
  `
})
export class TreeNodeComponent {
  node = input.required<TreeNode>();
}
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Use standalone components with `ChangeDetectionStrategy.OnPush` and modern `@for` control flow for recursive structures. This ensures change detection only runs when inputs change, drastically improving performance for deeply nested trees.
## ⚡ 38. Global Styles Leakage
> [!NOTE]
> **Context:** CSS Encapsulation
### ❌ Bad Practice
```css
/* global.css */
button { padding: 10px; }
```
### ⚠️ Problem
Global styles unpredictably affect components.
### ✅ Best Practice
Use `ViewEncapsulation.Emulated` (default) and specific selectors.

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Keep styles locally within components.
## ⚡ 39. Large Component Bundle
> [!NOTE]
> **Context:** Split Chunks
### ❌ Bad Practice
A single huge component of 3000 lines.
### ⚠️ Problem
Poor readability, rendering lazy loading of UI parts impossible.
### ✅ Best Practice
Decompose into "dumb" (UI) and "smart" components.

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Break down the UI into small, reusable blocks.
## ⚡ 40. Image Optimization Ignorance
> [!NOTE]
> **Context:** Core Web Vitals (LCP)
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

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Use the `NgOptimizedImage` directive. It automatically handles lazy loading, preconnect, and srcset.
## ⚡ 41. Hydration Mismatch
> [!NOTE]
> **Context:** SSR / SSG
### ❌ Bad Practice
Rendering `Date.now()` or random numbers (`Math.random()`) directly in the template.
### ⚠️ Problem
The server generates one number, the client another. This causes "flickering" and a hydration error; Angular discards the server DOM and renders from scratch.
### ✅ Best Practice
Use stable data or defer random generation until `afterNextRender`.

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Pay attention to template determinism with SSR.
## ⚡ 42. Synchronous `inject()` inside loops
> [!NOTE]
> **Context:** DI Performance
### ❌ Bad Practice
```typescript
processItems(items: Item[]) {
  items.forEach(item => {
    const logger = inject(LoggerService);
    logger.log(item.name);
  });
}
```
### ⚠️ Problem
Although `inject()` is fast, calling it inside hot paths (loops) triggers unnecessary Dependency Injection tree lookups on every iteration, which degrades performance.
### ✅ Best Practice
```typescript
export class ItemProcessor {
  private logger = inject(LoggerService);

  processItems(items: Item[]) {
    items.forEach(item => {
      this.logger.log(item.name);
    });
  }
}
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Inject dependencies exactly once at the class or property level. This caches the reference to the service, bypassing redundant DI resolution and keeping hot paths efficient.
## ⚡ 43. Unused Signal Dependencies
> [!NOTE]
> **Context:** Signal Graph
### ❌ Bad Practice
```typescript
effect(() => {
  console.log('Value changed:', this.value());
  this.analytics.track('Change', this.user()?.id);
});
```
### ⚠️ Problem
Angular dynamically builds the signal graph. If you read a signal like `this.user()` inside an effect just for analytics, any change to `user()` will unexpectedly re-trigger the effect, leading to redundant executions.
### ✅ Best Practice
```typescript
effect(() => {
  const currentVal = this.value();
  untracked(() => {
    this.analytics.track('Change', this.user()?.id);
  });
  console.log('Value changed:', currentVal);
});
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
> [!IMPORTANT]
> Use `untracked()` to read signals that MUST not register as dependencies. This prevents unintended re-evaluations and ensures effects only run when their primary state changes.
## ⚡ 44. Excessive Wrappers (`div` soup)
> [!NOTE]
> **Context:** DOM Size
### ❌ Bad Practice
```html
<div *ngIf="isLoggedIn()">
  <div class="user-panel">
    <app-user-profile></app-user-profile>
  </div>
</div>
```
### ⚠️ Problem
Unnecessary wrapper `<div>` elements deeply nest the DOM tree ("div soup"). This exponentially slows down CSS Style Recalculation, Layout (Reflow), and Paint.
### ✅ Best Practice
```html
@if (isLoggedIn()) {
  <ng-container>
    <app-user-profile class="user-panel"></app-user-profile>
  </ng-container>
}
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Utilize `<ng-container>` to apply structural logic or apply classes directly to component hosts. `<ng-container>` is rendered as an invisible comment, keeping the DOM tree shallow and performant.
## ⚡ 45. Neglecting `runOutsideAngular` for Events
> [!NOTE]
> **Context:** High-frequency events
### ❌ Bad Practice
```typescript
@HostListener('window:scroll', ['$event'])
onScroll() {
  this.scrollPosition.set(window.scrollY);
}
```
### ⚠️ Problem
Every scroll, mousemove, or drag event triggers a full Angular Change Detection cycle. High-frequency events will cause immediate UI lag and frame drops.
### ✅ Best Practice
```typescript
export class ScrollTracker {
  private zone = inject(NgZone);
  scrollPosition = signal(0);

  constructor() {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - this.scrollPosition()) > 50) {
          this.zone.run(() => this.scrollPosition.set(window.scrollY));
        }
      });
    });
  }
}
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Angular Architecture](./readme.md).

### 🚀 Solution
Bind high-frequency events outside the Angular Zone using `NgZone.runOutsideAngular()`. Only re-enter the Angular Zone (`zone.run()`) when a threshold is met and a UI update is strictly required.
---
