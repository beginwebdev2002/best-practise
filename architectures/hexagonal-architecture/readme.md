---
technology: Hexagonal Architecture
domain: Architecture
level: Senior/Architect
version: Agnostic
tags: [best-practices, clean-code, hexagonal-architecture, ports-and-adapters, system-design, vibe-coding]
ai_role: Senior Software Architect
last_updated: 2026-03-22
---

# 🛑 Hexagonal Architecture Production-Ready Best Practices
# 🎯 Context & Scope
- **Primary Goal:** Document and execute the best practices for the Hexagonal Architecture pattern.
- **Target Tooling:** AI Agents and Human Developers.
- **Tech Stack Version:** Agnostic

<div align="center">
  <img src="https://img.icons8.com/?size=100&id=102832&format=png&color=000000" width="100" alt="Hexagonal Architecture Logo">

  **Ports and Adapters for scalable, testable code.**
</div>
---
## 🗺️ Map of Patterns (Hexagonal Modules)

This pattern documentation has been decomposed into specialized modules for zero-approval AI parsing and human comprehension.

- 🌊 **[Data Flow](./data-flow.md):** Understand the execution paths and sequences.
- 📁 **[Folder Structure](./folder-structure.md):** The strict directory blueprints.
- ⚖️ **[Trade-offs](./trade-offs.md):** Pros, cons, and architectural constraints.
- 🛠️ **[Implementation Guide](./implementation-guide.md):** Step-by-step rules and code constraints for Vibe Coding.

```mermaid
flowchart TD
    A[External System/User] -->|Calls Port| B(Adapter)
    B -->|Implements Port| C{Domain Logic}
    C -->|Requires Port| D(Adapter)
    D -->|Talks to| E[Database/External API]

    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    class A,B,C,D,E default;
```

## 🚀 The Core Philosophy

Hexagonal Architecture (Ports & Adapters) ensures the core business logic is isolated from specific external technologies.
All interactions with the DB, UI, or other systems happen through **Ports** (interfaces), and are fulfilled by **Adapters** (concrete implementations).

> **AI Constraint:** Always generate the Core Domain first. The Domain must have ZERO dependencies on frameworks or libraries (except language core features).

## 🚧 1. Domain Logic Depending on External Adapters

### ❌ Bad Practice
```typescript
// Core Domain Service
import { S3Uploader } from '../../adapters/aws-s3.adapter';

export class ProcessDocumentService {
  constructor(private readonly s3Uploader: S3Uploader) {}

  async process(file: Buffer) {
    // Domain logic is strictly coupled to AWS S3 implementation
    const url = await this.s3Uploader.upload(file);
    return { status: 'processed', url };
  }
}
```

### ⚠️ Problem
The Core Domain is directly importing and depending on a specific technical implementation (`AWS S3`). If the project migrates to Azure or GCP, the core business logic must be rewritten. Testing requires a live S3 connection or complex module mocking.

### ✅ Best Practice
```typescript
// Port (Interface defined in the Core Domain)
export interface IFileStoragePort {
  upload(file: Buffer): Promise<string>;
}

// Core Domain Service
export class ProcessDocumentService {
  // Depends on the abstraction (Port), NOT the implementation
  constructor(private readonly storagePort: IFileStoragePort) {}

  async process(file: Buffer) {
    const url = await this.storagePort.upload(file);
    return { status: 'processed', url };
  }
}
```

### 🚀 Solution
Apply the Dependency Inversion Principle using Ports. The Core Domain defines *what* it needs via interfaces (Ports). The Infrastructure layer implements *how* it's done via concrete Adapters. The Domain remains pristine, technology-agnostic, and trivially unit-testable using memory-based mocks.
