---
description: The entry point for developers and AI agents to the Best-Practise AI Context Library.
tags: [vibe coding, ai agents, context injection, architectural constraints, clean code]
---
[ 🇺🇸 English ](#english) | [ 🇷🇺 Русский ](#russian)

<a id="english"></a>
<div align="center">
  <img src="https://cdn.simpleicons.org/probot" width="100" alt="Probot Logo">
  
  # Best-Practise: AI Agent Context

  [![AI-Ready](https://img.shields.io/badge/AI--Ready-blue?style=for-the-badge&logo=openai&logoColor=white)](#)
  [![Vibe-Coding Verified](https://img.shields.io/badge/Vibe--Coding-Verified-brightgreen?style=for-the-badge)](#)
  [![Architecture: Atomic](https://img.shields.io/badge/Architecture-Atomic-orange?style=for-the-badge)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#)

  **"The Gold Standard for AI Agent Context Injection."**
</div>

# ⚙️ Context & Scope
- **Primary Goal:** Provide an AI-readable index for all architectural and technological constraints to ensure Vibe Coding best practices.
- **Target Tooling:** Cursor, Windsurf, Antigravity, GitHub Copilot.
- **Tech Stack Version:** Agnostic

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

## 🤖 Топ-10 AI Агентов и Инструментов (IDE)

В современных реалиях Vibe Coding активно используются следующие мощные AI инструменты. Вот 10 самых популярных из них:

| Логотип | Инструмент | Описание |
|:---:|:---|:---|
| <img src="https://img.shields.io/badge/Cursor-000000?style=flat-square&logo=cursor&logoColor=white" alt="Cursor"> | **Cursor AI** | An advanced fork of VS Code, deeply integrated with models (Claude 3.5 Sonnet, GPT-4o) for autocompletion and refactoring of entire codebases. |
| <img src="https://img.shields.io/badge/Antigravity-4285F4?style=flat-square&logo=google&logoColor=white" alt="Antigravity"> | **Antigravity IDE** | A powerful standalone environment and AI agent from the Google DeepMind team. Understands complex context and multi-step tasks. |
| <img src="https://img.shields.io/badge/Copilot-181717?style=flat-square&logo=githubcopilot&logoColor=white" alt="GitHub Copilot"> | **GitHub Copilot** | The main AI assistant from GitHub and OpenAI, which pioneered code autocompletion and continues to evolve (Copilot Workspace). |
| <img src="https://img.shields.io/badge/Windsurf-0284C7?style=flat-square" alt="Windsurf"> | **Windsurf** | A revolutionary IDE from Codeium with "streaming" interaction between agents and programmers (Flow State). |
| <img src="https://img.shields.io/badge/Cline-F97316?style=flat-square" alt="Cline"> | **Cline (formerly Devin/Claude Dev)** | An autonomous AI developer right in your VS Code, capable of creating projects from scratch and running commands in the terminal. |
| <img src="https://img.shields.io/badge/Aider-22C55E?style=flat-square" alt="Aider"> | **Aider** | A console AI agent that works perfectly with Git repositories and allows you to manage projects directly from the terminal. |
| <img src="https://img.shields.io/badge/Codeium-09B6A2?style=flat-square&logo=codeium&logoColor=white" alt="Codeium"> | **Codeium** | A completely free (for private use) and lightning-fast AI assistant that integrates into any development environment. |
| <img src="https://img.shields.io/badge/Tabnine-3A23AD?style=flat-square&logo=tabnine&logoColor=white" alt="Tabnine"> | **Tabnine** | Enterprise-level solution with a high degree of confidentiality, trained on your own code without leaks to public models. |
| <img src="https://img.shields.io/badge/Amazon_Q-232F3E?style=flat-square&logo=amazonaws&logoColor=white" alt="Amazon Q"> | **Amazon Q Developer** | An assistant from AWS (formerly CodeWhisperer), ideal for integration with cloud infrastructure and vulnerability scanning. |
| <img src="https://img.shields.io/badge/Cody-FF5543?style=flat-square&logo=sourcegraph&logoColor=white" alt="Sourcegraph Cody"> | **Sourcegraph Cody** | An instrument with deep access to your enterprise code graph for ultra-precise search and generation. |

---

## 🎯 Integration Guide: Injecting AI Context

To establish a deterministic, scalable **Agentic Workflow**, engineers must perform **Context Injection**. By injecting these **Deterministic Rules** into your AI toolchain, you ensure that agents strictly adhere to the project's baseline architecture and constraints.

### Context Injection Lifecycle

```mermaid
graph LR
    A[Best-Practise Library] --> B[Select Technology .md]
    B --> C[Copy to Local .ide-folder/]
    C --> D[AI Agent Activation]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class C component;
    class A component;
    class D component;
    class B component;

```

### Folder Mapping Table

For the **Deterministic Rules** to be accurately parsed and strictly followed, instructions MUST be placed in these specific hidden directories based on your AI tooling:

| AI Tool | Instruction Directory Mapping |
| :--- | :--- |
| **Antigravity IDE** | `.agents/rules/*.md` |
| **Cursor AI** | `.cursor/rules/*.md` |
| **Windsurf** | `.windsurf/rules/` |
| **GitHub Copilot** | `.github/copilot-instructions.md` (or root `.github/` for general context) |
| **Cloud Code AI / Claude Code** | Root directory or `.claude/` (depending on agent configuration) |
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
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class E1 component;
    class E5 component;
    class E3 component;
    class E6 component;
    class D3 component;
    class C1 component;
    class E2 component;
    class D1 component;
    class D2 component;
    class E4 component;
    class C2 component;
    class C3 component;
    class B component;

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


---

<a id="russian"></a>
<div align="center">
  <img src="https://cdn.simpleicons.org/probot" width="100" alt="Probot Logo">
  
  # Best-Practise: Контекст агента ИИ

  [![AI-Ready](https://img.shields.io/badge/AI--Ready-blue?style=for-the-badge&logo=openai&logoColor=white)](#)
  [![Vibe-Coding Verified](https://img.shields.io/badge/Vibe--Coding-Verified-brightgreen?style=for-the-badge)](#)
  [![Architecture: Atomic](https://img.shields.io/badge/Architecture-Atomic-orange?style=for-the-badge)](#)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#)

  **"Золотой стандарт для внедрения контекста в ИИ-агентствах."**
</div>

# ⚙️ Контекст & Сфера применения
- **Основная цель:** Обеспечить AI-читаемый индекс для трансляции архитектурных концепций и технологических Constraints (Ограничения) с целью обеспечения стандартов Vibe Coding.
- **Целевое ПО (Target Tooling):** Cursor, Windsurf, Antigravity, GitHub Copilot.
- **Версия техстека:** Агностична

---

## 🚀 "Vibe Coding" Ценностное предложение

**Проблема:** Базовые LLM генерируют абстрактный код по причине дефицита глубокого контекста о проекте. Отсутствие строго регламентированных архитектурных ограничений неизбежно приводит к переходу кодовой базы, сгенерированной ИИ, в технический долг (спагетти-код) и провоцирует Hallucinations (Галлюцинации).

**Решение:** Данный репозиторий представляет собой эталонную open-source библиотеку мета-инструкций для **Vibe Coding**. Осуществляя строгий AI Context Injection в ваших агентах, вы достигаете **детерминированного транслирования архитектуры, обеспечения масштабируемости и генерации production-ready кода**.

---

## 🗺️ Интерактивная карта технологического стека

| Домен | Технология | Статус |
|:---|:---|:---:|
| **Frontend** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg" width="20"/> [Angular 20+](frontend/angular/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="20"/> [JavaScript (ES6+)](frontend/javascript/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="20"/> [TypeScript](frontend/typescript/) | ✅ |
| **Backend** | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="20"/> [NestJS](backend/nestjs/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" width="20"/> [Express.js](backend/express/) <br> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="20"/> [Node.js](backend/nodejs/) | ✅ |
| **Architecture** | 📐 [Feature-Sliced Design (FSD)](architecture/fsd/) <br> 🏗️ [MVC](architecture/mvc/) | 🛠️ |

---

## 🤖 Топ-10 AI Агентов и Инструментов (IDE)

В парадигме Vibe Coding в продакшене внедрены следующие ИИ-инструменты. Ниже приведен топ-10 актуальных решений:

| Логотип | Инструмент | Описание |
|:---:|:---|:---|
| <img src="https://img.shields.io/badge/Cursor-000000?style=flat-square&logo=cursor&logoColor=white" alt="Cursor"> | **Cursor AI** | Продвинутый форк VS Code с нативной интеграцией LLM (Claude 3.5 Sonnet, GPT-4o) для автокомплита и кросс-файлового рефакторинга. |
| <img src="https://img.shields.io/badge/Antigravity-4285F4?style=flat-square&logo=google&logoColor=white" alt="Antigravity"> | **Antigravity IDE** | Высокоуровневая автономная среда с AI-агентом от Google DeepMind. Спроектирована для интерпретации сложного контекста и решения комплексных задач. |
| <img src="https://img.shields.io/badge/Copilot-181717?style=flat-square&logo=githubcopilot&logoColor=white" alt="GitHub Copilot"> | **GitHub Copilot** | Флагманский ИИ-инструмент интеграции модели от GitHub. Включает парадигму Copilot Workspace для управления репозиториями. |
| <img src="https://img.shields.io/badge/Windsurf-0284C7?style=flat-square" alt="Windsurf"> | **Windsurf** | IDE от Codeium. Внедряет парадигму Flow State для достижения непрерывного потокового взаимодействия "инженер-агент". |
| <img src="https://img.shields.io/badge/Cline-F97316?style=flat-square" alt="Cline"> | **Cline (ex Devin/Claude Dev)** | Автономный ИИ-разработчик как расширение VS Code. Осуществляет выполнение консольных команд и bootstrap проектов. |
| <img src="https://img.shields.io/badge/Aider-22C55E?style=flat-square" alt="Aider"> | **Aider** | Консольный AI-агент. Ориентирован на нативную работу в связке с Git-архитектурой для выполнения команд из терминала. |
| <img src="https://img.shields.io/badge/Codeium-09B6A2?style=flat-square&logo=codeium&logoColor=white" alt="Codeium"> | **Codeium** | Производительный ИИ-ассистент, доступный для широкого пула IDE поверх локальной инфраструктуры разработчика. |
| <img src="https://img.shields.io/badge/Tabnine-3A23AD?style=flat-square&logo=tabnine&logoColor=white" alt="Tabnine"> | **Tabnine** | Enterprise-решение с упором на секьюрити. Обучается изолированно на инхаус коде для пресечения утечек данных. |
| <img src="https://img.shields.io/badge/Amazon_Q-232F3E?style=flat-square&logo=amazonaws&logoColor=white" alt="Amazon Q"> | **Amazon Q Developer** | Корпоративный ассистент от AWS. Внедрен как модуль-профайлер облачных инфраструктур и анализа уязвимостей. |
| <img src="https://img.shields.io/badge/Cody-FF5543?style=flat-square&logo=sourcegraph&logoColor=white" alt="Sourcegraph Cody"> | **Sourcegraph Cody** | Инструмент для дата-майнинга и анализа Enterprise-кодовых графов, обеспечивающий маппинг компонентов с высокой степенью согласованности. |

---

<!-- Agent Integration Guide moved to bilingual section above -->

---

## 🎯 Руководство по интеграции: Инъекция контекста

Для выстраивания детерминированного и масштабируемого **Agentic Workflow**, разработчики должны реализовать **Инъекцию контекста** (Context Injection). Интеграция данных **Deterministic Rules** в ваш инструментарий ИИ гарантирует строгое соблюдение базовой архитектуры и заданных ограничений агентами.

### Жизненный цикл Инъекции контекста

```mermaid
graph LR
    A[Best-Practise Library] --> B[Select Technology .md]
    B --> C[Copy to Local .ide-folder/]
    C --> D[AI Agent Activation]
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class C component;
    class A component;
    class D component;
    class B component;

```

### Таблица: Маппинг директорий

Для того чтобы **Deterministic Rules** корректно парсились и строго исполнялись ИИ-ассистентами, инструкции ДОЛЖНЫ быть размещены в следующих скрытых директориях, в зависимости от инструмента:

| AI Инструмент | Маппинг директорий |
| :--- | :--- |
| **Antigravity IDE** | `.agents/rules/*.md` |
| **Cursor AI** | `.cursor/rules/*.md` |
| **Windsurf** | `.windsurf/rules/` |
| **GitHub Copilot** | `.github/copilot-instructions.md` (или корень `.github/` для общего контекста) |
| **Cloud Code AI / Claude Code** | Корневая директория или `.claude/` (в зависимости от конфигурации агента) |
---

## 🛠️ Visual Architecture: Context Deep-Dive

Топология проекта организована иерархически. Архитектура разработана для прогрессивного спускания AI-агентов по информационным узлам (Context Drilling) до спецификаций конкретной технологии.

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
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class E1 component;
    class E5 component;
    class E3 component;
    class E6 component;
    class D3 component;
    class C1 component;
    class E2 component;
    class D1 component;
    class D2 component;
    class E4 component;
    class C2 component;
    class C3 component;
    class B component;

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

## 🤝 Стать contributer проект

В условиях развития AI-экосистемы аккумулирование Enterprise-опыта является критически важным. Инженерам, обладающим подтвержденной квалификацией (Senior level) в конкретных субдоменах, предлагается расширять реестр Constraints:
1. Выполните Fork проекта.
2. Проведите локализацию в директории `[domain]/[technology]/`.
3. Реализуйте файл `readme.md`, декларирующий ключевые парадигмы в рамках стэка. Для покрытия узкоспециализированных кейсов инициируйте декомпозицию с выделением изолированных конфигураций (например, `performance.md`).
4. Настройте Pull Request в ветку `main`.

---

<div align="center">
  <b>Author:</b> Jamoliddin Qodirov <i>(Software Architect & Teacher)</i>
</div>
