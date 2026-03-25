---
description: Vibe coding guidelines and architectural constraints for General Architecture within the architecture domain.
technology: General Architecture
domain: architecture
level: Senior/Architect
version: Agnostic
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior Software Architect
last_updated: 2026-03-22
---

# Architecture Best Practices & Production-Ready Patterns

# Context & Scope
- **Primary Goal:** Establish definitive rules and best practices for system design and architecture.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Agnostic

<div align="center">
  <img src="https://img.icons8.com/?size=100&id=102832&format=png&color=000000" width="100" alt="Architecture Logo">
  
  **The foundation for scalable, maintainable, and reliable applications.**
</div>

---

## 🌟 The Importance of Architecture in Modern Projects

In a world where application logic becomes more complex every day, **Architecture** is not just a folder structure; it is the set of laws by which your code lives. A proper architecture solves three key problems:
1. **Scalability:** Allows a project to grow alongside its team and features without turning into unmaintainable spaghetti code.
2. **Collaboration:** Lowers the barrier to entry for new developers (since everything has a strictly defined place) and reduces merge conflicts.
3. **Isolation & Testability:** Changing a single feature doesn't break the entire business process, because the logic is isolated from the UI and third-party libraries.

Without strict architecture, even the most modern frameworks (Angular, React, Vue, NestJS) quickly become unmanageable.

---

## 💡 Best Tips for Choosing an Architecture

Don't know where to start? Here are a few golden rules:
- **Consider Project Scope:** For simple MVPs and pet projects, a classic *MVC* or *Monolith* is perfect. Don't overengineer your project with *Microservices* right from the start.
- **Separation of Concerns:** Whichever architecture you choose, always decouple how data is stored (DB) from how it is displayed (UI).
- **Match Your Team's Expertise:** Choose the approach that your team understands or is ready to learn. If everyone knows React inside out, use *FSD*. Lone wolves ruin team productivity.
- **Embrace Change:** The perfect architecture allows you to painlessly swap your database (e.g., PostgreSQL for MongoDB) or your UI component library without rewriting the core.

---

## 🏆 Top 10 Best Architectural Approaches

Below are the most popular architectural patterns along with examples, tips, technology stacks, and their logos. A Folder Tree is provided for each to give you a deep understanding of its structure.

---

### 1. Feature-Sliced Design (FSD)
<img src="https://feature-sliced.design/img/brand/logo-primary.png" width="80" alt="FSD Logo"/>

**Description:** A modern architectural methodology for Frontend applications. It separates code by business meaning (features) and technical layers. It ensures strict unidirectional isolation.

**Architecture Diagram & Folder Tree:**
```mermaid
graph TD
    App[app] --> Pages[pages]
    Pages --> Widgets[widgets]
    Widgets --> Features[features]
    Features --> Entities[entities]
    Entities --> Shared[shared]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Shared component;
    class Features component;
    class Pages component;
    class App component;
    class Entities component;
    class Widgets component;

```

```text
src/
├── 📁 app/        # Global app setup (Global Store, Global CSS, Router init)
├── 📁 pages/      # Pages and Routing
├── 📁 widgets/    # Complex, independent UI blocks (Header, Footer)
├── 📁 features/   # Business-value user actions (UserAuth, AddToCart)
├── 📁 entities/   # Core business entities (User, Product)
└── 📁 shared/     # Reusable code (UI-components, API, utils)
```

**Best Compatibility:**
- **Frameworks:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="16"/> React, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" width="16"/> Vue, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg" width="16"/> Angular
- **Languages:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="16"/> TypeScript
- **Patterns / Principles:** Public API, Low Coupling, High Cohesion.
- **Tools/Libraries:** Redux Toolkit, Zustand, React Router.

---

### 2. Clean Architecture
[![Clean Arch](https://img.shields.io/badge/Clean_Architecture-black?style=flat-square)](#)

**Description:** A concept created by Robert C. Martin (Uncle Bob). It separates a project into concentric rings. The main rule is the Dependency Rule: dependencies can only point inward (towards core business entities).

**Architecture Diagram & Folder Tree:**
```mermaid
graph TD
    Infrastructure[Infrastructure] --> InterfaceAdapters[Interface Adapters]
    InterfaceAdapters --> UseCases[Use Cases]
    UseCases --> Domain[Domain Entities]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Infrastructure component;
    class InterfaceAdapters component;
    class UseCases component;
    class Domain component;

```

```text
src/
├── 📁 domain/               # The heart of the system: Entities and Interfaces
├── 📁 usecases/             # Business Scenarios (Interactors) - "What the system does"
├── 📁 interface-adapters/   # Controllers, Presenters, Gateways (Data translators)
└── 📁 infrastructure/       # The outside world: DB Repositories, Frameworks, UI
```

**Best Compatibility:**
- **Frameworks:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="16"/> NestJS, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg" width="16"/> Spring Boot
- **Languages:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" width="16"/> C#, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" width="16"/> Java, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="16"/> TypeScript
- **Patterns / Principles:** SOLID, Dependency Injection (DI), Repository.
- **Tools/Libraries:** ORMs (TypeORM, Prisma).

---

### 3. MVC (Model-View-Controller)
[![MVC](https://img.shields.io/badge/Pattern-MVC-blue?style=flat-square)](#)

**Description:** The classic design pattern for user-facing applications. It separates data logic (`Model`), presentation (`View`), and user action handling (`Controller`).

**Architecture Diagram & Folder Tree:**
```mermaid
graph LR
    User --> Controller
    Controller --> Model
    Model --> View
    View --> User
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class View component;
    class Controller component;
    class User component;
    class Model component;

```

```text
src/
├── 📁 models/        # Database schemas and data manipulation methods
├── 📁 views/         # Templates (HTML, Pug, EJS) or React views
├── 📁 controllers/   # HTTP request handlers bridging Model and View
└── 📁 routes/        # API endpoint definitions (URLs)
```

**Best Compatibility:**
- **Frameworks:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" width="16"/> Express.js, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rubyonrails/rubyonrails-original.svg" width="16"/> Ruby on Rails, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" width="16"/> Laravel, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" width="16"/> Django
- **Languages:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg" width="16"/> Ruby, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" width="16"/> PHP, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" width="16"/> Python
- **Patterns / Principles:** Active Record, REST, DRY.

---

### 4. Microservices
<img src="https://img.icons8.com/?size=100&id=D0aIuUaQjZzR&format=png&color=000000" width="40" alt="Microservices"/>

**Description:** Breaking down a giant monolithic system into small, independent pieces, each handling its own business capability. Each service has its own Database and communicates via REST, gRPC, or events.

**Architecture Diagram & Folder Tree:**
```mermaid
graph TD
    Client --> Gateway[API Gateway]
    Gateway --> Auth[Auth Service]
    Gateway --> Order[Order Service]
    Gateway --> Pay[Payment Service]
    Gateway --> Notif[Notification Service]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Order component;
    class Client component;
    class Auth component;
    class Notif component;
    class Gateway component;
    class Pay component;

```

```text
microservices-cluster/
├── 📁 auth-service/         # Authentication Microservice (w/ PostgreSQL)
├── 📁 order-service/        # Orders Microservice (w/ MongoDB)
├── 📁 payment-service/      # Transaction logic layer
├── 📁 notification-service/ # Email and Push notifications
└── 📁 api-gateway/          # Router for all external client requests
```

**Best Compatibility:**
- **Frameworks:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg" width="16"/> Spring Boot (Netflix OSS), <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="16"/> NestJS (Microservices module)
- **Languages:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" width="16"/> Go, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" width="16"/> Java, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="16"/> Node.js
- **Patterns / Principles:** API Gateway, Circuit Breaker, Saga Pattern.
- **Tools:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" width="16"/> Docker, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg" width="16"/> Kubernetes, gRPC.

---

### 5. Hexagonal Architecture (Ports & Adapters)
[![Hexagonal](https://img.shields.io/badge/Ports_&_Adapters-purple?style=flat-square)](#)

**Description:** A logical evolution of Clean Architecture. The core of the system is isolated from specific technologies. All interaction with databases, UI, and side-effects happens through "Ports" (Interfaces), satisfying via "Adapters" (Implementations).

**Architecture Diagram & Folder Tree:**
```mermaid
graph TD
    Primary[Primary Adapters] --> PortsIN[Ports: Input]
    PortsIN --> Domain[Core Domain]
    Domain --> PortsOUT[Ports: Output]
    PortsOUT --> Secondary[Secondary Adapters]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class PortsOUT component;
    class PortsIN component;
    class Primary component;
    class Domain component;
    class Secondary component;

```

```text
src/
├── 📁 core/                 # Ports (Interfaces) and strict Domain
│   ├── 📁 ports/            # IUserRepository.ts
│   └── 📁 domain/           # Business rules for the application
└── 📁 adapters/             # Concrete implementations (Adapters)
    ├── 📁 primary/          # HTTP Controllers, GraphQL (System Entry)
    └── 📁 secondary/        # MongoAdapter.ts, PostgresAdapter.ts (System Exit)
```

**Best Compatibility:**
- **Frameworks:** Any strictly-typed IoC frameworks.
- **Languages:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="16"/> TypeScript, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg" width="16"/> C#
- **Patterns / Principles:** SOLID, Dependency Inversion (D in SOLID), Adapter.

---

### 6. DDD (Domain-Driven Design)
[![DDD](https://img.shields.io/badge/Architecture-DDD-darkred?style=flat-square)](#)

**Description:** A philosophy and design approach centered entirely around the business "Domain". The whole team communicates using a "Ubiquitous Language," and domains are split into `Bounded Contexts`.

**Architecture Diagram & Folder Tree:**
```mermaid
graph TD
    Context1[Identity & Access] --> C1Domain[Domain]
    Context1 --> C1App[Application]
    Context1 --> C1Infra[Infrastructure]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class C1Infra component;
    class C1Domain component;
    class Context1 component;
    class C1App component;

```

```text
src/
├── 📁 identity-access/      # Bounded Context (Auth domain)
│   ├── 📁 domain/           # Aggregates, Value Objects, Entities
│   ├── 📁 application/      # Command Handlers (Business Use Cases)
│   └── 📁 infrastructure/   # DB Repositories
└── 📁 content-management/   # Bounded Context (Articles domain)
    ├── 📁 domain/
    └── ...
```

**Best Compatibility:**
- **Frameworks:** Complex Backend ERP or Banking systems.
- **Languages:** Highly-typed OOP languages (Java, C#, TypeScript).
- **Patterns / Principles:** Bounded Contexts, Value Objects, Aggregates.

---

### 7. Event-Driven Architecture (EDA)
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg" width="30" alt="Kafka Logo"/> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/RabbitMQ_logo.svg/100px-RabbitMQ_logo.svg.png" width="20" alt="RabbitMQ"/>

**Description:** System components know nothing about each other (Low Coupling). They merely "publish" events and "subscribe" to them, reacting asynchronously. Ideal for high-load, highly-scalable backend systems.

**Architecture Diagram & Folder Tree:**
```mermaid
graph LR
    Pub[Publisher] --> Broker[Message Broker]
    Broker --> Sub1[Subscriber 1]
    Broker --> Sub2[Subscriber 2]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Sub1 component;
    class Sub2 component;
    class Broker component;
    class Pub component;

```

```text
src/
├── 📁 publishers/           # Generate events (e.g., OrderPayedEvent)
├── 📁 subscribers/          # Listen to events (e.g., NotifyUserListener)
├── 📁 events/               # Type definitions for event payloads
└── 📁 brokers/              # Connection configurations to message brokers
```

**Best Compatibility:**
- **Frameworks/Platforms:** Node.js, Spring Cloud.
- **Tools/Libraries:** Apache Kafka, RabbitMQ, Redis Pub/Sub, AWS EventBridge.
- **Patterns / Principles:** Pub/Sub, Async Communication, Event Sourcing.

---

### 8. Serverless (Function-as-a-Service / FaaS)
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="40" alt="AWS"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg" width="20" alt="GCP"/>

**Description:** Developers do not manage servers at all. The entire "server" consists of bite-sized pieces of business logic (functions/Lambdas) living in the cloud, executed only via triggers. You pay solely for compute execution time.

**Architecture Diagram & Folder Tree:**
```mermaid
graph TD
    Trigger[Event Trigger] --> Func1[Function 1]
    Trigger2[HTTP Request] --> Func2[Function 2]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Func1 component;
    class Trigger component;
    class Func2 component;
    class Trigger2 component;

```

```text
project-functions/
├── 📁 user-signup/        # Cloud Function (Lambda) for registration
│   ├── index.js           # Function entry point (exports.handler)
│   └── package.json       # Dependencies specific to this function alone
├── 📁 process-payment/    # Cloud Function to process Stripe payments
└── serverless.yml         # Deployment config for AWS / GCP (Serverless Framework)
```

**Best Compatibility:**
- **Frameworks:** Serverless Framework, AWS SAM. Clouds: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg" width="16"/> Firebase, Vercel Functions.
- **Languages:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="16"/> Node.js, Python, Go (Languages with fast cold starts).
- **Patterns / Principles:** Backend-as-a-Service (BaaS), Vendor Lock-in (use cautiously).

---

### 9. Monolithic Architecture
[![Monolithic](https://img.shields.io/badge/Architecture-Monolithic-brown?style=flat-square)](#)

**Description:** The entire system components (Database, Message Queues, Business Logic, APIs) are deployed and operated from a single codebase on a single server. This is the optimal start for startups to avoid unnecessary complexity upfront. 

**Architecture Diagram & Folder Tree:**
```mermaid
graph TD
    Project[Monolithic App] --> UI[Public / UI]
    Project --> Logic[Business Logic]
    Project --> Data[Database]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class Logic component;
    class Data component;
    class UI component;
    class Project component;

```

```text
monolith-app/
├── 📁 public/        # Static files for the server (incl. bundled React UI)
├── 📁 config/        # Environment configurations (DB, S3)
├── 📁 src/           # All business logic (Controllers, Services)
└── 📁 workers/       # Background processes (e.g., Queue processing)
```

**Best Compatibility:**
- **Frameworks:** Django, Ruby on Rails, NestJS (without microservices).
- **Languages:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" width="16"/> Python, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" width="16"/> PHP, <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg" width="16"/> Ruby.
- **Patterns / Principles:** Three-Tier Architecture, KISS, YAGNI.

---

### 10. CQRS (Command Query Responsibility Segregation)
[![CQRS](https://img.shields.io/badge/Pattern-CQRS-teal?style=flat-square)](#)

**Description:** A powerful pattern where Commands (actions that mutate system data) are entirely decoupled from Queries (actions that only read data). This separation enables extremely sophisticated load distribution.

**Architecture Diagram & Folder Tree:**
```mermaid
graph LR
    UI --> Command[Command]
    Command --> WriteDB[(Write DB)]
    UI --> Query[Query]
    Query --> ReadDB[(Read DB)]
    WriteDB -. sync .-> ReadDB
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class WriteDB component;
    class Query component;
    class ReadDB component;
    class Command component;
    class UI component;

```

```text
src/
├── 📁 commands/           # Mutates system state
│   ├── CreateUserCommand.ts   # The incoming data structure
│   └── CreateUserHandler.ts   # Logic: Writes to the heavy Main DB (Postgres)
└── 📁 queries/            # Exclusively reading data
    ├── GetUserQuery.ts
    └── GetUserHandler.ts      # Logic: Reads from a blazing fast DB (Elastic/Redis)
```

**Best Compatibility:**
- **Frameworks:** NestJS (`@nestjs/cqrs`), MediatR (.NET).
- **Languages:** Strongly-typed languages (TypeScript, C#).
- **Patterns / Principles:** Event Sourcing, CQS, Mediator.
- **Tools/Databases:** <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" width="16"/> PostgreSQL (Command DB), <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg" width="16"/> ElasticSearch or Redis (Query DB).
