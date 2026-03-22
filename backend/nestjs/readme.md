---
technology: NestJS
domain: backend
level: Senior/Architect
version: "10+"
tags: [best-practices, clean-code, architecture-patterns, vibe-coding, cursor-rules, typescript, software-architecture, system-design, solid-principles, production-ready, programming-standards, react-best-practices, node-js, design-patterns, scalable-code, windsurf-rules, ai-coding, fsd, ddd, enterprise-patterns]
ai_role: Senior NestJS Architecture Expert
last_updated: 2026-03-22
---

# NestJS Best Practices & Production-Ready Patterns

# Context & Scope
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
