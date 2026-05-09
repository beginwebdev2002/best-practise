---
technology: Fastify
domain: backend
level: Senior/Architect
version: "4.x / 5.x"
tags: [best-practices, deterministic-code, fastify, vibe-coding, cursor-rules, typescript, software-architecture, system-design, mvc, production-ready, programming-standards, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, enterprise-patterns, backend]
ai_role: Senior Fastify Architecture Expert
last_updated: 2026-03-27
---

# 🏗️ Fastify Architecture Best Practices

[⬅️ Back to Parent](./readme.md)

## 1. 🛑 Global Middleware Soup
### ❌ Bad Practice
```typescript
// Applying heavy logic to every request regardless of route
fastify.addHook('onRequest', async (request, reply) => {
  await someHeavyDatabaseCheck(request.headers.token);
});
```
### ⚠️ Problem
Using global `onRequest` hooks for heavy operations, like database checks, blocks the Node.js event loop and drastically reduces Fastify's performance advantages. This pattern creates unnecessary bottlenecks for unauthenticated or static routes.
### ✅ Best Practice
```typescript
// Plugin encapsulation for scoped execution
import fp from 'fastify-plugin';

const authPlugin = fp(async (fastify, opts) => {
  fastify.decorate('verifyToken', async (request, reply) => {
    // Perform targeted check
  });
});

// Apply ONLY to necessary routes
fastify.get('/secure', { preHandler: [fastify.verifyToken] }, async (request, reply) => {
  return { secure: true };
});
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Fastify Index](./readme.md).

### 🚀 Solution
STRICTLY encapsulate cross-cutting concerns (like authentication or tenant resolution) inside fastify-plugins and apply them specifically as `preHandler` hooks to targeted routes rather than globally.

## 2. 🗂️ Architectural Workflow

```mermaid
graph TD
    A[Plugin Registration] --> B[Encapsulated Context]
    B --> C[Route Handlers]
    B --> D[Decorators]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class A layout;
    class B component;
    class C component;
    class D component;
```
