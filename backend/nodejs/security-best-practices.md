---
technology: Node.js
domain: backend
level: Senior/Architect
version: "24+"
tags: [security, best-practices, nodejs, clean-code, scalable-code, system-design]
ai_role: Senior Node.js Security Expert
last_updated: 2026-03-24
---

# 🟢 Node.js Security Best Practices

[⬅️ Back to Parent](./readme.md)

## ⚙️ Context & Scope
This document outlines the strict security configurations and anti-patterns that must be mitigated in a production Node.js environment.

---

## 1. 🛑 Prototype Pollution
### ❌ Bad Practice
```javascript
// Unsafe recursive object merging
function merge(target, source) {
  for (let key in source) {
    if (typeof source[key] === 'object') {
      if (!target[key]) target[key] = {};
      merge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
```
### ⚠️ Problem
Unsafe object merging allows attackers to overwrite properties on the global `Object.prototype` (e.g., via `__proto__`). This Prototype Pollution leads to application-wide configuration manipulation, privilege escalation, or Remote Code Execution (RCE).
### ✅ Best Practice
```javascript
// Safe merging utilizing null-prototype objects and property validation
function safeMerge(target, source) {
  for (let key in source) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      safeMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}
```
### 🚀 Solution
STRICTLY filter reserved prototype keys (`__proto__`, `constructor`, `prototype`) during deep clone or merge operations. Alternatively, use robust, community-vetted libraries (like lodash.merge) that have built-in pollution defenses.

## 2. 🔏 Hardcoded Secrets

### ❌ Bad Practice
```javascript
// Exposing secrets in code
const dbClient = new Database('postgres://admin:supersecretpassword@db.internal:5432/mydb');
```
### ⚠️ Problem
Embedding plaintext passwords or API keys directly in source code guarantees a critical security breach if the repository is compromised. Hardcoded secrets persist in Git history forever and expose backend infrastructure to attackers.
### ✅ Best Practice
```javascript
// Utilizing environment variables safely
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('MANDATORY DATABASE_URL config is missing');

const dbClient = new Database(dbUrl);
```
### 🚀 Solution
MANDATORY injection of secrets via environment variables or secret management vaults (e.g., AWS Secrets Manager, HashiCorp Vault). NEVER commit sensitive material to version control.

## 3. 🛡️ Regular Expression Denial of Service (ReDoS)

### ❌ Bad Practice
```javascript
// A vulnerable regex pattern evaluated on user input
const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
app.post('/validate', (req, res) => {
  const isValid = emailRegex.test(req.body.email);
  res.send({ isValid });
});
```
### ⚠️ Problem
Using poorly optimized regular expressions with nested quantifiers (Catastrophic Backtracking) allows an attacker to send crafted payloads that block the Node.js event loop entirely. This causes a complete Denial of Service (ReDoS).
### ✅ Best Practice
```javascript
// Using a robust, vetted validation library
const validator = require('validator');

app.post('/validate', (req, res) => {
  if (typeof req.body.email !== 'string') return res.status(400).send('Invalid format');
  const isValid = validator.isEmail(req.body.email);
  res.send({ isValid });
});
```
### 🚀 Solution
FORBID the use of complex, custom regular expressions on unconstrained user input. STRICTLY utilize established validation libraries and apply input length constraints before regex execution.

### 📊 Security Process Flow

```mermaid
graph LR
    classDef default fill:#0d1117,stroke:#30363d,stroke-width:2px,color:#c9d1d9;
    classDef component fill:#238636,stroke:#2ea043,stroke-width:2px,color:#ffffff;

    A[Client Request] --> B[Security Middleware]
    B --> C[Validation Layer]
    C --> D[Business Logic]

    class B,C component;
```
