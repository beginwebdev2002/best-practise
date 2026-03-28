---
description: Vibe coding guidelines and security constraints for MongoDB within the backend domain.
technology: MongoDB
domain: backend
level: Senior/Architect
complexity: Advanced
topic: MongoDB Security Best Practices
vibe_coding_ready: true
version: "7.0+"
tags: [security-best-practices, mongodb, nosql, database, authentication, authorization, rbac, encryption, injection-prevention, production-ready, scalable-code]
ai_role: Senior MongoDB Database Architect
last_updated: 2026-03-28
last_evolution: 2026-03-28
---

# 🔒 MongoDB Security Best Practices

This document outlines essential security controls for enterprise-level MongoDB deployments, focusing on RBAC, encryption at rest, and preventing NoSQL injections.

## 🛡️ 1. Authentication and Authorization (RBAC)

Ensure MongoDB requires authentication and enforce Role-Based Access Control (RBAC) to limit privileges to the absolute minimum necessary.

### ❌ Bad Practice

Running MongoDB with authorization disabled or using powerful built-in roles (e.g., `root`, `dbAdminAnyDatabase`) for application connections.

```javascript
// A common mistake is using the root user for application access
db.createUser({ user: "appUser", pwd: "secretPassword", roles: ["root"] })
```

### ✅ Best Practice

Enable authorization in `mongod.conf` (`security.authorization: enabled`) and create custom roles or use the principle of least privilege.

### 🚀 Solution

```javascript
// Grant read/write access to specific collections only
db.createRole({
   role: "appRole",
   privileges: [
     { resource: { db: "appDB", collection: "users" }, actions: ["find", "insert", "update", "remove"] },
     { resource: { db: "appDB", collection: "logs" }, actions: ["insert"] }
   ],
   roles: []
});

db.createUser({
   user: "appUser",
   pwd: "secretPassword",
   roles: [ { role: "appRole", db: "appDB" } ]
});
```

---

## 🔐 2. NoSQL Injection Prevention

MongoDB queries can be vulnerable to NoSQL injection if user input is not properly sanitized or if raw operator objects are passed directly to query parameters.

### ❌ Bad Practice

Directly passing unsanitized user input (e.g., from a web request) into a MongoDB query.

```javascript
// Express.js example: Vulnerable to NoSQL Injection
// If req.body.username = { "$gt": "" }, it matches any username
const user = await db.collection('users').findOne({
    username: req.body.username,
    password: req.body.password
});
```

### ✅ Best Practice

Validate and sanitize all inputs to ensure they are primitives (strings, numbers, booleans) and not MongoDB query objects (objects containing `$` operators).

### 🚀 Solution

Using a library like `express-mongo-sanitize` to strip out keys beginning with `$` or `.`.

```javascript
// Express.js with express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Automatically removes $ and . from req.body, req.query, req.params

// The query is now safer because operators have been stripped
const user = await db.collection('users').findOne({
    username: String(req.body.username),
    password: String(req.body.password)
});
```

---

## 🗄️ 3. Encryption at Rest

Protect data stored on disk by enabling encryption at rest, ensuring that unauthorized parties cannot access the database files if the host is compromised.

### ✅ Best Practice

Enable WiredTiger encryption at rest using a robust Key Management Service (KMS).

### 🚀 Configuration

```yaml
# mongod.conf
security:
  enableEncryption: true
  encryptionCipherMode: AES256-CBC
  encryptionKeyFile: /path/to/master/key/file
```

---

[⬆ Back to Top](#-mongodb-security-best-practices)
