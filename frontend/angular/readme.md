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

# 🎨 Angular Best Practices & Production-Ready Patterns

## 🎯 Context & Scope
- **Primary Goal:** Enforce strict adherence to modern Angular v20 patterns, specifically Zoneless reactivity and functional APIs for optimal best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Always** use `signal()`, `computed()`, and `effect()` instead of RxJS `BehaviorSubject` for local state.
> - **Never** use `@Input()` or `@Output()` decorators; strictly use `input()` and `output()` functional APIs.
> - **Always** utilize the built-in control flow (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`).

## 🚀 I. Basics & Popular (1-15)

### 🚨 1. Using `@Input()` Decorator
**Context:** Component Inputs
#### ❌ Bad Practice
```typescript
@Input() title: string = '';
```
#### ⚠️ Problem
The `@Input()` decorator operates outside the Signals reactivity system. Changes are not tracked granularly, requiring checks of the entire component tree (Dirty Checking) via Zone.js.
#### ✅ Best Practice
```typescript
title = input<string>('');
```
#### 🚀 Solution
Use Signal Inputs (`input()`). This allows Angular to precisely know *which* specific component requires an update, paving the way for Zoneless applications.

### 🚨 2. Using `@Output()` Decorator
**Context:** Component Outputs
#### ❌ Bad Practice
```typescript
@Output() save = new EventEmitter<void>();
```
#### ⚠️ Problem
The classic `EventEmitter` adds an unnecessary layer of abstraction over RxJS Subject and does not integrate with the Angular functional API.
#### ✅ Best Practice
```typescript
save = output<void>();
```
#### 🚀 Solution
Use the `output()` function. It provides strict typing, better performance, and a unified API with Signal Inputs.

### 🚨 3. Two-Way Binding with `@Input()` and `@Output()`
**Context:** Model Synchronization
#### ❌ Bad Practice
```typescript
@Input() value: string;
@Output() valueChange = new EventEmitter<string>();
```
#### ⚠️ Problem
Boilerplate code that is easy to break if you make a mistake in naming the `Change` event.
#### ✅ Best Practice
```typescript
value = model<string>();
```
#### 🚀 Solution
Use `model()`. This creates a Signal that can be both read and written to, automatically synchronizing its state with the parent.

### 🚨 4. Structural Directives (`*ngIf`, `*ngFor`)
**Context:** Template Control Flow
#### ❌ Bad Practice
```html
<div *ngIf="isLoaded; else loading">
  <li *ngFor="let item of items">{{ item }}</li>
</div>
```
#### ⚠️ Problem
Directives require importing `CommonModule` or `NgIf/NgFor`, increasing bundle size. Micro-template syntax is complex for static analysis and type-checking.
#### ✅ Best Practice
```html
@if (isLoaded()) {
  @for (item of items(); track item.id) {
    <li>{{ item.name }}</li>
  }
} @else {
  <app-loader />
}
```
#### 🚀 Solution
Use the built-in Control Flow (`@if`, `@for`). It is built into the compiler, requires no imports, supports improved type-narrowing, and runs faster.

### 🚨 5. Subscribing in Components (Logic in `ngOnInit`)
**Context:** Data Fetching
#### ❌ Bad Practice
```typescript
data: any;
ngOnInit() {
  this.service.getData().subscribe(res => this.data = res);
}
```
#### ⚠️ Problem
Imperative subscriptions lead to memory leaks (if you forget to `unsubscribe`), "Callback Hell", and state desynchronization. Requires manual subscription management.
#### ✅ Best Practice
```typescript
data = toSignal(this.service.getData());
```
#### 🚀 Solution
Use `toSignal()` to convert an Observable into a Signal. This automatically manages the subscription and integrates the data stream into the reactivity system.

### 🚨 6. `BehaviorSubject` for Local State
**Context:** Component State Management
#### ❌ Bad Practice
```typescript
private count$ = new BehaviorSubject(0);
getCount() { return this.count$.value; }
```
#### ⚠️ Problem
RxJS is overkill for simple synchronous state. `BehaviorSubject` requires `.value` for access and `.next()` for writes, increasing cognitive load.
#### ✅ Best Practice
```typescript
count = signal(0);
// Access: count()
// Update: count.set(1)
```
#### 🚀 Solution
Use `signal()` for local state. It is a primitive designed specifically for synchronizing UI and data.

### 🚨 7. Derived State with `ngOnChanges`
**Context:** Reactivity
#### ❌ Bad Practice
```typescript
ngOnChanges(changes: SimpleChanges) {
  if (changes['firstName']) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
```
#### ⚠️ Problem
`ngOnChanges` is triggered only when Inputs change, has complex typing, and runs before View initialization.
#### ✅ Best Practice
```typescript
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```
#### 🚀 Solution
Use `computed()`. The signal is recalculated *only* when its dependencies change, and the result is memoized (cached).

### 🚨 8. Constructor Dependency Injection
**Context:** DI Pattern
#### ❌ Bad Practice
```typescript
constructor(private http: HttpClient, private store: Store) {}
```
#### ⚠️ Problem
Constructors become cluttered with many dependencies. When inheriting classes, dependencies must be passed through `super()`.
#### ✅ Best Practice
```typescript
private http = inject(HttpClient);
private store = inject(Store);
```
#### 🚀 Solution
Use the `inject()` function. It operates in the initialization context (fields or constructor), is type-safe, and does not require `super()` during inheritance.

### 🚨 9. Modules (`NgModule`)
**Context:** App Architecture
#### ❌ Bad Practice
```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule]
})
export class AppModule {}
```
#### ⚠️ Problem
Modules create an unnecessary level of indirection. Components become dependent on the module context, complicating Lazy Loading and testing.
#### ✅ Best Practice
```typescript
@Component({
  standalone: true,
  imports: [CommonModule]
})
```
#### 🚀 Solution
Use Standalone Components. This is the Angular v14+ standard that makes components self-sufficient and tree-shakable.

### 🚨 10. String-based Route Loading
**Context:** Lazy Loading Routing
#### ❌ Bad Practice
```typescript
loadChildren: () => import('./module').then(m => m.UserModule)
```
#### ⚠️ Problem
Loading modules pulls in transitive dependencies that might not be needed.
#### ✅ Best Practice
```typescript
loadComponent: () => import('./user.component').then(c => c.UserComponent)
```
#### 🚀 Solution
Use `loadComponent` for routing to Standalone components. This ensures minimal chunk size.

### 🚨 11. Heavy Logic in Templates
**Context:** Template Performance
#### ❌ Bad Practice
```html
<div>{{ calculateTotal(items) }}</div>
```
#### ⚠️ Problem
The `calculateTotal` function is called during *every* Change Detection (CD) cycle, even if `items` have not changed. This kills UI performance.
#### ✅ Best Practice
```typescript
total = computed(() => this.calculateTotal(this.items()));
```
```html
<div>{{ total() }}</div>
```
#### 🚀 Solution
Extract logic into `computed()` signals or Pure Pipes. They are only executed when input data changes.

### 🚨 12. Manual Subscription Management (`takeUntil`)
**Context:** RxJS Memory Leaks
#### ❌ Bad Practice
```typescript
destroy$ = new Subject<void>();
ngOnDestroy() { this.destroy$.next(); }
stream$.pipe(takeUntil(this.destroy$)).subscribe();
```
#### ⚠️ Problem
It's easy to forget `takeUntil` or `unsubscribe`. Requires a lot of boilerplate code in every component.
#### ✅ Best Practice
```typescript
stream$.pipe(takeUntilDestroyed()).subscribe();
```
#### 🚀 Solution
Use the `takeUntilDestroyed()` operator. It automatically unsubscribes upon context destruction (component, directive, service).

### 🚨 13. Deeply Nested Components Passing Data
**Context:** Prop Drilling
#### ❌ Bad Practice
```html
<!-- Parent -->
<app-child [theme]="theme"></app-child>
<!-- Child -->
<app-grandchild [theme]="theme"></app-grandchild>
```
#### ⚠️ Problem
"Prop drilling" heavily couples intermediate components to data they don't need, just for the sake of passing it deeper.
#### ✅ Best Practice
```typescript
// Service
theme = signal('dark');
// Grandchild
theme = inject(ThemeService).theme;
```
#### 🚀 Solution
Use Signal Stores or services for state sharing, or the new `input()` API with context inheritance (in the future).

### 🚨 14. Accessing DOM directly (`ElementRef.nativeElement`)
**Context:** Security & Abstraction
#### ❌ Bad Practice
```typescript
el.nativeElement.style.backgroundColor = 'red';
```
#### ⚠️ Problem
Direct DOM access breaks abstraction (doesn't work in SSR/Web Workers) and opens up XSS vulnerabilities. It bypasses Angular Sanitization mechanisms.
#### ✅ Best Practice
```typescript
// Use Renderer2 or bindings
<div [style.background-color]="color()"></div>
```
#### 🚀 Solution
Use style/class bindings or `Renderer2`. For direct manipulations, consider directives.

### 🚨 15. Zone.js overhead
**Context:** Change Detection
#### ❌ Bad Practice
The application relies on Zone.js for any asynchronous event (setTimeout, Promise, XHR).
#### ⚠️ Problem
Zone.js patches all browser APIs, adding overhead and increasing bundle size. CD triggers more often than necessary.
#### ✅ Best Practice
```typescript
bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()]
});
```
#### 🚀 Solution
Migrate to Zoneless mode. Use Signals to notify Angular when a re-render is needed.

---

## 📚 Specialized Topics

For further reading, please refer to the following specialized guides:

- [🏗 Architecture & Dependency Injection](./architecture.md)
- [🚀 Advanced Performance](./advanced-performance.md)
- [📝 Data & Forms](./data-forms.md)
- [🧠 Expert/Niche Topics](./expert-niche.md)
