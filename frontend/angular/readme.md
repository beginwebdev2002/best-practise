---
technology: Angular
domain: frontend
level: Senior/Architect
version: "20"
tags: [angular, signals, performance, best-practices, typescript]
ai_role: Senior Angular Performance Expert
last_updated: 2026-03-22
---

# Angular v20: The Ultimate Best Practices & Anti-Patterns Registry

## I. Basics & Popular (1-15)

## 1. Using `@Input()` Decorator
**Context:** Component Inputs
### ❌ Bad Practice
```typescript
@Input() title: string = '';
```
### ⚠️ Problem
Декоратор `@Input()` работает вне системы реактивности Signals. Изменения не отслеживаются гранулярно, требуя проверки всего дерева компонентов (Dirty Checking) через Zone.js.
### ✅ Best Practice
```typescript
title = input<string>('');
```
### 🚀 Solution
Используйте Signal Inputs (`input()`). Это позволяет Angular точно знать, *какой* конкретно компонент требует обновления, открывая путь к Zoneless приложениям.

## 2. Using `@Output()` Decorator
**Context:** Component Outputs
### ❌ Bad Practice
```typescript
@Output() save = new EventEmitter<void>();
```
### ⚠️ Problem
Классический `EventEmitter` добавляет лишний слой абстракции над RxJS Subject и не интегрируется с функциональным API Angular.
### ✅ Best Practice
```typescript
save = output<void>();
```
### 🚀 Solution
Используйте функцию `output()`. Она обеспечивает строгую типизацию, лучшую производительность и унифицированный API с Signal Inputs.

## 3. Two-Way Binding with `@Input()` and `@Output()`
**Context:** Model Synchronization
### ❌ Bad Practice
```typescript
@Input() value: string;
@Output() valueChange = new EventEmitter<string>();
```
### ⚠️ Problem
Многословный код (boilerplate), который легко сломать, если ошибиться в нейминге события `Change`.
### ✅ Best Practice
```typescript
value = model<string>();
```
### 🚀 Solution
Используйте `model()`. Это создает Signal, который можно и читать, и записывать, автоматически синхронизируя состояние с родителем.

## 4. Structural Directives (`*ngIf`, `*ngFor`)
**Context:** Template Control Flow
### ❌ Bad Practice
```html
<div *ngIf="isLoaded; else loading">
  <li *ngFor="let item of items">{{ item }}</li>
</div>
```
### ⚠️ Problem
Директивы требуют импорта `CommonModule` или `NgIf/NgFor`, увеличивая бандл. Синтаксис микро-темплейтов сложен для статического анализа и type-checking.
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
Используйте встроенный Control Flow (`@if`, `@for`). Он встроен в компилятор, не требует импортов, поддерживает улучшенный type-narrowing и работает быстрее.

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
Императивная подписка ведет к утечкам памяти (если забыть `unsubscribe`), "Callback Hell" и рассинхрону состояния. Требует ручного управления подписками.
### ✅ Best Practice
```typescript
data = toSignal(this.service.getData());
```
### 🚀 Solution
Используйте `toSignal()` для превращения Observable в Signal. Это автоматически управляет подпиской и интегрирует поток данных в систему реактивности.

## 6. `BehaviorSubject` for Local State
**Context:** Component State Management
### ❌ Bad Practice
```typescript
private count$ = new BehaviorSubject(0);
getCount() { return this.count$.value; }
```
### ⚠️ Problem
RxJS избыточен для простого синхронного состояния. `BehaviorSubject` требует `.value` для доступа и `.next()` для записи, что увеличивает когнитивную нагрузку.
### ✅ Best Practice
```typescript
count = signal(0);
// Access: count()
// Update: count.set(1)
```
### 🚀 Solution
Используйте `signal()` для локального состояния. Это примитив, разработанный специально для синхронизации UI и данных.

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
`ngOnChanges` срабатывает только при изменении Inputs, имеет сложную типизацию и запускается до инициализации View.
### ✅ Best Practice
```typescript
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```
### 🚀 Solution
Используйте `computed()`. Сигнал пересчитывается *только* когда меняются его зависимости, и результат мемоизируется (кэшируется).

## 8. Constructor Dependency Injection
**Context:** DI Pattern
### ❌ Bad Practice
```typescript
constructor(private http: HttpClient, private store: Store) {}
```
### ⚠️ Problem
Конструкторы загромождаются при большом количестве зависимостей. При наследовании классов приходится пробрасывать зависимости через `super()`.
### ✅ Best Practice
```typescript
private http = inject(HttpClient);
private store = inject(Store);
```
### 🚀 Solution
Используйте функцию `inject()`. Она работает в контексте инициализации (полей или конструктора), типобезопасна и не требует `super()` при наследовании.

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
Модули создают лишний уровень индирекции. Компоненты становятся зависимыми от контекста модуля, что усложняет Lazy Loading и тестирование.
### ✅ Best Practice
```typescript
@Component({
  standalone: true,
  imports: [CommonModule]
})
```
### 🚀 Solution
Используйте Standalone Components. Это стандарт Angular v14+, который делает компоненты самодостаточными и tree-shakable.

## 10. String-based Route Loading
**Context:** Lazy Loading Routing
### ❌ Bad Practice
```typescript
loadChildren: () => import('./module').then(m => m.UserModule)
```
### ⚠️ Problem
Загрузка модулей тянет за собой транзитивные зависимости, которые могут не понадобиться.
### ✅ Best Practice
```typescript
loadComponent: () => import('./user.component').then(c => c.UserComponent)
```
### 🚀 Solution
Используйте `loadComponent` для маршрутизации на Standalone компоненты. Это обеспечивает минимальный размер чанка.

## 11. Heavy Logic in Templates
**Context:** Template Performance
### ❌ Bad Practice
```html
<div>{{ calculateTotal(items) }}</div>
```
### ⚠️ Problem
Функция `calculateTotal` вызывается при *каждом* цикле обнаружения изменений (CD), даже если `items` не изменились. Это убивает производительность UI.
### ✅ Best Practice
```typescript
total = computed(() => this.calculateTotal(this.items()));
```
```html
<div>{{ total() }}</div>
```
### 🚀 Solution
Выносите логику в `computed()` сигналы или Pure Pipes. Они выполняются только при изменении входных данных.

## 12. Manual Subscription Management (`takeUntil`)
**Context:** RxJS Memory Leaks
### ❌ Bad Practice
```typescript
destroy$ = new Subject<void>();
ngOnDestroy() { this.destroy$.next(); }
stream$.pipe(takeUntil(this.destroy$)).subscribe();
```
### ⚠️ Problem
Легко забыть `takeUntil` или `unsubscribe`. Требует много шаблонного кода в каждом компоненте.
### ✅ Best Practice
```typescript
stream$.pipe(takeUntilDestroyed()).subscribe();
```
### 🚀 Solution
Используйте оператор `takeUntilDestroyed()`. Он автоматически отписывается при уничтожении контекста (компонента, директивы, сервиса).

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
"Prop drilling" делает промежуточные компоненты жестко связанными с данными, которые им не нужны, только ради передачи их глубже.
### ✅ Best Practice
```typescript
// Service
theme = signal('dark');
// Grandchild
theme = inject(ThemeService).theme;
```
### 🚀 Solution
Используйте Signal Stores или сервисы для шаринга состояния, либо новый API `input()` с наследованием контекста (в будущем).

## 14. Accessing DOM directly (`ElementRef.nativeElement`)
**Context:** Security & Abstraction
### ❌ Bad Practice
```typescript
el.nativeElement.style.backgroundColor = 'red';
```
### ⚠️ Problem
Прямой доступ к DOM нарушает абстракцию (не работает в SSR/Web Workers) и открывает уязвимости XSS. Обходит механизмы Angular Sanitization.
### ✅ Best Practice
```typescript
// Use Renderer2 or bindings
<div [style.background-color]="color()"></div>
```
### 🚀 Solution
Используйте биндинги стилей/классов или `Renderer2`. Для прямых манипуляций рассмотрите директивы.

## 15. Zone.js overhead
**Context:** Change Detection
### ❌ Bad Practice
Приложение полагается на Zone.js для любого асинхронного события (setTimeout, Promise, XHR).
### ⚠️ Problem
Zone.js патчит все браузерные API, что добавляет оверхед и увеличивает размер бандла. CD срабатывает чаще, чем нужно.
### ✅ Best Practice
```typescript
bootstrapApplication(App, {
  providers: [provideExperimentalZonelessChangeDetection()]
});
```
### 🚀 Solution
Переходите на Zoneless режим. Используйте Signals для уведомления Angular о необходимости ре-рендера.

---

## II. Architecture & DI (16-30)

## 16. Services provided in 'root' vs Modules
**Context:** Tree Shaking
### ❌ Bad Practice
```typescript
@NgModule({ providers: [MyService] })
```
### ⚠️ Problem
Сервис попадает в бандл, даже если он не используется.
### ✅ Best Practice
```typescript
@Injectable({ providedIn: 'root' })
```
### 🚀 Solution
Всегда используйте `providedIn: 'root'`. Это позволяет бандлеру удалять неиспользуемые сервисы (Tree Shaking).

## 17. Class-based Guards
**Context:** Routing Security
### ❌ Bad Practice
```typescript
@Injectable()
export class AuthGuard implements CanActivate { ... }
```
### ⚠️ Problem
Классовые гарды требуют больше кода и инъекций. Они менее гибки для композиции.
### ✅ Best Practice
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isLoggedIn();
};
```
### 🚀 Solution
Используйте функциональные Guards (`CanActivateFn`). Они лаконичны, легко тестируются и комбинируются.

## 18. Class-based Interceptors
**Context:** HTTP Requests
### ❌ Bad Practice
```typescript
@Injectable()
export class TokenInterceptor implements HttpInterceptor { ... }
```
### ⚠️ Problem
Аналогично гардам: много бойлерплейта, сложная регистрация в массиве провайдеров.
### ✅ Best Practice
```typescript
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(req.clone({ setHeaders: { Authorization: token } }));
};
```
### 🚀 Solution
Используйте функциональные Интерсепторы (`HttpInterceptorFn`) с `provideHttpClient(withInterceptors([...]))`.

## 19. State Mutation in Services
**Context:** Data Integrity
### ❌ Bad Practice
```typescript
updateUser(user: User) {
  this.currentUser = user; // Mutable assignment
}
```
### ⚠️ Problem
Мутации объектов усложняют отслеживание изменений и могут привести к непредсказуемому поведению в компонентах, использующих стратегию `OnPush`.
### ✅ Best Practice
```typescript
currentUser = signal<User | null>(null);
updateUser(user: User) {
  this.currentUser.set({ ...user }); // Immutable update
}
```
### 🚀 Solution
Используйте Signals для управления состоянием. Они гарантируют реактивность и атомарность обновлений.

## 20. Calling functions inside `@for` tracking
**Context:** Rendering Performance
### ❌ Bad Practice
```html
@for (item of items; track getItemId(item))
```
### ⚠️ Problem
Функция трекинга вызывается для каждого элемента при каждом ре-рендере.
### ✅ Best Practice
```html
@for (item of items; track item.id)
```
### 🚀 Solution
Используйте свойство объекта (ID или уникальный ключ) напрямую. Если нужна функция, она должна быть максимально простой и чистой.

## 21. `host` property vs `@HostListener`
**Context:** Component Metadata
### ❌ Bad Practice
```typescript
@HostListener('click') onClick() { ... }
@HostBinding('class.active') isActive = true;
```
### ⚠️ Problem
Декораторы увеличивают размер класса и размазывают конфигурацию хоста по файлу.
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
Используйте свойство `host` в метаданных компонента. Это централизует все настройки хост-элемента.

## 22. Dynamic Components with `ComponentFactoryResolver`
**Context:** Dynamic Rendering
### ❌ Bad Practice
```typescript
const factory = this.resolver.resolveComponentFactory(MyComponent);
this.container.createComponent(factory);
```
### ⚠️ Problem
`ComponentFactoryResolver` deprecated. Это старый императивный API.
### ✅ Best Practice
```typescript
this.container.createComponent(MyComponent);
// Or strictly in template
<ng-container *ngComponentOutlet="componentSignal()" />
```
### 🚀 Solution
Используйте `ViewContainerRef.createComponent` напрямую с классом компонента или директиву `ngComponentOutlet`.

## 23. Shared Modules (The "Dump" Module)
**Context:** Modular Architecture
### ❌ Bad Practice
`SharedModule` импортирует и экспортирует *все* UI компоненты, пайпы и директивы.
### ⚠️ Problem
Если компоненту нужна одна кнопка, он вынужден тянуть весь `SharedModule`. Это ломает Tree Shaking и увеличивает начальный бандл.
### ✅ Best Practice
Импортируйте только то, что нужно, напрямую в `imports` Standalone компонента.
### 🚀 Solution
Откажитесь от `SharedModule` в пользу гранулярных импортов Standalone сущностей.

## 24. Circular Dependencies in DI
**Context:** Architecture
### ❌ Bad Practice
Service A injects Service B, which injects Service A.
### ⚠️ Problem
Приводит к ошибкам во время выполнения ("Cannot instantiate cyclic dependency"). Указывает на плохой дизайн архитектуры.
### ✅ Best Practice
Используйте `forwardRef()` как костыль, но лучше — выделите общую логику в третий Service C.
### 🚀 Solution
Рефакторинг: разбейте сервисы на более мелкие по принципу SRP (Single Responsibility Principle).

## 25. Logic in Pipes
**Context:** Separation of Concerns
### ❌ Bad Practice
Pipe выполняет HTTP-запросы или сложную бизнес-логику.
### ⚠️ Problem
Pipes предназначены для трансформации данных в шаблоне. Сайд-эффекты в пайпах нарушают чистоту функции и убивают производительность CD.
### ✅ Best Practice
Pipes должны быть "Pure" (без сайд-эффектов) и быстрыми.
### 🚀 Solution
Выносите логику в сервисы/сигналы. Оставьте пайпам только форматирование.

## 26. `any` in Services
**Context:** TypeScript Safety
### ❌ Bad Practice
```typescript
getData(): Observable<any> { ... }
```
### ⚠️ Problem
`any` отключает проверку типов, что сводит на нет преимущества TypeScript. Ошибки всплывают только в рантайме.
### ✅ Best Practice
```typescript
getData(): Observable<UserDto> { ... }
```
### 🚀 Solution
Используйте DTO интерфейсы (генерируйте их из Swagger/OpenAPI) и Zod для валидации ответов API.

## 27. Multiple `async` pipes for same stream
**Context:** RxJS Subscriptions
### ❌ Bad Practice
```html
<div *ngIf="user$ | async as user">{{ (user$ | async).name }}</div>
```
### ⚠️ Problem
Каждый `async` pipe создает новую подписку. Это может привести к дублированию HTTP-запросов.
### ✅ Best Practice
```html
@if (user$ | async; as user) {
  <div>{{ user.name }}</div>
}
```
### 🚀 Solution
Используйте алиасы в шаблоне (`as varName`) или конвертируйте поток в сигнал (`toSignal`).

## 28. ProvidedIn 'any'
**Context:** DI Scopes
### ❌ Bad Practice
```typescript
@Injectable({ providedIn: 'any' })
```
### ⚠️ Problem
Создает новый экземпляр сервиса для каждого lazy-loaded модуля. Это часто неожиданное поведение, ведущее к рассинхрону состояния (разные экземпляры синглтона).
### ✅ Best Practice
`providedIn: 'root'` или провайдинг на уровне конкретного компонента (`providers: []`).
### 🚀 Solution
Избегайте `any`. Явно контролируйте скоуп: либо глобальный (`root`), либо локальный.

## 29. Imperative Routing
**Context:** Navigation
### ❌ Bad Practice
```typescript
this.router.navigateByUrl('/users/' + id);
```
### ⚠️ Problem
Хардкод строк путей делает рефакторинг маршрутов болью.
### ✅ Best Practice
```typescript
this.router.navigate(['users', id]);
```
### 🚀 Solution
Используйте массив сегментов. Это безопаснее (автоматическое кодирование URL параметров) и чище.

## 30. Ignoring `OnPush` Strategy
**Context:** Change Detection Strategy
### ❌ Bad Practice
Компоненты по умолчанию (`ChangeDetectionStrategy.Default`).
### ⚠️ Problem
Angular проверяет этот компонент при *любом* событии в приложении, даже если данные компонента не менялись.
### ✅ Best Practice
```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```
### 🚀 Solution
Всегда ставьте `OnPush`. С сигналами это становится стандартом де-факто, так как обновление происходит точечно.

---

## III. Advanced Performance (31-45)

## 31. Eager Loading of Heavy Components
**Context:** Bundle Size
### ❌ Bad Practice
```html
<app-chart [data]="data" />
```
### ⚠️ Problem
Библиотека графиков (например, ECharts) загружается сразу, блокируя TTI (Time to Interactive), даже если график находится ниже "сгиба".
### ✅ Best Practice
```html
@defer (on viewport) {
  <app-chart [data]="data" />
} @placeholder {
  <div>Loading chart...</div>
}
```
### 🚀 Solution
Используйте `@defer`. Это откладывает загрузку кода компонента до наступления триггера (видимость, клик, таймер).

## 32. Heavy Computation in Main Thread
**Context:** Event Loop Blocking
### ❌ Bad Practice
Сортировка массива из 100k элементов прямо в компоненте.
### ⚠️ Problem
Фризит интерфейс.
### ✅ Best Practice
Вынос вычислений в Web Worker.
### 🚀 Solution
Используйте Angular Web Workers. В v20 это легко настраивается через CLI.

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
Эффекты перезапускаются при изменении зависимостей. Если не чистить таймеры/подписки внутри эффекта, они накапливаются.
### ✅ Best Practice
```typescript
effect((onCleanup) => {
  const timer = setInterval(() => ..., 1000);
  onCleanup(() => clearInterval(timer));
});
```
### 🚀 Solution
Всегда используйте колбэк `onCleanup` для освобождения ресурсов.

## 34. Excessive Change Detection with `NgZone.run()`
**Context:** Zone Integration
### ❌ Bad Practice
Оборачивать сторонние библиотеки в `ngZone.run()` без нужды.
### ⚠️ Problem
Форсирует лишние проверки всего дерева компонентов.
### ✅ Best Practice
```typescript
ngZone.runOutsideAngular(() => {
  // Heavy chart rendering or canvas animation
});
```
### 🚀 Solution
Запускайте частые события (scroll, mousemove, animationFrame) *вне* Angular зоны. Обновляйте сигналы только когда нужно обновить UI.

## 35. Signals equality check default
**Context:** Signal Performance
### ❌ Bad Practice
```typescript
data = signal({ id: 1 }, { equal: undefined }); // Default checks reference
```
### ⚠️ Problem
Если вы создаете новый объект с теми же данными `{ id: 1 }`, сигнал стриггерит обновление, хотя данные не изменились по сути.
### ✅ Best Practice
```typescript
import { isEqual } from 'lodash-es';
data = signal(obj, { equal: isEqual });
```
### 🚀 Solution
Используйте кастомную функцию сравнения для сложных объектов, чтобы избежать лишних ре-рендеров.

## 36. Lacking `trackBy` in iterables
**Context:** Re-rendering Lists
### ❌ Bad Practice
```html
<li *ngFor="let item of items">{{ item }}</li>
```
### ⚠️ Problem
Без трекинга любое изменение массива приводит к пересозданию всех DOM-узлов списка. $O(n)$ операций DOM.
### ✅ Best Practice
```html
@for (item of items; track item.id)
```
### 🚀 Solution
Всегда используйте уникальный ключ в `track`. Это позволяет Angular перемещать DOM-узлы вместо их пересоздания.

## 37. Recursive Template without Caching
**Context:** Tree Rendering
### ❌ Bad Practice
Рекурсивный вызов компонента без `OnPush` и мемоизации.
### ⚠️ Problem
Экспоненциальный рост проверок изменений.
### ✅ Best Practice
Использование `Memoization` паттерна или `computed()` для подготовки структуры данных дерева.

## 38. Global Styles Leakage
**Context:** CSS Encapsulation
### ❌ Bad Practice
```css
/* global.css */
button { padding: 10px; }
```
### ⚠️ Problem
Глобальные стили непредсказуемо влияют на компоненты.
### ✅ Best Practice
Используйте `ViewEncapsulation.Emulated` (по умолчанию) и специфичные селекторы.
### 🚀 Solution
Держите стили локально в компонентах.

## 39. Large Component Bundle
**Context:** Split Chunks
### ❌ Bad Practice
Один огромный компонент на 3000 строк.
### ⚠️ Problem
Плохая читаемость, невозможность ленивой загрузки частей UI.
### ✅ Best Practice
Декомпозиция на "глупые" (UI) и "умные" (Smart) компоненты.
### 🚀 Solution
Разбивайте UI на мелкие переиспользуемые блоки.

## 40. Image Optimization Ignorance
**Context:** Core Web Vitals (LCP)
### ❌ Bad Practice
```html
<img src="large-hero.jpg" />
```
### ⚠️ Problem
Браузер загружает полное изображение, сдвигает лейаут (CLS).
### ✅ Best Practice
```html
<img ngSrc="hero.jpg" width="800" height="600" priority />
```
### 🚀 Solution
Используйте `NgOptimizedImage` директиву. Она автоматически обрабатывает lazy loading, preconnect и srcset.

## 41. Hydration Mismatch
**Context:** SSR / SSG
### ❌ Bad Practice
Рендеринг `Date.now()` или случайных чисел (`Math.random()`) прямо в шаблоне.
### ⚠️ Problem
Сервер генерирует одно число, клиент — другое. Происходит "мерцание" и ошибка гидратации, Angular отбрасывает серверный DOM и рендерит с нуля.
### ✅ Best Practice
Использовать стабильные данные или откладывать генерацию рандома до `afterNextRender`.
### 🚀 Solution
Следите за детерминизмом шаблонов при SSR.

## 42. Synchronous `inject()` inside loops
**Context:** DI Performance
### ❌ Bad Practice
Вызов `inject()` внутри функции, которая вызывается в цикле.
### ⚠️ Problem
Хоть `inject` и быстр, в горячих путях это лишние лукапы в DI-дереве.
### ✅ Best Practice
Инжектить зависимость один раз на уровне класса/константы файла.

## 43. Unused Signal Dependencies
**Context:** Signal Graph
### ❌ Bad Practice
Чтение сигнала внутри `computed`, значение которого не влияет на результат (логическая ветка, которая не выполняется).
### ⚠️ Problem
Angular строит граф зависимостей динамически. Если вы случайно прочитали сигнал, он станет зависимостью.
### ✅ Best Practice
Используйте `untracked()` для чтения сигналов, изменения которых не должны триггерить пересчет.

## 44. Excessive Wrappers (`div` soup)
**Context:** DOM Size
### ❌ Bad Practice
```html
<div><div><div><app-comp></app-comp></div></div></div>
```
### ⚠️ Problem
Увеличивает глубину DOM-дерева, замедляет Style Recalculation и Layout.
### ✅ Best Practice
Используйте `<ng-container>` для группировки элементов без создания лишних узлов в DOM.

## 45. Neglecting `runOutsideAngular` for Events
**Context:** High-frequency events
### ❌ Bad Practice
`@HostListener('window:scroll')`
### ⚠️ Problem
Каждый скролл ивент запускает Change Detection.
### ✅ Best Practice
Подписываться вручную в `runOutsideAngular` и обновлять сигнал только при необходимости.

---

## IV. Data & Forms (46-55)

## 46. Template-Driven Forms without Types
**Context:** Form Safety
### ❌ Bad Practice
`[(ngModel)]` без строгой типизации модели.
### ⚠️ Problem
Риск присвоить строку в числовое поле.
### ✅ Best Practice
Используйте Reactive Forms с типизацией `FormControl<string>` или новые Signal-based Forms (когда выйдут из developer preview).

## 47. Untyped `FormGroup`
**Context:** Reactive Forms
### ❌ Bad Practice
```typescript
const form = new FormGroup({ ... }); // Untyped
```
### ⚠️ Problem
`form.value` возвращает `any`.
### ✅ Best Practice
```typescript
const form = new FormGroup<LoginForm>({
  email: new FormControl('', { nonNullable: true }),
  ...
});
```
### 🚀 Solution
Всегда типизируйте формы. Используйте `nonNullable: true` для избежания `string | undefined` ада.

## 48. Subscribe inside Subscribe
**Context:** RxJS Patterns
### ❌ Bad Practice
```typescript
this.route.params.subscribe(params => {
  this.api.getUser(params.id).subscribe(user => ...);
});
```
### ⚠️ Problem
Классический Race Condition. Если параметры меняются быстро, порядок ответов не гарантирован.
### ✅ Best Practice
```typescript
this.route.params.pipe(
  switchMap(params => this.api.getUser(params.id))
).subscribe();
```
### 🚀 Solution
Используйте Flattening Operators (`switchMap`, `concatMap`, `mergeMap`).

## 49. Ignoring `AbortSignal` in HTTP
**Context:** Network Efficiency
### ❌ Bad Practice
Игнорирование отмены запроса при уходе со страницы.
### ⚠️ Problem
Запросы продолжают висеть, потребляя трафик.
### ✅ Best Practice
HttpClient автоматически поддерживает отмену при отписке. С сигналами: убедитесь, что `rxResource` или эффект корректно отменяет запрос.

## 50. Mutating Inputs directly
**Context:** Unidirectional Data Flow
### ❌ Bad Practice
```typescript
this.inputData.push(newItem);
```
### ⚠️ Problem
Родительский компонент не узнает об изменении. Нарушается принцип One-Way Data Flow.
### ✅ Best Practice
Emit event (`output`) наверх, родитель меняет данные и спускает новый объект вниз.

## 51. `ngModel` inside Reactive Form
**Context:** Form Mixing
### ❌ Bad Practice
Использование `formControlName` и `[(ngModel)]` на одном инпуте.
### ⚠️ Problem
Deprecated поведение. Вызывает конфликты синхронизации модели и формы.
### ✅ Best Practice
Используйте только один подход: либо Reactive, либо Template-driven.

## 52. Complex Validators in Template
**Context:** Form Logic
### ❌ Bad Practice
Валидация через атрибуты HTML для сложной логики.
### ⚠️ Problem
Сложно тестировать, нет переиспользования.
### ✅ Best Practice
Custom Validator Functions или Async Validators в классе компонента.

## 53. Forgetting `updateOn: 'blur'`
**Context:** Performance
### ❌ Bad Practice
Валидация сложного поля на каждое нажатие клавиши (`change`).
### ⚠️ Problem
Тормозит ввод пользователя.
### ✅ Best Practice
```typescript
new FormControl('', { updateOn: 'blur' });
```
### 🚀 Solution
Запускайте валидацию/обновление только когда пользователь закончил ввод.

## 54. Not handling API Errors
**Context:** UX
### ❌ Bad Practice
`.subscribe(data => ...)` без колбэка ошибки.
### ⚠️ Problem
При ошибке 500 приложение "зависает" в состоянии загрузки.
### ✅ Best Practice
Global Error Handler или `catchError` в пайпе с возвратом безопасного значения.

## 55. Hardcoded API URLs
**Context:** Maintainability
### ❌ Bad Practice
`http.get('https://api.com/users')`
### ⚠️ Problem
Невозможность сменить окружение (dev/prod).
### ✅ Best Practice
Использование InjectionToken `API_URL` и конфигурации environment.

---

## V. Expert/Niche (56-60)

## 56. `untracked()` usage
**Context:** Fine-grained Reactivity
### ❌ Bad Practice
Случайное создание циклической зависимости в `computed`.
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
Используйте `untracked()` для сайд-эффектов или чтений, которые не должны влиять на пересчет.

## 57. V8 Hidden Classes Optimization
**Context:** Micro-optimization
### ❌ Bad Practice
```typescript
user = signal({});
// later
user.set({ name: 'A', age: 10 }); // Shape change
```
### ⚠️ Problem
Инициализация пустым объектом и последующее добавление полей меняет "форму" (Hidden Class) объекта, сбивая оптимизацию JIT компилятора V8.
### ✅ Best Practice
```typescript
interface User { name: string | null; age: number | null; }
user = signal<User>({ name: null, age: null });
```
### 🚀 Solution
Всегда инициализируйте сигналы полной формой объекта (даже с null), чтобы сохранить мономорфность доступа к свойствам.

## 58. Signal Glitch Freedom abuse
**Context:** Reactivity Theory
### ❌ Bad Practice
Полагаться на то, что `effect` сработает синхронно.
### ⚠️ Problem
Сигналы гарантируют "Glitch Freedom" (отсутствие промежуточных несогласованных состояний), но эффекты асинхронны (microtask timing).
### ✅ Best Practice
Не используйте эффекты для синхронизации локального стейта. Используйте `computed`.

## 59. Memory leaks in `root` Effects
**Context:** Application Lifecycle
### ❌ Bad Practice
Создание эффекта в сервисе без `manualCleanup`.
### ⚠️ Problem
Эффекты в `root` сервисах живут вечно. Если они подписываются на что-то глобальное, это может течь.
### ✅ Best Practice
Обычно ок, но если сервис уничтожается (редкий кейс с lazy loading), эффект нужно чистить `effectRef.destroy()`.

## 60. `runInInjectionContext`
**Context:** Advanced DI
### ❌ Bad Practice
Передача экземпляра `Injector` вручную в функции.
### ⚠️ Problem
Громоздкий код.
### ✅ Best Practice
```typescript
runInInjectionContext(this.injector, () => {
  // can use inject() here dynamically
  const service = inject(MyService);
});
```
### 🚀 Solution
Используйте этот хелпер для выполнения функций, требующих DI контекста, вне конструктора/инициализации.
