---
technology: Event Sourcing
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, implementation, event-sourcing, best-practices]
ai_role: Senior Architect
last_updated: 2026-03-29
---

<div align="center">
  # 🛠️ Event Sourcing Implementation Guide
</div>

---

## 🚧 1. Mutating Existing Events

### ❌ Bad Practice
```typescript
// Updating an existing event in the event store because data was incorrect
async function fixUserName(userId: string, newName: string) {
  // Directly mutating the historical fact
  await db.events.update(
    { aggregateId: userId, type: 'UserCreated' },
    { $set: { 'data.name': newName } }
  );
}
```

### ⚠️ Problem
Directly mutating an event in the Event Store violates the fundamental rule of Event Sourcing: the event log must be strictly append-only and immutable. Modifying past events corrupts the audit trail, invalidates existing read models that already processed the old event, and destroys the ability to deterministically reconstruct state.

### ✅ Best Practice
```typescript
// Emitting a new compensating event to correct the state
async function fixUserName(userId: string, newName: string) {
  const user = await userRepository.getById(userId);

  // The aggregate emits a new fact
  user.correctName(newName);

  // A new 'UserNameCorrected' event is appended to the log
  await userRepository.save(user);
}
```

### 🚀 Solution
Treat the Event Store as an immutable ledger. If an error was made in the past, you MUST NOT change the historical record. Instead, issue a new compensating event (e.g., `UserNameCorrected` or `OrderRefunded`) that represents the business action taken to fix the state. This preserves the truth of what actually happened in the system.
