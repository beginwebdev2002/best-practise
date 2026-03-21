<div align="center">
  <img src="https://cdn.simpleicons.org/express/000000" width="100" alt="ExpressJS Logo">
  
  # 🚂 Express.js Best Practices
</div>

---

## Context & Scope
- **Primary Goal:** Maintain structural integrity and minimize callback chaos in un-opinionated Express environments.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Express 4.x / 5.x

---

## 1. Controller / Route Decoupling
**Constraint:** Do not place inline business logic within routing declarations.
**Instruction:** Decouple all request/response mapping into Controller components, forwarding processing to isolated Service classes.
**Code Example:**
```javascript
// ❌ Bad
app.post('/api/users', async (req, res) => {
  const user = await db.users.create(req.body);
  await emailService.send(user.email);
  return res.json(user);
});

// ✅ Good
const router = express.Router();
router.post('/api/users', UserController.createUser);

// In UserController.js
class UserController {
  static async createUser(req, res, next) {
    try {
      const user = await UserService.register(req.body);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }
}
```

**Checklist:**
- [ ] Routes only bind endpoints to Controller methods.
- [ ] Controllers parse requests and handle response formatting exclusively.
- [ ] Global error catching middleware intercepts generic exceptions.
