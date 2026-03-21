<div align="center">
  <img src="https://cdn.simpleicons.org/probot" width="100" alt="Probot Logo">
  
  # Best-Practise: AI Agent Context

  [![AI-Ready](https://img.shields.io/badge/AI--Ready-blue?style=for-the-badge&logo=openai&logoColor=white)](#)
  [![Vibe-Coding Verified](https://img.shields.io/badge/Vibe--Coding-Verified-brightgreen?style=for-the-badge)](#)
  [![Architecture: Atomic](https://img.shields.io/badge/Architecture-Atomic-orange?style=for-the-badge)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#)

  **"The Gold Standard for AI Agent Context Injection."**
</div>

---

## 🚀 The "Vibe Coding" Value Proposition

**The Problem:** Generic LLMs produce generic code because they lack deep project context. Without strict architectural guidelines, codebases built with AI quickly turn into unmaintainable spaghetti code.

**The Solution:** This repository provides a global, open-source library of meta-instructions for **Vibe Coding**. By injecting these strict architectural constraints into your AI agents, you ensure **deterministic, scalable, and "beautiful" production-ready code generation**.

---

## 🗺️ Interactive Tech Stack Map

| Domain | Technology | Status |
|:---|:---|:---:|
| **Frontend** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg" width="20"/> [Angular 20+](frontend/angular/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="20"/> [JavaScript (ES6+)](frontend/javascript/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="20"/> [TypeScript](frontend/typescript/) | ✅ |
| **Backend** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="20"/> [NestJS](backend/nestjs/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" width="20"/> [Express.js](backend/express/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="20"/> [Node.js](backend/nodejs/) | ✅ |
| **Architecture** | 📐 [Feature-Sliced Design (FSD)](architecture/fsd/) <br> 🏗️ [MVC](architecture/mvc/) | 🛠️ |

---

## 🎯 Agent Integration Guide

To maximize the potential of your AI coding assistants, integrate this repository into your workflow using the following methods:

### CURSOR AI
Create or update your `.cursorrules` file at the root of your project and reference the specific instructions:
```markdown
# Base Architectural Rules
Read and strictly follow instructions from:
https://github.com/[your-repo]/best-practise/blob/main/frontend/angular/readme.md
```

### ANTIGRAVITY IDE
Antigravity supports modular instruction sets. Place the relevant rules in your `.agents/rules/` directory and update your `agents.md`:
```markdown
- [angular-best-practices.md]: Guidelines for Angular 20+ development.
- [fsd-architecture.md]: Feature-Sliced Design constraints.
```

### WINDSURF & COPILOT
When prompting Windsurf or GitHub Copilot Workspace, explicitly set the context at the beginning of your session:
> "Before writing code, reference the architectural guidelines for NestJS found in the `best-practise` repository at `backend/nestjs/readme.md`. Strictly adhere to these constraints."

---

## 🛠️ Visual Architecture: Context Deep-Dive

The repository is structured hierarchically to allow AI agents to progressively deepen their understanding of your project constraints.

```mermaid
graph TD
    A["📄 Root: agents.md"] --> B{"🌐 Domain"}
    B -->|Frontend| C1["🖥️ frontend/readme.md"]
    B -->|Backend| C2["⚙️ backend/readme.md"]
    B -->|Architecture|C3["📐 architectures/readme.md"]
    
    C1 --> D1["🅰️ Technology: angular/readme.md"]
    C2 --> D2["🐱 Technology: nestjs/readme.md"]
    C3 --> D3["🧩 Architecture: fsd/readme.md"]
    
    D1 --> E1["⚡ Specification: performance.md"]
    D1 --> E2["📦 Specification: state-management.md"]
    
    D2 --> E3["🛡️ Specification: security.md"]
    D2 --> E4["🗄️ Specification: database.md"]

    D3 --> E5["📚 Specification: layer-isolation.md"]
    D3 --> E6["🚪 Specification: public-api-policy.md"]
    
    %% Clickable Links
    click A "agents.md"
    click C1 "frontend/readme.md"
    click C2 "backend/readme.md"
    click C3 "architectures/readme.md"
    click D1 "frontend/angular/readme.md"
    click D2 "backend/nestjs/readme.md"
    click D3 "architectures/fsd/readme.md"
    click E1 "frontend/angular/performance.md"
    click E2 "frontend/angular/state-management.md"
    click E3 "backend/nestjs/security.md"
    click E4 "backend/nestjs/database.md"
    click E5 "architectures/fsd/layer-isolation.md"
    click E6 "architectures/fsd/public-api-policy.md"
    
    %% Styling
    classDef root fill:#f9f,font-weight:bold,stroke:#333,stroke-width:2px,color:#111;
    classDef domain fill:#bbf,font-weight:bold,stroke:#333,stroke-width:2px,color:#111;
    classDef tech fill:#bfb,font-weight:bold,stroke:#333,stroke-width:2px,color:#111;
    classDef spec fill:#fbb,font-weight:bold,stroke:#333,stroke-width:2px,color:#111;
    
    class A root;
    class B,C1,C2,C3 domain;
    class D1,D2,D3 tech;
    class E1,E2,E3,E4,E5,E6 spec;
```
## 🌴 Folder Tree

* 📦 **[best-practise](./)**
  * 📄 [agents.md](./agents.md)
  * 🌐 **[architectures/](./architectures/)**
    * 📄 [readme.md](./architectures/readme.md)
    * 🧩 **[fsd/](./architectures/fsd/)**
      * 📚 [layer-isolation.md](./architectures/fsd/layer-isolation.md)
      * 🚪 [public-api-policy.md](./architectures/fsd/public-api-policy.md)
      * 📄 [readme.md](./architectures/fsd/readme.md)
    * 🏗️ **[mvc/](./architectures/mvc/)**
      * 📄 [readme.md](./architectures/mvc/readme.md)
  * ⚙️ **[backend/](./backend/)**
    * 📄 [readme.md](./backend/readme.md)
    * 🚂 **[express/](./backend/express/)**
      * 📄 [readme.md](./backend/express/readme.md)
    * 🐱 **[nestjs/](./backend/nestjs/)**
      * 🗄️ [database.md](./backend/nestjs/database.md)
      * 📄 [readme.md](./backend/nestjs/readme.md)
      * 🛡️ [security.md](./backend/nestjs/security.md)
    * 🟢 **[nodejs/](./backend/nodejs/)**
      * 📄 [readme.md](./backend/nodejs/readme.md)
  * 🖥️ **[frontend/](./frontend/)**
    * 📄 [readme.md](./frontend/readme.md)
    * 🅰️ **[angular/](./frontend/angular/)**
      * ⚡ [performance.md](./frontend/angular/performance.md)
      * 📄 [readme.md](./frontend/angular/readme.md)
      * 📦 [state-management.md](./frontend/angular/state-management.md)
    * 🟨 **[javascript/](./frontend/javascript/)**
      * 📄 [readme.md](./frontend/javascript/readme.md)
    * 🟦 **[typescript/](./frontend/typescript/)**
      * 📄 [readme.md](./frontend/typescript/readme.md)

---

## 🤝 How to Contribute

This is a living repository. Even if you're building alone, the AI ecosystem thrives on shared knowledge. If you are an expert in a specific technology, we invite you to add your specific constraints and rules!
1. Fork the repository.
2. Navigate to the appropriate `[domain]/[technology]/` folder (or create it).
3. Add a `readme.md` with core principles, and break down complex rules into specific markdown files.
4. Submit a Pull Request.

---

<div align="center">
  <b>Author:</b> Jamoliddin Qodirov <i>(Software Architect & Teacher)</i>
</div>
