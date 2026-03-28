# Feature-Sliced Design (FSD) - Folder Structure

## Layering publisher/subscriber logic

```mermaid
graph TD
    App[app] --> Pages[pages]
    Pages --> Widgets[widgets]
    Widgets --> Features[features]
    Features --> Entities[entities]
    Entities --> Shared[shared]
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Shared component;
    class Features component;
    class Pages layout;
    class App layout;
    class Entities component;
    class Widgets component;
```

### Constraints
- **app**: Global settings, styles, providers.
- **pages**: Composition of widgets and features. Route components.
- **widgets**: Composition layer. Combines features and entities into meaningful blocks.
- **features**: User scenarios, business value actions (e.g., SendMessage, AddToCart).
- **entities**: Business entities (e.g., User, Product, Order).
- **shared**: Reusable UI components, utilities, api setup.
