---
description: Instructions for the Jules AI agent regarding backend code. Contains rules for server architecture, DTO standards, and SEO metadata.
tags: [backend architecture, clean APIs, scalable server, typescript best practices, production-ready, enterprise-grade, node-js, nestjs, expressjs]
---

# 🛡️ Backend Architecture & Clean APIs Rules for Jules

## 1. Context & Scope
- **Primary Goal:** Ensure the implementation of best practices for the backend part of the project. Establish standards for **scalable server** deployments, **clean APIs**, and **enterprise-grade** solutions.
- **Target Tooling:** Jules AI agent (Vibe Coding, AI-Driven Development).
- **Tech Stack Version:** Node.js, NestJS, ExpressJS, TypeScript.

<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NodeJS-Dark.svg" alt="Backend Architecture Logo" width="100" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NestJS-Dark.svg" alt="NestJS Logo" width="100" />
  
  **Standards for creating production-ready backend systems.**
</div>

---

## 2. Key Architecture Rules (Backend Architecture)

> [!CAUTION]
> **ORM Isolation:** Strict rule — never allow Object-Relational Mapping (ORM) models (Database Entities) to leak into HTTP responses. Always convert database entities into DTOs (Data Transfer Objects) before sending them to the client.

Use the following **typescript best practices** principles to ensure security and clean architecture:

1. **Schema Validation:** Always implement validation (such as Class-Validator or Zod) to verify the shape of the data. Consider all input data as potentially harmful.
2. **TypeScript Strictness:** The `any` type is strictly prohibited.
3. **Layer Isolation:** Separate the controllers layer (Transport Layer, managing HTTP requests) from the business logic layer (Service Layer, managing application rules).

### Typical Data Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Repository
    participant Database

    Client->>Controller: HTTP Request (JSON data)
    note over Controller: DTO Validation (Clean APIs)
    Controller->>Service: Call processing method
    note over Service: Business logic execution (Scalable Server)
    Service->>Repository: Request or save data
    Repository->>Database: SQL/NoSQL Query execution
    Database-->>Repository: Raw database entity returned
    Repository-->>Service: Domain Model returned
    Service-->>Controller: DTO returned
    Controller-->>Client: HTTP Response sent
```

---

## 3. Code Writing Requirements for Jules

- [ ] **Isolation:** Every feature must have its own separate Module, Controller, Service, and DTO.
- [ ] **Error Handling:** Use global exception filters. Never use bare `try/catch` blocks that expose system information and stack traces to the user.
- [ ] **Security:** Verify user roles and permissions (using Guards) at the controller level before executing any logic.

### Supported Technologies
| Technology | Description | Primary Purpose |
| :--- | :--- | :--- |
| **NestJS** | Framework for enterprise-grade applications | Modular architecture, Dependency Injection (DI), Clean Architecture |
| **ExpressJS** | Micro-framework for fast APIs | Speed, minimal footprint, middleware support |
| **TypeORM / Prisma** | Database interaction tools | Strict type validation for database queries |
