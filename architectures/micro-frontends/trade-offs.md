---
technology: Micro-frontends
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [micro-frontends, architecture, module-federation, frontend, trade-offs, constraints, vibe-coding]
ai_role: Senior Architect
last_updated: 2026-03-22
---

<div align="center">
  # ⚖️ Micro-frontends Trade-offs
</div>

---

This document defines the pros, cons, and system constraints in the Micro-frontends architecture.

## Evaluated Pros & Cons

### 🚧 1. Excessive Dependency Duplication

#### ❌ Bad Practice
```javascript
// Every micro-frontend independently packages 'react' and 'react-dom'
// MFE Auth bundle size: 2MB (React included)
// MFE Catalog bundle size: 3MB (React included)
```

#### ⚠️ Problem
If every micro-frontend builds and ships its own core dependencies (like React, Angular, or Lodash), the user's browser ends up downloading the exact same libraries multiple times. This destroys frontend performance, increases Time-to-Interactive (TTI), and causes memory bloat.

#### ✅ Best Practice
```javascript
// Webpack 5 Module Federation configuration in App Shell
plugins: [
  new ModuleFederationPlugin({
    name: "app_shell",
    shared: {
      react: { singleton: true, eager: true, requiredVersion: deps.react },
      "react-dom": { singleton: true, eager: true, requiredVersion: deps["react-dom"] },
    },
  }),
]
```

#### 🚀 Solution
Utilize Webpack 5 Module Federation (or similar tools like Vite Federation) to specify `shared` dependencies. By marking frameworks as singletons, the browser downloads the dependency only once, sharing it across all micro-frontends dynamically at runtime.

---

## Constraints Checklist
- **System Governance:** Do you have robust CI/CD pipelines to manage 10+ independent deployments?
- **Team Size:** Micro-frontends add overhead. They are designed for large organizations (e.g., 30+ frontend engineers) divided into autonomous squads. Avoid for small MVPs.
- **Testing Complexity:** End-to-End (E2E) testing becomes significantly harder because the true application only exists at runtime.
