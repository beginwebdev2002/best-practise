---
technology: UI/UX Design
domain: frontend
level: Senior/Architect
version: Latest
tags: [vibe-coding, documentation, best-practices, architecture, design-system, accessibility]
ai_role: Senior Vibe Coding Expert
last_updated: 2026-03-29
---

# 🚀 UI/UX Basics & General

[⬆️ Back to Top](./readme.md)

### 🚨 1. Using Non-semantic HTML Elements
> [!NOTE]
> **Context:** Accessibility
### ❌ Bad Practice
```html
<div class="button" onclick="submit()">Submit</div>
```
### ⚠️ Problem
Using non-semantic elements for interactive components breaks keyboard navigation and screen reader support.
### ✅ Best Practice
```html
<button onclick="submit()">Submit</button>
```
### 🚀 Solution
Always use native, semantic HTML elements (e.g., `<button>`, `<a>`, `<nav>`, `<main>`) to ensure built-in accessibility and better SEO.
