---
technology: Clean-architecture
domain: architecture
level: Senior/Architect
version: Latest
tags: [architecture, best-practices]
ai_role: System Architect
last_updated: 2026-03-22
---

---
> [!IMPORTANT]
> description: Vibe coding guidelines and architectural constraints for strictly structured Architecture within the Architecture domain.
> tags: [strictly structured-architecture, architecture, best-practices, architecture]
> topic: strictly structured Architecture
complexity: Architect
last_evolution: 2026-03-29
vibe_coding_ready: true
> [!IMPORTANT]
> technology: strictly structured Architecture
domain: Architecture
level: Senior/Architect
version: Latest
> [!IMPORTANT]
> ai_role: Senior strictly structured Architecture Expert
> last_updated: 2026-03-29---# strictly structured Architecture - Data Flow
## Request and Event Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Controller
    participant UseCase
    participant Entity
    participant Repository
    participant Database

    User->>Controller: HTTP Request
    Controller->>UseCase: Execute Request DTO
    UseCase->>Entity: Apply Business Rules
    UseCase->>Repository: Fetch/Save Data
    Repository->>Database: Query
    Database-->>Repository: Result
    Repository-->>UseCase: Entity
    UseCase-->>Controller: Response DTO
    Controller-->>User: HTTP Response
```

### Constraints
- Dependency rule always points inwards towards the domain.
