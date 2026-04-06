---
technology: Backend-For-Frontend (BFF)
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [architecture, system-design, bff, backend-for-frontend, best-practices]
ai_role: Senior Architect
last_updated: 2026-03-29
---

<div align="center">
  # 🏛️ Backend-For-Frontend (BFF) Production-Ready Best Practices
</div>

---

This engineering directive defines the **best practices** for the Backend-For-Frontend (BFF) architecture. This document is designed to ensure maximum scalability, security, and code quality when developing applications that require tailored APIs for different clients (e.g., web, mobile).

# Context & Scope
- **Primary Goal:** Provide strict architectural rules and practical patterns for creating specialized backend services dedicated to specific frontend applications.
- **Description:** A pattern where a separate backend service is created for each specific frontend application or interface type, rather than having a single general-purpose API backend for all clients.

## Map of Patterns
- 📊 [**Data Flow:** Request and Event Lifecycle](./data-flow.md)
- 📁 [**Folder Structure:** Layering logic](./folder-structure.md)
- ⚖️ [**Trade-offs:** Pros, Cons, and System Constraints](./trade-offs.md)
- 🛠️ [**Implementation Guide:** Code patterns and Anti-patterns](./implementation-guide.md)

## Core Principles

1. **Client Focus:** Each BFF is built and maintained by the same team that builds the frontend client.
2. **Aggregation:** The BFF orchestrates and aggregates calls to various downstream microservices.
3. **Resilience:** The BFF must gracefully handle failures from downstream services, ensuring a seamless user experience.
