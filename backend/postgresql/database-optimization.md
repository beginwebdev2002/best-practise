---
technology: PostgreSQL
domain: backend
level: Senior/Architect
version: "16+"
tags: [best-practices, deterministic-code, architecture-patterns, vibe-coding, postgresql, database, sql, rdbms, system-design, production-ready, scalable-code]
ai_role: Senior PostgreSQL Database Architect
last_updated: 2026-03-27
---

# 🐘 PostgreSQL Database Optimization

[⬅️ Back to Parent](./readme.md)


## 1. 🛑 Missing Indexes on Foreign Keys
### ❌ Bad Practice
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total DECIMAL
);
-- No index on user_id
```
### ⚠️ Problem
Failing to index foreign keys results in full table scans during joins and cascading deletes, leading to exponential performance degradation as data grows.
### ✅ Best Practice
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total DECIMAL
);
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

> [!NOTE]
> **Internal Routing:** For more context, refer back to the [Postgresql Index](./readme.md).

### 🚀 Solution
Always create explicit indexes on foreign key columns and frequently queried fields to ensure deterministic query execution times (O(log n) vs O(n)).

## 2. 🗂️ Architectural Workflow

```mermaid
graph TD
    A[Query Planner] --> B[Index Scan]
    B --> C[(Table Data)]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class A layout;
    class B component;
    class C component;
```
