---
technology: NestJS
domain: backend
level: Senior/Architect
version: "10+"
tags: [nestjs, clean-architecture, typescript, dependency-injection, node-js]
ai_role: Senior NestJS Architecture Expert
last_updated: 2026-03-22
---

<div align="center">
  <img src="https://cdn.simpleicons.org/nestjs/E0234E" width="100" alt="NestJS Logo">
  
  # 🦁 NestJS Best Practices
</div>

---

## Context & Scope
- **Primary Goal:** Enforce enterprise-grade architecture and TypeScript safety in Node.js backends.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** NestJS 10+

---

## 1. Clean Architecture Modules
**Constraint:** Business logic must not depend directly on HTTP transport or database ORMs.
**Instruction:** Construct Hexagonal/Clean Architecture modules by strictly separating `Controllers` (Delivery), `Services` (Use Cases), and `Repositories` (Data).
**Code Example:**
```typescript
// ❌ Bad: ORM bound to Service
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
}

// ✅ Good: Service relies on Interface
@Injectable()
export class UsersService {
  constructor(@Inject('USER_REPOSITORY') private repo: IUserRepository) {}
}
```

**Checklist:**
- [ ] Dependency Inversion observed between application core and database logic.
- [ ] No strict `@nestjs/common` decorators utilized within domain entities.
- [ ] Strict type safety applied to all Data Transfer Objects (DTOs).
