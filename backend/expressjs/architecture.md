---
technology: Express.js
domain: backend
level: Senior/Architect
version: "4.x / 5.x"
tags: [best-practices, deterministic-code, expressjs, vibe-coding, cursor-rules, javascript, typescript, software-architecture, system-design, mvc, production-ready, programming-standards, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, enterprise-patterns, backend]
ai_role: Senior Express.js Architecture Expert
last_updated: 2026-05-10
---

# 🏗️ Express.js Architecture Best Practices

[⬅️ Back to Parent](./readme.md)


## 1. 🛑 God Controllers
### ❌ Bad Practice
```javascript
app.post('/users', async (req, res) => {
  // Parsing logic
  // Validation logic
  // DB query
  // Send email
  // Return response
});
```
### ⚠️ Problem
Mixing routing, business logic, and data access in a single function violates the Single Responsibility Principle, making the code impossible to unit test and maintain.
### ✅ Best Practice
```javascript
// Controller merely orchestrates
const userController = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
app.post('/users', userController);
```
> [!NOTE]
> **Internal Routing:** [./readme.md](./readme.md)


> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Expressjs Index](./readme.md).

### 🚀 Solution
Implement the layered architecture pattern. Controllers handle HTTP concerns, Services handle business rules, and Repositories handle database interactions.

## 2. 🗂️ Architectural Workflow

```mermaid
graph TD
    A[Router] --> B[Controller]
    B --> C[Service Layer]
    C --> D[Data Access Layer]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class A layout;
    class B component;
    class C component;
    class D component;
```
