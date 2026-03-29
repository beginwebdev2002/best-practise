---
technology: Model-view-controller
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Model-view-controller
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
---

# Model-View-Controller (MVC) - Trade-offs

## Pros, Cons, and System Constraints

### Pros
- **Familiarity**: Easy to understand, widely adopted pattern.
- **Separation of Concerns**: Clear distinction between data, UI, and control logic.
- **Rapid Development**: Excellent for starting MVP applications.
- **Framework Support**: High support across many frameworks (Spring, Express, Rails, Django).

### Cons
- **Scalability**: For very large apps, "fat controllers" and "fat models" become common.
- **Coupling**: Often strong coupling between view and controller.
- **Complexity over time**: Harder to maintain when domains grow too complex, often necessitating a move to DDD or Clean Architecture.

### Boundaries
- Controllers must never execute direct database queries.
- Views must not contain business logic or query the DB.
- Models should not format data for views.
