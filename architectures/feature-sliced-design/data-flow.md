# Feature-Sliced Design (FSD) - Data Flow

## Request and Event Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Page as Page (UI)
    participant Widget as Widget
    participant Feature as Feature (Action)
    participant Entity as Entity (State)
    participant Shared as Shared (API/Infra)

    User->>Page: Interactions (Click/Input)
    Page->>Widget: Compose Features & Entities
    Widget->>Feature: Trigger Action (e.g. Add to Cart)
    Feature->>Entity: Update Domain State / Selectors
    Feature->>Shared: API Request (if needed)
    Shared-->>Feature: API Response
    Feature-->>Widget: Propagate changes
    Widget-->>Page: Re-render UI
    Page-->>User: Visual Update
```

### Constraints
- Unidirectional flow: State changes must propagate from top to bottom.
- Features encapsulate business logic.
- Entities store domain state.
