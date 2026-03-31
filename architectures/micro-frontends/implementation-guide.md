---
description: Vibe coding guidelines and architectural constraints for Micro-frontends Implementation Guide within the Architecture domain.
tags: [micro-frontends, architecture, module-federation, frontend, implementation, guide, vibe-coding]
topic: Micro-frontends Implementation Guide
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
technology: Micro-frontends
domain: Architecture
level: Senior/Architect
version: Agnostic
ai_role: Senior Architect
last_updated: 2026-03-22
---

<div align="center">
  # 🛠️ Micro-frontends Implementation Guide
</div>

---

This document defines practical implementation patterns and anti-patterns in the Micro-frontends architecture using 2026 standards.

## 2026 Code Patterns & Anti-patterns

### 1. Tight Routing Coupling (Hardcoded URLs)

#### ❌ Bad Practice
```javascript
// Micro-frontend directly redirecting the user to a specific MFE route
function navigateToCart() {
  window.location.href = '/app/cart';
}
```

#### ⚠️ Problem
Hardcoding URLs within a micro-frontend creates brittle links. If the App Shell changes its routing strategy or paths, the micro-frontend breaks. It violates the boundary principles.

#### ✅ Best Practice
```javascript
// Navigating via agnostic Intent Events
function navigateToCart() {
  const event = new CustomEvent('router:navigate', {
    detail: { routeId: 'cart', params: { source: 'catalog' } }
  });
  window.dispatchEvent(event);
}
```

#### 🚀 Solution
Routing should be fully managed by the App Shell (the Host). Micro-frontends should dispatch "intent" events when they need the user to navigate across MFE boundaries. The App Shell listens, resolves the intent to a physical URL path, and executes the router change safely.

---

### 2. Inconsistent Design and Shared UI

#### ❌ Bad Practice
```javascript
// MFE Auth implements its own Button component
const LoginButton = () => <button style={{ background: 'blue', padding: '10px' }}>Login</button>;

// MFE Catalog implements its own Button component
const AddToCartButton = () => <button style={{ background: 'green', margin: '5px' }}>Add</button>;
```

#### ⚠️ Problem
Without a shared design system, the user experiences disjointed UI elements across different pages of the same application. This degrades UX and creates massive design debt for teams to maintain independently.

#### ✅ Best Practice
```javascript
// Both MFEs consume a federated, versioned Design System
import { Button } from '@company/design-system';

const LoginButton = () => <Button variant="primary">Login</Button>;
const AddToCartButton = () => <Button variant="success">Add to Cart</Button>;
```

#### 🚀 Solution
Establish a centralized, strictly versioned UI Component Library (Design System) that all micro-frontends must consume. This ensures visual consistency while keeping the business logic decoupled.
