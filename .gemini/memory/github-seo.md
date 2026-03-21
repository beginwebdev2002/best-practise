# GitHub SEO & AI-Context Master Strategy: `best-practise`

This document serves as the primary "Memory" and governance file for the `best-practise` repository. It defines the standards for generating high-performance instructions optimized for both GitHub’s search algorithms and "Vibe Coding" AI tools (Cursor, Windsurf, Copilot).

---

## 1. Indexing Strategy & Keyword Optimization

To ensure the repository ranks at the top of GitHub search results and search engines, every document must adhere to specific semantic rules.

### Header Hierarchy (H1-H3)
| Level | Rule | Example LSI Keywords |
| :--- | :--- | :--- |
| **H1** | Technology + High-Value Action | `TypeScript Production-Ready Best Practices` |
| **H2** | Architecture or Pattern Name | `Clean Architecture`, `Scalable State Management` |
| **H3** | Problem-Solution or Constraints | `Error Handling Patterns`, `Performance Optimization` |

### Semantic Density Requirements
- **LSI Keywords:** Naturally integrate terms like *production-ready*, *enterprise-grade*, *scalable architecture*, *clean code*, and *software design patterns*.
- **Initial Context:** The first 200 characters of every file must contain the primary technology and the keyword "best practices".
- **Density:** Maintain a 1-3% keyword density for the main topic to avoid "keyword stuffing" while remaining relevant to GitHub's search indexer.

---

## 2. Structure for AI-Context (Vibe Coding Optimization)

Documentation must be structured to allow LLMs to ingest "system prompts" and "project rules" with zero ambiguity.

### Mandatory "Context & Scope" Section
Every file must start with a `# Context & Scope` section that defines:
- **Primary Goal:** What is this instruction trying to achieve?
- **Target Tooling:** (e.g., Cursor, Windsurf).
- **Tech Stack Version:** (e.g., React 19, Next.js 15, Node.js 22).

### Markdown Formatting for LLMs
- **Checklists:** Use `- [ ]` for actionable verification steps. LLMs respond better to checklist-style instructions.
- **Strict Constraints:** Use a `> [!IMPORTANT]` or `> [!CAUTION]` block to list "Never" and "Always" rules.
- **Code Annotations:** Use comments within code blocks to explain *why* a pattern is used, not just *what* it does.

---

## 3. Technical Text Standard

### Tone and Style
- **Tone:** Professional, direct, senior-architect level. No conversational "filler" or "fluff".
- **Instructional Style:** Use imperative verbs (e.g., "Implement", "Enforce", "Abstract").

### Architecture Visualization
- **Mermaid.js:** Every architectural pattern **must** include a Mermaid diagram to provide a visual mental model for both the human developer and the AI agent.
  ```mermaid
  graph LR
    A[Component] --> B[Feature Logic]
    B --> C[Shared Layer]
  ```

### Code Standards
- **Naming Conventions:** Enforce `PascalCase` for classes/components, `camelCase` for functions/variables, and `kebab-case` for file names.
- **Folder Structure:** Define a clear directory hierarchy (e.g., `src/features/*`, `src/shared/ui/*`).

---

## 4. Internal Linking Rules

To build a "Knowledge Graph" within the repository, files must be cross-referenced using relative Markdown links.

- **Dependency Linking:** If a TypeScript guide is used, it must link to the `Architecture` guide (e.g., `[View Architecture Standards](../../architectures/fsd.md)`).
- **Pattern Inheritance:** Link specialized patterns (e.g., Factory) to general programming principles (e.g., SOLID).
- **Navigation:** Every sub-folder should have a `readme.md` that maps out the local files and their relationship to the repository root.

---

## 5. Repository Metadata

### About Section (GitHub Sidebar)
- **Constraint:** Max 160 characters.
- **Template:** `🚀 The ultimate guide to Best Practices & Production-Ready Patterns. Optimized for Vibe Coding (Cursor/Windsurf). Clean Code, Scalable Architectures, and System Design.`

### Topics (Tags)
Always include the maximum (20) relevant tags for discoverability:
`best-practices`, `clean-code`, `architecture-patterns`, `vibe-coding`, `cursor-rules`, `typescript`, `software-architecture`, `system-design`, `solid-principles`, `production-ready`, `programming-standards`, `react-best-practices`, `node-js`, `design-patterns`, `scalable-code`, `windsurf-rules`, `ai-coding`, `fsd`, `ddd`, `enterprise-patterns`, `mvc-best-practise`, `angular-best-practise`, `expressjs-best-practise`, `ai-instructions`, `vibe-coding-instructions`, `mongodb`, `angular`, `nestjs`, `html`, `scss`, `javascript`, `js`, `typescript-best-practise`, `css`, `css3`.

### README.md Optimization
- Use a high-quality SVG header.
- Provide a "Quick Start for AI" section explaining how to point Cursor/Windsurf to this repository.
- Include a table of contents with links to all major categories (Frontend, Backend, etc.).
