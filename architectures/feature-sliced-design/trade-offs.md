---
technology: Feature-sliced-design
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
description: AI agent blueprint constraint
topic: Feature-sliced-design
complexity: Architect
last_evolution: 2026-03-22
vibe_coding_ready: true
---

# Feature-Sliced Design (FSD) - Trade-offs

## Pros, Cons, and System Constraints

### Pros
- **High Cohesion & Low Coupling**: Modules are highly independent.
- **Scalability**: New features can be added without affecting existing ones.
- **Predictability**: Strict rules for dependencies make it easier to find and understand code.
- **Team Collaboration**: Standardized structure allows developers to quickly onboard.

### Cons
- **Steep Learning Curve**: Strict rules require discipline and understanding from the team.
- **Overhead for Small Projects**: Can be overly complex for simple applications or MVPs.
- **Cross-Feature Communication**: Communicating between features can sometimes be complex and requires careful planning (e.g., using Event Bus or lifting state).

### Boundaries
- A layer can only import from layers strictly below it.
- Slices within the same layer cannot import from each other directly (use public API).
