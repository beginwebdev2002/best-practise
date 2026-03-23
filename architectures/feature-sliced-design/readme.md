---
description: Vibe coding guidelines and architectural constraints for Feature-Sliced Design within the Architecture domain.
technology: Feature-Sliced Design
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [fsd, modular-architecture, frontend, system-design, clean-architecture]
ai_role: Senior Frontend Architect
last_updated: 2026-03-22
---

<div align="center">
  <img src="https://feature-sliced.design/img/brand/logo-primary.png" width="100" alt="FSD Logo">
  
  # 🍰 Feature-Sliced Design (FSD)
</div>

---

This engineering directive contains strict architectural guidelines and 20 practical patterns for using the Feature-Sliced Design methodology to build scalable and deterministic Frontend applications.

## 1. Unidirectional Dependency Rule

### ❌ Bad Practice
```typescript
// The Shared layer depends strictly on a higher layer (Entities)
import { User } from 'entities/user';
```

### ⚠️ Problem
Violation of the upward dependency flow constraints. `shared` is the lowest infrastructure layer; it has no right to know anything about the business domain (`entities`), features (`features`), and widgets. This leads to circular dependencies and tight coupling.

### ✅ Best Practice
```typescript
// The Entities layer naturally depends on the infra-layer below (Shared)
import { Button } from 'shared/ui/button';
```

### 🚀 Solution
Layers must import modules exclusively from layers located strictly lower in the hierarchy: `app` -> `pages` -> `widgets` -> `features` -> `entities` -> `shared`.

---

## 2. Cross-Slice Imports Within the Same Layer

### ❌ Bad Practice
```typescript
// The features/cart slice directly imports logic from features/favorites
import { addToFavorites } from 'features/favorites';
```

### ⚠️ Problem
Business slices within the same layer (`features`, `entities`, etc.) are isolated and must not depend on each other. Tight coupling of features deprives the project of flexibility, breaks refactoring, and complicates cross-functional reusability.

### ✅ Best Practice
```typescript
// Relationship composition is built on the layer above (e.g., in Widgets)
import { AddToCartButton } from 'features/cart';
import { AddToFavoritesButton } from 'features/favorites';

const ProductWidget = () => (
  <div>
    <AddToCartButton />
    <AddToFavoritesButton />
  </div>
);
```

### 🚀 Solution
Interaction between slices at the same level should occur through composition at higher layers (`widgets`, `pages`) or via global patterns (Global State, Event Bus).

---

## 3. Public API Encapsulation (Bypassing Public API)

### ❌ Bad Practice
```typescript
// Importing internal files bypassing the public contract (index.ts)
import { UserCard } from 'entities/user/ui/UserCard';
import { fetchUser } from 'entities/user/api/fetchUser';
```

### ⚠️ Problem
Deep imports break module encapsulation. When refactoring internal files and the directory structure of `entities/user`, external components tightly bound to them will break.

### ✅ Best Practice
```typescript
// Legal import exclusively through the Public API
import { UserCard, fetchUser } from 'entities/user';
```

### 🚀 Solution
Every slice must have an entry point `index.ts` (Public API) that explicitly exports only what is intended for external use (Contract). All other files are considered strictly internal/private.

---

## 4. Separation of Business Logic (Entity vs Feature)

### ❌ Bad Practice
```typescript
// Business action (feature logic) is embedded within an isolated Entity
export const ArticleCard = () => {
    const handleLike = () => api.post('/articles/like');
    return <Card onLike={handleLike} />;
}
```

### ⚠️ Problem
The `entities` domain is responsible for the structure of the domain and its visual representation, not for interactive business scenarios. Placing the like logic in `ArticleCard` prevents using this card in Read-Only contexts.

### ✅ Best Practice
```typescript
// The Entity provides slots for UI composition
export const ArticleCard = ({ article, actionSlot }: Props) => (
    <Card extra={actionSlot} />
);

// The Feature implements the business operation
export const LikeButton = ({ articleId }) => {
    const handleLike = () => api.post(`/articles/${articleId}/like`);
    return <Button onClick={handleLike}>Like</Button>;
}
```

### 🚀 Solution
Separate the structure of the entity (`entities`) from user business actions (`features`). Integrate features into entities via render-props or React slots at the widgets layer.

---

## 5. Domain Specifics in the Shared Layer

### ❌ Bad Practice
```typescript
// Creating domain-oriented folders in the Shared layer
import { calculateUserRating } from 'shared/user/utils';
```

### ⚠️ Problem
The infrastructure layer `shared` has no business slices. It is strictly segmented by technical purpose (`ui`, `lib`, `api`, `config`). The appearance of domain segments (user, cart) in `shared` categorically violates the agnostic paradigm.

### ✅ Best Practice
```typescript
// Strict technical grouping
import { formatDate } from 'shared/lib/date';
import { Button } from 'shared/ui/button';
```

### 🚀 Solution
The `shared` layer contains purely infrastructural code, reusable dumb components (UI-kit), and helpers, completely abstracted from the project's business knowledge.

---

## 6. Area of Responsibility for Pages (Thick Pages)

### ❌ Bad Practice
```typescript
// The Page contains complex UI markup and heavy calculations
export const ProductPage = () => {
    const { data } = useFetchProduct(id);
    const handleBuy = () => api.buy();
    return <div className="complex-layout">....</div>;
}
```

### ⚠️ Problem
The `pages` layer does not manage business scenarios or complex network requests directly. "Thick" pages generate Legacy, are extremely difficult to unit test, and defy refactoring.

### ✅ Best Practice
```typescript
// The page acts solely as a "router" and composition layer for widgets
import { ProductDetailsWidget } from 'widgets/product-details';

export const ProductPage = () => {
    return (
        <PageLayout>
            <ProductDetailsWidget />
        </PageLayout>
    );
}
```

### 🚀 Solution
Delegate business logic and state management to `widgets` and `features`. The page (`pages`) is responsible for routing, SEO tags, and composing major blocks into the layout.

---

## 7. Arbitrary Segment Structure Inside a Slice

### ❌ Bad Practice
```typescript
// Creating non-standard folders inside a slice
features/auth-user/
  ├── components/
  ├── hooks/
  ├── services/
```

### ⚠️ Problem
Chaotic folder naming breaks the standardization of the FSD architecture. Engineers lose the ability to deterministically navigate the code in slices that do not conform to a uniform format.

### ✅ Best Practice
```typescript
// Strictly using standardized FSD segments
features/auth-user/
  ├── ui/
  ├── model/
  ├── api/
  ├── lib/
  └── index.ts
```

### 🚀 Solution
Standard FSD segments must be applied exclusively within each slice: `ui` (JSX/components), `model` (state, hooks), `api` (network connectors), `lib` (helpers), `config` (variables/constants).

---

## 8. Root App Component Architecture (God Object App)

### ❌ Bad Practice
```typescript
// The root initialization file is overloaded with business state
const App = () => {
    const [user, setUser] = useState(null);
    return <Auth user={user} />;
};
```

### ⚠️ Problem
The `app` layer is reserved for system platform initialization. Concentrating domain state or logic in it forms a monolith and breaks FSD separation (Slices).

### ✅ Best Practice
```typescript
// app/App.tsx merely contains a composition of providers
import { AppProviders } from './providers';
import { AppRouter } from './router';

export const App = () => (
    <AppProviders>
        <AppRouter />
    </AppProviders>
);
```

### 🚀 Solution
Session business states are outsourced to `entities/session` or `features`. The `app` layer combines global configurations (Redux, QueryClient, DI Containers), global styles, and the routing tree.

---

## 9. Global Store (Centralized State Management)

### ❌ Bad Practice
```typescript
// Redux Store is organized by technical type, ignoring slices
const store = configureStore({
    reducer: {
        apiData: apiReducer,
        componentsState: uiReducer,
    }
});
```

### ⚠️ Problem
Forming a Redux state detached from business slices destroys the cohesion of FSD. Logic scatters across the system, making mutation tracking counter-intuitive.

### ✅ Best Practice
```typescript
// app/store.ts composes reducers strictly from slice Public APIs
import { userModel } from 'entities/user';
import { authModel } from 'features/auth';

const store = configureStore({
    reducer: {
        user: userModel.reducer,
        auth: authModel.reducer,
    }
});
```

### 🚀 Solution
Each slice sets up its own chunk of state locally in `model/slice.ts`, exporting the Reducer via the Public API. The root store in `app/store` simply composes them together.

---

## 10. Deep Relative Imports

### ❌ Bad Practice
```typescript
// Using "../../" to address elements in other layers
import { Button } from '../../../../shared/ui/button';
```

### ⚠️ Problem
Deep relative imports between architectural layers break static analysis tools, spoil the visual cleanliness of the code, and turn file relocation into a nightmare.

### ✅ Best Practice
```typescript
// Using configured absolute paths (Absolute Imports)
import { Button } from 'shared/ui/button';
import { Button } from '@/shared/ui/button'; // Optionally via alias
```

### 🚀 Solution
Configure absolute path aliases in `tsconfig.json`. Apply them when importing across cross-layers and slices. Relative paths (`./`, `../`) are strictly allowed only within the boundaries of a single slice.

---

## 11. Type Contract Encapsulation Leaks

### ❌ Bad Practice
```typescript
// The Shared layer inexplicably provides global business types
// shared/types/user.ts
export type UserDTO = { id: string; role: string };
```

### ⚠️ Problem
The infrastructure (`shared`) belongs to an agnostic zone and must not "know" about business entities (User). Placing domain types in the global context breaks domain isolation paradigms.

### ✅ Best Practice
```typescript
// entities/user/model/types.ts
export type UserDTO = { id: string; role: string };

// Type export via Public API in entities/user/index.ts
export type { UserDTO } from './model/types';
```

### 🚀 Solution
Business types are declared uniquely in the `model` or `api` segment of the respective domain slice (`entities`, `features`) and are exposed externally exclusively through its root `index.ts`.

---

## 12. Globalizing Local Configuration Constants

### ❌ Bad Practice
```typescript
// Magic constants scattered directly inside the UI files
const isMessageValid = text.length > 255;
```

### ⚠️ Problem
The lack of a centralized local configuration for a feature engenders technical debt, duplicate values, and a high probability of bugs when business requirements mutate.

### ✅ Best Practice
```typescript
// features/send-message/config/constants.ts
export const MAX_MESSAGE_LENGTH = 255;

// features/send-message/ui/MessageForm.tsx
import { MAX_MESSAGE_LENGTH } from '../config/constants';
```

### 🚀 Solution
Exploit the `config` segment to stockpile isolated constants, limits, and locales particular to a feature. Genuine global constants are kept in `shared/config`.

---

## 13. Component Testing by Bypassing Public API

### ❌ Bad Practice
```typescript
// A unit test rigidly bound to private implementations
import { authHelper } from '../lib/authHelper';
```

### ⚠️ Problem
Testing private methods (White-Box Testing) notoriously engenders a high level of fragile tests. The slightest refactoring to internal implementations nullifies assertion results.

### ✅ Best Practice
```typescript
// Validating feature functionality solely through an exported public contract
import { AuthFeature } from 'features/auth';
```

### 🚀 Solution
Write tests for features and entities by importing their behaviors entirely via the Public API layer (`index.ts`). For test mocks, fashion an isolated `testing.ts` endpoint adjacent to the Public API.

---

## 14. Domain Object Mixing (God Entity Objects)

### ❌ Bad Practice
```typescript
// Forging an All-In-One "User" Entity loaded with miscellaneous logic
entities/user/
  ├── model/ (Profile state, payment pipelines, operational logs)
```

### ⚠️ Problem
Disregarding Domain-Driven Design (DDD) doctrines. The monolithic entity transforms into a critical project bottleneck, provoking perpetual merge conflicts and logic breakdowns.

### ✅ Best Practice
```typescript
// Decomposition into decoupled, atomic domains
entities/user/       // Profile fundamentals (Name, Avatar)
entities/session/    // Session specifics (JWT Token, Auth status)
entities/payment/    // Financial endpoints and transactional ledgers
```

### 🚀 Solution
Each `entities` slice correlates to a rigorous and indivisible domain scope. Eliminate the architecting of "God Entities". Propel horizontal application scalability by shattering monoliths into manageable micro-domains.

---

## 15. Hardwired Local Routing in an Isolated Slice

### ❌ Bad Practice
```typescript
// Routing logic or hyperlinks directly stitched into an Entity/Feature file
import { useNavigate } from 'react-router';

export const UserCard = () => {
    const nav = useNavigate();
    return <div onClick={() => nav('/profile')} />
}
```

### ⚠️ Problem
Hardcoding physical URL endpoints within a reusable UI module forcibly binds it to the structural topology of a specific Frontend application.

### ✅ Best Practice
```typescript
// Handing over navigation authority upstream via Callbacks
export const UserCard = ({ onNavigate }: Props) => (
    <div onClick={onNavigate} />
)
```

### 🚀 Solution
Construct features and entities to operate Routing-Agnostic. They do not orchestrate route changes—they relay Event-triggers (Callbacks). Segregate routing mechanisms at the `pages` or `app/providers` layer.

---

## 16. Polluting External Dependencies (Third-party Coupling)

### ❌ Bad Practice
```typescript
// Pervasive injection of a third-party library across divergent application components
import axios from 'axios';
// or
import moment from 'moment';
```

### ⚠️ Problem
Unmediated reliance of localized business slices on upstream third-party solutions. Should an initiative pivot from `moment` to `date-fns`, architects will confront the penalty to refactor vast swaths of code.

### ✅ Best Practice
```typescript
// Constructing an Adapter in the shared zone
// shared/lib/date/formatDate.ts
import dayjs from 'dayjs';
export const formatDate = (date: string) => dayjs(date).format();

// Usage in business logic (importing the adapter function)
import { formatDate } from 'shared/lib/date';
```

### 🚀 Solution
Encase external Utility and API libraries behind an Adapter pattern explicitly at the `shared/lib` or `shared/api` strata. Export solely an encapsulated facet, concealing the underlying vendor details from feature modules.

---

## 17. Fragmenting System Networking Errors

### ❌ Bad Practice
```typescript
// Managing HTTP 401 Unauthorized codes manually within the generic component scope
api.get('/profile').catch(err => {
    if(err.status === 401) handleLogout();
});
```

### ⚠️ Problem
Multiplying system error handling mechanics inside feature constructs. Drives severe Code Duplication (disobeying the DRY principle) and an inconsistent application experience framework.

### ✅ Best Practice
```typescript
// Configuration in shared/api/apiClient.ts
apiClient.interceptors.response.use(res => res, err => {
    if (err.status === 401) EventBus.dispatch('logout_system');
    throw err;
});
```

### 🚀 Solution
Engineer top-level Interceptor filters (Axios object overrides, Fetch API wrappers) exactly within the `shared/api` segment. Constrain localized feature handling strictly to discrete business-tier violations (e.g., "Bad format", HTTP 400).

---

## 18. Abstraction Degradation in Slice Naming Conventions

### ❌ Bad Practice
```typescript
// Designing slice nomenclature using excessively universal, uninformative tags
features/data/
entities/api-wrapper/
widgets/main-block/
```

### ⚠️ Problem
Deploying generic naming completely diminishes the semantic value of FSD. The business-oriented focus of practically any directory is obfuscated, forcing exhaustive code scans to comprehend purpose.

### ✅ Best Practice
```typescript
// Nomenclature rigorously conveying the targeted domain capability
features/add-to-cart/
entities/session/
widgets/header-navigation/
```

### 🚀 Solution
Employ discernible industry nouns for `entities` and `widgets`. Utilize strictly descriptive business processes (Action-names) for defining `features`. Ultimately, slices must act as self-documenting assets based merely on title assignments.

---

## 19. Misplaced Global Providers/HOCs Integrations

### ❌ Bad Practice
```typescript
// Localizing a business feature to arbitrarily establish systemic Context Providers
export const CheckoutFeature = () => (
    <ThemeProvider>
        <ValidationProvider>
             <CheckoutForm />
        </ValidationProvider>
    </ThemeProvider>
);
```

### ⚠️ Problem
Subordinating global infra-providers inside isolated modules distorts Context flows engineered for React/Vue, artificially locking themes/configurations underneath non-root layer fragments.

### ✅ Best Practice
```typescript
// Solely maintained within app/providers setup
export const AppLayer = () => (
    <ThemeProvider>
        <ValidationProvider>
             <AppRouter />
        </ValidationProvider>
    </ThemeProvider>
);
```

### 🚀 Solution
Any foundational systems (Theme logic, i18n, Central Redux Store, React Query Client mounts) are stringently dictated to execute out of `app/providers` globally exported via single orchestrator element (`<WithProviders>`).

---

## 20. Engineering the Widgets Payload (Orchestration Scope)

### ❌ Bad Practice
```typescript
// Widget violates SLA protocol by internally executing Data-fetches, deep-states, and raw UI simultaneously
export const HeaderWidget = () => {
    const { user } = useApi('/user/me');
    return <header><img src={user.avatar} /><button>Logout</button></header>
}
```

### ⚠️ Problem
Rearing monolithic entities via circumventing optimized "lightweight" routines (Logout Actions) and disconnected entities (User Models) directly conjoins Networking, Handling, and UI in a massive, unscalable block.

### ✅ Best Practice
```typescript
import { UserAvatar } from 'entities/user';
import { LogoutButton } from 'features/auth';

// Widget behaves as an orchestration glue
export const HeaderWidget = () => {
    return (
        <header>
            <UserAvatar />
            <LogoutButton />
        </header>
    );
}
```

### 🚀 Solution
The inherent mission and philosophy underlying the `widgets` stratum is high-level grouping and process orchestration. It acts solely to bind numerous Entities (Data) alongside disparate Features (Actions) assembling a perfectly sovereign, ready-to-deploy modular chunk (Headings, Interactive Sidebars, Auth-Panels).

---

<br>

<div align="center">
  <b>Adhere firmly to the principles of Feature-Sliced Design to establish a relentlessly deterministic, radically scalable, and robust foundational codebase! 🚀</b>
</div>
