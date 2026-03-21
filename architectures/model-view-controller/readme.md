<div align="center">
  <img src="https://img.icons8.com/?size=100&id=102832&format=png&color=000000" width="100" alt="MVC Logo">
  
  # 🖼️ Model-View-Controller (MVC)
</div>

---

## Context & Scope
- **Primary Goal:** Separate data mechanisms, presentation layers, and user interactions.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** Agnostic

---

## 1. Domain Separation
**Constraint:** Do not intertwine routing parameters, HTML generation, and database SQL requests.
**Instruction:** Restrict code responsibilities to explicitly defined Models (data behavior), Views (UI construction), and Controllers (business translation).
**Code Example:**
```text
src/
├── models/        # Strict database interface schema
├── views/         # Isolated view rendering (templates)
└── controllers/   # Translation logic bridging models to views
```

**Checklist:**
- [ ] Ensure Views never query Databases directly.
- [ ] Ensure Models carry zero knowledge of network request forms.
- [ ] Use Controllers exclusively as mapping engines between Model updates and View refreshes.
