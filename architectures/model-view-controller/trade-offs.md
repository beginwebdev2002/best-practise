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
