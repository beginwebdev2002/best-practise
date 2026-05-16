---
technology: Micro-frontends
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [micro-frontends, architecture, module-federation, frontend, scalable, web-components, vibe-coding]
ai_role: Senior Architect
last_updated: 2026-03-22
---

<div align="center">
  # 🧩 Micro-frontends Production-Ready Best Practices
</div>

---

This engineering directive defines the **best practices** for the Micro-frontends architecture. This document is designed to ensure maximum scalability, security, and code quality when developing enterprise-level frontend applications.

# Context & Scope
- **Primary Goal:** Provide strict architectural rules and practical patterns for breaking down a monolithic frontend into independent, deployable micro-applications.
- **Description:** An architectural style where independently deliverable frontend applications are composed into a greater whole. This enables multiple teams to work simultaneously without stepping on each other's toes.

## Map of Patterns
- 📊 [**Data Flow:** Request and Event Lifecycle](./data-flow.md)
- 📁 [**Folder Structure:** Layering logic](./folder-structure.md)
- ⚖️ [**Trade-offs:** Pros, Cons, and System Constraints](./trade-offs.md)
- 🛠️ [**Implementation Guide:** Code patterns and Anti-patterns](./implementation-guide.md)

## Core Principles

1. **Independent Deployments:** Each micro-frontend must be deployable on its own without requiring a redeployment of the entire system.
> [!IMPORTANT]
> 2. **Technology Agnostic (Optional but powerful):** Different teams MUST use different frameworks (React, Vue, Angular) if necessary, though standardization is MANDATORY for performance.
> [!IMPORTANT]
> 3. **Isolated State:** Micro-frontends MUST not share global state directly; communication must be handled via established protocols (e.g., Custom Events, Window, Event Bus).
> [!IMPORTANT]
> 4. **Resilience:** Failure in one micro-frontend MUST not crash the entire application (graceful degradation).

```mermaid
graph LR
    Deploy[Independent Deployments] --- TechAgnostic[Technology Agnostic]
    TechAgnostic --- State[Isolated State]
    State --- Resilience[Resilience & Graceful Degradation]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    class Deploy,TechAgnostic,State,Resilience default;
```

---

## 1. Global State Coupling

### ❌ Bad Practice
```javascript
// Micro-frontend A directly mutating global window object for state sharing
window.__APP_STATE__ = {
  user: { id: 1, name: "Alice" },
  cart: [{ item: "Laptop", price: 1000 }]
};

// Micro-frontend B strictly depending on this global state
const cart = window.__APP_STATE__.cart;
```

### ⚠️ Problem
Directly mutating and depending on global objects like `window` creates tight coupling between micro-frontends. This leads to race conditions, unpredictable state mutations, and makes isolated testing impossible. It destroys the independence of micro-frontends.

### ✅ Best Practice
```javascript
// Using an Event Bus or Custom Events for decoupled communication

// Micro-frontend A (Publisher)
const event = new CustomEvent('cart:itemAdded', {
  detail: { item: "Laptop", price: 1000 }
});
window.dispatchEvent(event);

// Micro-frontend B (Subscriber)
window.addEventListener('cart:itemAdded', (event) => {
  const { item, price } = event.detail;
  updateCartUI(item, price);
});
```

### 🚀 Solution
Communication between micro-frontends must be asynchronous and event-driven. Using standard DOM events (CustomEvents) ensures that micro-frontends remain entirely decoupled. The publisher doesn't need to know if subscribers exist, and subscribers only react to explicit, documented contracts.

---

## Architecture Diagram

```mermaid
graph TD
    AppShell[App Shell / Host] --> MFE_Auth[Micro-frontend: Auth]
    AppShell --> MFE_Catalog[Micro-frontend: Catalog]
    AppShell --> MFE_Checkout[Micro-frontend: Checkout]

    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class AppShell layout;
    class MFE_Auth component;
    class MFE_Catalog component;
    class MFE_Checkout component;
```
