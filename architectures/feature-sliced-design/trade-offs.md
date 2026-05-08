---
technology: FSD
domain: Architecture
level: Senior/Architect
version: Latest
tags: [fsd, architecture, best-practices, architecture]
ai_role: Senior FSD Expert
last_updated: 2026-03-29
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


### Structural Comparison

| Category | Description |
| :--- | :--- |
| ✅ **Advantage** | **High Cohesion & Low Coupling**: Modules are highly independent. |
| ✅ **Advantage** | **Scalability**: New features can be added without affecting existing ones. |
| ✅ **Advantage** | **Predictability**: Strict rules for dependencies make it easier to find and understand code. |
| ✅ **Advantage** | **Team Collaboration**: Standardized structure allows developers to quickly onboard. |
| ❌ **Disadvantage** | **Steep Learning Curve**: Strict rules require discipline and understanding from the team. |
| ❌ **Disadvantage** | **Overhead for Small Projects**: Can be overly complex for simple applications or MVPs. |
| ❌ **Disadvantage** | **Cross-Feature Communication**: Communicating between features can sometimes be complex and requires careful planning (e.g., using Event Bus or lifting state). |

### Boundaries
- A layer can only import from layers strictly below it.
- Slices within the same layer cannot import from each other directly (use public API).
