---
technology: Angular
domain: frontend
level: Senior/Architect
version: "20+"
tags: [angular, best-practices, clean-code, reactivity, rxjs]
ai_role: Senior Angular Expert
last_updated: 2026-04-05
---

# ⚡ Reactivity & RxJS

[⬆️ Back to Top](./readme.md)

### 🚨 6. `BehaviorSubject` for Local State
> [!NOTE]
> **Context:** Component State Management
### ❌ Bad Practice
```typescript
private count$ = new BehaviorSubject(0);
getCount() { return this.count$.value; }
```
### ⚠️ Problem
RxJS is overkill for deterministic synchronous state. `BehaviorSubject` requires `.value` for access and `.next()` for writes, increasing cognitive load.
### ✅ Best Practice
```typescript
count = signal(0);
// Access: count()
// Update: count.set(1)
```
### 🚀 Solution
Use `signal()` for local state. It is a primitive designed specifically for synchronizing UI and data.
---


### 🚨 7. Derived State with `ngOnChanges`
> [!NOTE]
> **Context:** Reactivity
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
---


### 🚨 8. Constructor Dependency Injection
> [!NOTE]
> **Context:** DI Pattern
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
---


### 🚨 9. Modules (`NgModule`)
> [!NOTE]
> **Context:** App Architecture
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
---


### 🚨 10. String-based Route Loading
> [!NOTE]
> **Context:** Lazy Loading Routing
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
---
