---
technology: Backend-For-Frontend (BFF)
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, implementation, bff, backend-for-frontend]
ai_role: Senior Architect
last_updated: 2026-03-29
---

<div align="center">
  # 🛠️ Backend-For-Frontend (BFF) Implementation Guide
</div>

---

## 1. Concurrent Downstream Calls

### ❌ Bad Practice
```typescript
// Sequential API calls block execution and increase latency
async function getDashboardData(userId: string) {
  const user = await userClient.getUser(userId); // Takes 500ms
  const orders = await orderClient.getOrders(userId); // Takes 500ms

  // Total execution time: 1000ms
  return { user, orders };
}
```

### ⚠️ Problem
Making sequential requests to independent downstream microservices drastically increases the total response time. The BFF becomes a bottleneck, degrading the client experience instead of improving it.

### ✅ Best Practice
```typescript
// Parallel execution using Promise.all
async function getDashboardData(userId: string) {
  const [user, orders] = await Promise.all([
    userClient.getUser(userId).catch(err => handlePartialFailure(err, 'user')),
    orderClient.getOrders(userId).catch(err => handlePartialFailure(err, 'orders'))
  ]);

  // Total execution time: ~500ms (bound by the slowest request)
  return { user, orders };
}
```

### 🚀 Solution
Always use `Promise.all()` (or equivalent parallel execution features in your language) to call independent downstream services concurrently. Furthermore, wrap these calls in error handlers (`.catch()`) to prevent a single downstream failure from crashing the entire aggregated response, enabling graceful degradation.
