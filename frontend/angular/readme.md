---
description: Vibe coding guidelines and architectural constraints for Angular within the frontend domain.
technology: Angular
domain: frontend
level: Senior/Architect
version: "20"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Angular Performance Expert
last_updated: 2026-03-22
---

# Angular Best Practices & Production-Ready Patterns

# Context & Scope
- **Primary Goal:** Enforce strict adherence to modern Angular v20 patterns, specifically Zoneless reactivity and functional APIs for optimal best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** use `signal()`, `computed()`, and `effect()` instead of RxJS `BehaviorSubject` for local state.
> - **Never** use `@Input()` or `@Output()` decorators; strictly use `input()` and `output()` functional APIs.
> - **Always** utilize the built-in control flow (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`).

## I. Basics & Popular (1-15)

## 1. Using `@Input()` Decorator
**Context:** Component Inputs
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
### 🚀 Solution
Use Signal Inputs (`input()`). This allows Angular to precisely know *which* specific component requires an update, paving the way for Zoneless applications.

## 2. Using `@Output()` Decorator
**Context:** Component Outputs
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

## 3. Two-Way Binding with `@Input()` and `@Output()`
**Context:** Model Synchronization
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
Use `model()`. This creates a Signal that can be both read and written to, automatically synchronizing its state with the parent.

## 4. Structural Directives (`*ngIf`, `*ngFor`)
**Context:** Template Control Flow
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

## 5. Subscribing in Components (Logic in `ngOnInit`)
**Context:** Data Fetching
### ❌ Bad Practice
```typescript
data: any;
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

## 6. `BehaviorSubject` for Local State
**Context:** Component State Management
### ❌ Bad Practice
```typescript
private count$ = new BehaviorSubject(0);
getCount() { return this.count$.value; }
```
### ⚠️ Problem
RxJS is overkill for simple synchronous state. `BehaviorSubject` requires `.value` for access and `.next()` for writes, increasing cognitive load.
### ✅ Best Practice
```typescript
count = signal(0);
// Access: count()
// Update: count.set(1)
```
### 🚀 Solution
Use `signal()` for local state. It is a primitive designed specifically for synchronizing UI and data.

## 7. Derived State with `ngOnChanges`
**Context:** Reactivity
### ❌ Bad Practice
```typescript
ngOnChanges(changes: SimpleChanges) {
  if (changes['firstName']) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
```
### ⚠️ Problem
`ngOnChanges` is triggered only when Inputs change, has complex typing, and runs before View initialization.
### ✅ Best Practice
```typescript
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```
### 🚀 Solution
Use `computed()`. The signal is recalculated *only* when its dependencies change, and the result is memoized (cached).

## 8. Constructor Dependency Injection
**Context:** DI Pattern
### ❌ Bad Practice
```typescript
constructor(private http: HttpClient, private store: Store) {}
```
### ⚠️ Problem
Constructors become cluttered with many dependencies. When inheriting classes, dependencies must be passed through `super()`.
### ✅ Best Practice
```typescript
private http = inject(HttpClient);
private store = inject(Store);
```
### 🚀 Solution
Use the `inject()` function. It operates in the initialization context (fields or constructor), is type-safe, and does not require `super()` during inheritance.

## 9. Modules (`NgModule`)
**Context:** App Architecture
### ❌ Bad Practice
```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule]
})
export class AppModule {}
```
### ⚠️ Problem
Modules create an unnecessary level of indirection. Components become dependent on the module context, complicating Lazy Loading and testing.
### ✅ Best Practice
```typescript
@Component({
  standalone: true,
  imports: [CommonModule]
})
```
### 🚀 Solution
Use Standalone Components. This is the Angular v14+ standard that makes components self-sufficient and tree-shakable.

## 10. String-based Route Loading
**Context:** Lazy Loading Routing
### ❌ Bad Practice
```typescript
loadChildren: () => import('./module').then(m => m.UserModule)
```
### ⚠️ Problem
Loading modules pulls in transitive dependencies that might not be needed.
### ✅ Best Practice
```typescript
loadComponent: () => import('./user.component').then(c => c.UserComponent)
```
### 🚀 Solution
Use `loadComponent` for routing to Standalone components. This ensures minimal chunk size.

## 11. Heavy Logic in Templates
**Context:** Template Performance
### ❌ Bad Practice
```html
<div>{{ calculateTotal(items) }}</div>
```
### ⚠️ Problem
The `calculateTotal` function is called during *every* Change Detection (CD) cycle, even if `items` have not changed. This kills UI performance.
### ✅ Best Practice
```typescript
total = computed(() => this.calculateTotal(this.items()));
```
```html
<div>{{ total() }}</div>
```
### 🚀 Solution
Extract logic into `computed()` signals or Pure Pipes. They are only executed when input data changes.

## 12. Manual Subscription Management (`takeUntil`)
**Context:** RxJS Memory Leaks
### ❌ Bad Practice
```typescript
destroy$ = new Subject<void>();
ngOnDestroy() { this.destroy$.next(); }
stream$.pipe(takeUntil(this.destroy$)).subscribe();
```
### ⚠️ Problem
It's easy to forget `takeUntil` or `unsubscribe`. Requires a lot of boilerplate code in every component.
### ✅ Best Practice
```typescript
stream$.pipe(takeUntilDestroyed()).subscribe();
```
### 🚀 Solution
Use the `takeUntilDestroyed()` operator. It automatically unsubscribes upon context destruction (component, directive, service).

## 13. Deeply Nested Components Passing Data
**Context:** Prop Drilling
### ❌ Bad Practice
```html
<!-- Parent -->
<app-child [theme]="theme"></app-child>
<!-- Child -->
<app-grandchild [theme]="theme"></app-grandchild>
```
### ⚠️ Problem
"Prop drilling" heavily couples intermediate components to data they don't need, just for the sake of passing it deeper.
### ✅ Best Practice
```typescript
// Service
theme = signal('dark');
// Grandchild
theme = inject(ThemeService).theme;
```
### 🚀 Solution
Use Signal Stores or services for state sharing, or the new `input()` API with context inheritance (in the future).

## 14. Accessing DOM directly (`ElementRef.nativeElement`)
**Context:** Security & Abstraction
### ❌ Bad Practice
```typescript
el.nativeElement.style.backgroundColor = 'red';
```
### ⚠️ Problem
Direct DOM access breaks abstraction (doesn't work in SSR/Web Workers) and opens up XSS vulnerabilities. It bypasses Angular Sanitization mechanisms.
### ✅ Best Practice
```typescript
// Use Renderer2 or bindings
<div [style.background-color]="color()"></div>
```
### 🚀 Solution
Use style/class bindings or `Renderer2`. For direct manipulations, consider directives.

## 15. Zone.js overhead
**Context:** Change Detection
### ❌ Bad Practice
The application relies on Zone.js for any asynchronous event (setTimeout, Promise, XHR).
### ⚠️ Problem
Zone.js patches all browser APIs, adding overhead and increasing bundle size. CD triggers more often than necessary.
### ✅ Best Practice
```typescript
bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()]
});
```
### 🚀 Solution
Migrate to Zoneless mode. Use Signals to notify Angular when a re-render is needed.

---

## II. Architecture & DI (16-30)

## 16. Services provided in 'root' vs Modules
**Context:** Tree Shaking
### ❌ Bad Practice
```typescript
@NgModule({ providers: [MyService] })
```
### ⚠️ Problem
The service is included in the bundle even if it is not used.
### ✅ Best Practice
```typescript
@Injectable({ providedIn: 'root' })
```
### 🚀 Solution
Always use `providedIn: 'root'`. This allows the bundler to remove unused services (Tree Shaking).

## 17. Class-based Guards
**Context:** Routing Security
### ❌ Bad Practice
```typescript
@Injectable()
export class AuthGuard implements CanActivate { ... }
```
### ⚠️ Problem
Class-based guards require more code and injections. They are less flexible for composition.
### ✅ Best Practice
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isLoggedIn();
};
```
### 🚀 Solution
Use functional Guards (`CanActivateFn`). They are concise, easy to test, and composable.

## 18. Class-based Interceptors
**Context:** HTTP Requests
### ❌ Bad Practice
```typescript
@Injectable()
export class TokenInterceptor implements HttpInterceptor { ... }
```
### ⚠️ Problem
Similar to guards: lots of boilerplate, complex registration in the providers array.
### ✅ Best Practice
```typescript
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(req.clone({ setHeaders: { Authorization: token } }));
};
```
### 🚀 Solution
Use functional Interceptors (`HttpInterceptorFn`) with `provideHttpClient(withInterceptors([...]))`.

## 19. State Mutation in Services
**Context:** Data Integrity
### ❌ Bad Practice
```typescript
updateUser(user: User) {
  this.currentUser = user; // Mutable assignment
}
```
### ⚠️ Problem
Object mutations complicate change tracking and can lead to unpredictable behavior in components using the `OnPush` strategy.
### ✅ Best Practice
```typescript
currentUser = signal<User | null>(null);
updateUser(user: User) {
  this.currentUser.set({ ...user }); // Immutable update
}
```
### 🚀 Solution
Use Signals for state management. They guarantee reactivity and atomicity of updates.

## 20. Calling functions inside `@for` tracking
**Context:** Rendering Performance
### ❌ Bad Practice
```html
@for (item of items; track getItemId(item))
```
### ⚠️ Problem
The tracking function is called for each element during every re-render.
### ✅ Best Practice
```html
@for (item of items; track item.id)
```
### 🚀 Solution
Use an object property (ID or a unique key) directly. If a function is needed, it must be as simple and pure as possible.

## 21. `host` property vs `@HostListener`
**Context:** Component Metadata
### ❌ Bad Practice
```typescript
@HostListener('click') onClick() { ... }
@HostBinding('class.active') isActive = true;
```
### ⚠️ Problem
Decorators increase class size and scatter host configuration across the file.
### ✅ Best Practice
```typescript
@Component({
  host: {
    '(click)': 'onClick()',
    '[class.active]': 'isActive()'
  }
})
```
### 🚀 Solution
Use the `host` property in component metadata. This centralizes all host element settings.

## 22. Dynamic Components with `ComponentFactoryResolver`
**Context:** Dynamic Rendering
### ❌ Bad Practice
```typescript
const factory = this.resolver.resolveComponentFactory(MyComponent);
this.container.createComponent(factory);
```
### ⚠️ Problem
`ComponentFactoryResolver` is deprecated. It is an old imperative API.
### ✅ Best Practice
```typescript
this.container.createComponent(MyComponent);
// Or strictly in template
<ng-container *ngComponentOutlet="componentSignal()" />
```
### 🚀 Solution
Use `ViewContainerRef.createComponent` directly with the component class or the `ngComponentOutlet` directive.

## 23. Shared Modules (The "Dump" Module)
**Context:** Modular Architecture
### ❌ Bad Practice
`SharedModule` imports and exports *all* UI components, pipes, and directives.
### ⚠️ Problem
If a component needs a single button, it is forced to pull the entire `SharedModule`. This breaks Tree Shaking and increases the initial bundle size.
### ✅ Best Practice
Import only what is needed directly into the `imports` of the Standalone component.
### 🚀 Solution
Abandon `SharedModule` in favor of granular imports of Standalone entities.

## 24. Circular Dependencies in DI
**Context:** Architecture
### ❌ Bad Practice
Service A injects Service B, which injects Service A.
### ⚠️ Problem
Leads to runtime errors ("Cannot instantiate cyclic dependency"). Indicates poor architectural design.
### ✅ Best Practice
Use `forwardRef()` as a crutch, but it's better to extract the shared logic into a third Service C.
### 🚀 Solution
Refactoring: break services into smaller ones following SRP (Single Responsibility Principle).

## 25. Logic in Pipes
**Context:** Separation of Concerns
### ❌ Bad Practice
A Pipe performs HTTP requests or complex business logic.
### ⚠️ Problem
Pipes are intended for data transformation in the template. Side effects in pipes violate function purity and kill CD performance.
### ✅ Best Practice
Pipes should be "Pure" (without side effects) and fast.
### 🚀 Solution
Extract logic into services/signals. Leave only formatting to pipes.

## 26. `any` in Services
**Context:** TypeScript Safety
### ❌ Bad Practice
```typescript
getData(): Observable<any> { ... }
```
### ⚠️ Problem
`any` disables type checking, nullifying the benefits of TypeScript. Errors only surface at runtime.
### ✅ Best Practice
```typescript
getData(): Observable<UserDto> { ... }
```
### 🚀 Solution
Use DTO interfaces (generate them from Swagger/OpenAPI) and Zod for API response validation.

## 27. Multiple `async` pipes for same stream
**Context:** RxJS Subscriptions
### ❌ Bad Practice
```html
<div *ngIf="user$ | async as user">{{ (user$ | async).name }}</div>
```
### ⚠️ Problem
Each `async` pipe creates a new subscription. This can lead to duplicated HTTP requests.
### ✅ Best Practice
```html
@if (user$ | async; as user) {
  <div>{{ user.name }}</div>
}
```
### 🚀 Solution
Use aliases in the template (`as varName`) or convert the stream to a signal (`toSignal`).

## 28. ProvidedIn 'any'
**Context:** DI Scopes
### ❌ Bad Practice
```typescript
@Injectable({ providedIn: 'any' })
```
### ⚠️ Problem
Creates a new service instance for each lazy-loaded module. This is often unexpected behavior, leading to state desynchronization (different singleton instances).
### ✅ Best Practice
`providedIn: 'root'` or providing at the level of a specific component (`providers: []`).
### 🚀 Solution
Avoid `any`. Explicitly control the scope: either global (`root`) or local.

## 29. Imperative Routing
**Context:** Navigation
### ❌ Bad Practice
```typescript
this.router.navigateByUrl('/users/' + id);
```
### ⚠️ Problem
Hardcoding route strings makes route refactoring a pain.
### ✅ Best Practice
```typescript
this.router.navigate(['users', id]);
```
### 🚀 Solution
Use an array of segments. It is safer (automatic encoding of URL parameters) and cleaner.

## 30. Ignoring `OnPush` Strategy
**Context:** Change Detection Strategy
### ❌ Bad Practice
Default components (`ChangeDetectionStrategy.Default`).
### ⚠️ Problem
Angular checks this component on *every* app event, even if the component data hasn't changed.
### ✅ Best Practice
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```
### 🚀 Solution
Always set `OnPush`. With signals, this becomes the de facto standard, as updates occur precisely.

---

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

## IV. Data & Forms (46-55)

## 46. Template-Driven Forms without Types
**Context:** Form Safety
### ❌ Bad Practice
`[(ngModel)]` without strict model typing.
### ⚠️ Problem
Risk of assigning a string to a numeric field.
### ✅ Best Practice
Use Reactive Forms with `FormControl<string>` typing or new Signal-based Forms (when out of developer preview).

## 47. Untyped `FormGroup`
**Context:** Reactive Forms
### ❌ Bad Practice
```typescript
const form = new FormGroup({ ... }); // Untyped
```
### ⚠️ Problem
`form.value` returns `any`.
### ✅ Best Practice
```typescript
const form = new FormGroup<LoginForm>({
  email: new FormControl('', { nonNullable: true }),
  ...
});
```
### 🚀 Solution
Always type forms. Use `nonNullable: true` to avoid `string | undefined` hell.

## 48. Subscribe inside Subscribe
**Context:** RxJS Patterns
### ❌ Bad Practice
```typescript
this.route.params.subscribe(params => {
  this.api.getUser(params.id).subscribe(user => ...);
});
```
### ⚠️ Problem
Classic Race Condition. If parameters change rapidly, response order is not guaranteed.
### ✅ Best Practice
```typescript
this.route.params.pipe(
  switchMap(params => this.api.getUser(params.id))
).subscribe();
```
### 🚀 Solution
Use Flattening Operators (`switchMap`, `concatMap`, `mergeMap`).

## 49. Ignoring `AbortSignal` in HTTP
**Context:** Network Efficiency
### ❌ Bad Practice
Ignoring request cancellation when navigating away from the page.
### ⚠️ Problem
Requests continue hanging, consuming traffic.
### ✅ Best Practice
HttpClient automatically supports cancellation upon unsubscription. With signals: ensure `rxResource` or the effect correctly cancels the request.

## 50. Mutating Inputs directly
**Context:** Unidirectional Data Flow
### ❌ Bad Practice
```typescript
this.inputData.push(newItem);
```
### ⚠️ Problem
The parent component remains unaware of the change. Violates the One-Way Data Flow principle.
### ✅ Best Practice
Emit event (`output`) upwards; the parent changes the data and passes the new object downwards.

## 51. `ngModel` inside Reactive Form
**Context:** Form Mixing
### ❌ Bad Practice
Using `formControlName` and `[(ngModel)]` on the same input.
### ⚠️ Problem
Deprecated behavior. Causes form and model synchronization conflicts.
### ✅ Best Practice
Use only one approach: either Reactive or Template-driven.

## 52. Complex Validators in Template
**Context:** Form Logic
### ❌ Bad Practice
Validation via HTML attributes for complex logic.
### ⚠️ Problem
Hard to test, no reusability.
### ✅ Best Practice
Custom Validator Functions or Async Validators in the component class.

## 53. Forgetting `updateOn: 'blur'`
**Context:** Performance
### ❌ Bad Practice
Validating a complex field on every keystroke (`change`).
### ⚠️ Problem
Slows down user input.
### ✅ Best Practice
```typescript
new FormControl('', { updateOn: 'blur' });
```
### 🚀 Solution
Trigger validation/update only when the user has finished typing.

## 54. Not handling API Errors
**Context:** UX
### ❌ Bad Practice
`.subscribe(data => ...)` without an error callback.
### ⚠️ Problem
On a 500 error, the application "hangs" in a loading state.
### ✅ Best Practice
Global Error Handler or `catchError` in the pipe returning a safe value.

## 55. Hardcoded API URLs
**Context:** Maintainability
### ❌ Bad Practice
`http.get('https://api.com/users')`
### ⚠️ Problem
Inability to switch environments (dev/prod).
### ✅ Best Practice
Using InjectionToken `API_URL` and environment configuration.

---

## V. Expert/Niche (56-60)

## 56. `untracked()` usage
**Context:** Fine-grained Reactivity
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

## 57. V8 Hidden Classes Optimization
**Context:** Micro-optimization
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

## 58. Signal Glitch Freedom abuse
**Context:** Reactivity Theory
### ❌ Bad Practice
Relying on `effect` to fire synchronously.
### ⚠️ Problem
Signals guarantee "Glitch Freedom" (absence of intermediate inconsistent states), but effects are asynchronous (microtask timing).
### ✅ Best Practice
Do not use effects to synchronize local state. Use `computed`.

## 59. Memory leaks in `root` Effects
**Context:** Application Lifecycle
### ❌ Bad Practice
Creating an effect in a service without `manualCleanup`.
### ⚠️ Problem
Effects in `root` services live forever. If they subscribe to something global, it can leak.
### ✅ Best Practice
Usually fine, but if the service is destroyed (rare lazy loading case), the effect must be cleaned up with `effectRef.destroy()`.

## 60. `runInInjectionContext`
**Context:** Advanced DI
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
