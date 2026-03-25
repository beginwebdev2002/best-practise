---
description: Key instructions for Jules regarding performance optimization standards, ensuring fast load times and global scalability.
tags: [performance optimization, scalability, fast load times, lazy loading, caching, pagination, frontend optimization, backend efficiency]
---

# ⚡ Performance Optimization Rules for Jules

## 1. 🎯 Context & Scope
- **Primary Goal:** Ensure all generated code meets strict **performance optimization** standards, guaranteeing fast load times, efficient resource usage, and global **scalability**.
- **Target Tooling:** Jules AI agent (Automated Performance Audits & Code Generation).
- **Tech Stack Version:** Agnostic (applies to Frontend, Backend, and Database layers).

<div align="center">
  <img src="https://img.icons8.com/?size=100&id=13441&format=png&color=000000" width="100" alt="Performance Overview">
</div>

---

## 2. 🚀 Core Performance Guidelines

### Performance Strategies Overview

```mermaid
graph TD
    A[Performance Optimization] --> B(Frontend Optimization)
    A --> C(Backend & Database Efficiency)

    B --> B1[Lazy Loading]
    B --> B2[Memoization & Re-renders]
    B --> B3[Asset Optimization]

    C --> C1[Query Optimization]
    C --> C2[Caching Strategy]
    C --> C3[Pagination]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    %% Added Design Token Styles for Mermaid Diagrams
    classDef default fill:#e1f5fe,stroke:#03a9f4,stroke-width:2px,color:#000;
    classDef component fill:#e8f5e9,stroke:#4caf50,stroke-width:2px,color:#000;
    classDef layout fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px,color:#000;

    class B1 component;
    class C1 component;
    class B3 component;
    class C3 component;
    class C2 component;
    class B2 component;

```

> [!WARNING]
> **Performance Regressions:** Never introduce synchronous blocking operations in the main thread (Node.js/Browser). Always favor asynchronous, non-blocking APIs.

### 🎨 Frontend Optimization
For Web and UI clients, Jules must ensure:
1. **Lazy Loading:** Components, routes, and heavy modules (like charts or rich text editors) must be lazy-loaded to reduce the initial bundle size.
2. **Memoization & Re-renders:** Prevent unnecessary component re-renders (using `useMemo`, `React.memo`, or Angular's `OnPush` change detection).
3. **Asset Optimization:** Images must be optimized (WebP/AVIF format) and served with native lazy loading (`loading="lazy"`).

### 🛡️ Backend & Database Efficiency
For server infrastructure:
1. **Query Optimization:** Never use `SELECT *` in SQL databases. Always explicitly request only the required fields. Add standard indexes for frequently queried columns.
2. **Caching Strategy:** Implement in-memory caching (like Redis) for expensive computations or frequently accessed, rarely mutated data.
3. **Pagination:** All endpoints returning lists of data must implement pagination (Cursor-based or Offset-based) and rate limiting.

### 🛠️ Performance Pattern Selection

| Strategy | Ideal Use Case | Jules Rule |
| :--- | :--- | :--- |
| **CDN Delivery** | Static assets, media, styles | Serve static files from Edge locations. |
| **Server-Side Rendering (SSR)** | SEO-heavy public pages | Pre-render initial HTML for faster First Contentful Paint (FCP). |
| **Web Workers** | Heavy client-side computations | Offload data parsing or cryptographic tasks from the main thread. |
| **Connection Pooling** | Database connections | Always reuse database connections across requests to prevent overhead. |

---

## 3. ✅ Checklist for Jules Agent

When writing or reviewing code for performance:
- [ ] Determine if the new feature negatively impacts bundle size or memory usage.
- [ ] Use Big-O notation analysis; avoid nested loops $O(n^2)$ for large data sets.
- [ ] Ensure API responses are compressed (Gzip/Brotli).
- [ ] Identify opportunities to batch or debounce repetitive actions (like user typing or API requests).
