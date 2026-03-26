---
description: Vibe coding guidelines and architectural constraints for Angular Architecture within the frontend domain.
technology: Angular
domain: frontend
level: Senior/Architect
version: "20"
tags: [architecture, dependency-injection, angular, best-practices, clean-code, scalable-code]
ai_role: Senior Angular Architecture Expert
last_updated: 2026-03-22
---

# 🏗 Angular Architecture & Dependency Injection Best Practices

# 📖 Context & Scope
- **Primary Goal:** Provide architectural best practices for Angular including DI usage, modules, routing, and guards.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Angular 20

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
