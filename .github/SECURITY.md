<div align="center">
  <img src="https://cdn.simpleicons.org/probot" width="100" alt="Probot Logo">
  
  # 🛡️ Security Policy
  
  [![Security: Active](https://img.shields.io/badge/Security-Active-brightgreen?style=for-the-badge&logo=springsecurity)](#)
  [![Vibe-Coding Protected](https://img.shields.io/badge/Vibe--Coding-Protected-blue?style=for-the-badge&logo=shield)](#)
</div>

Welcome to the official security policy for the **best-practise** project. Our goal is to ensure the maximum security and reliability of meta-instructions (Vibe Coding) for AI agents (Cursor, Windsurf, Copilot, Antigravity, Aider). 

Since this repository serves as an "AI Knowledge Base," our security model differs from traditional software development projects.

---

## 📅 Supported Versions

We actively support and update only the latest major versions of our architectural and technological rules.

| Version / Branch | Security Support | Support Status |
| :--- | :---: | :---: |
| **`main` (Current)** | ✅ Supported | <img src="https://img.shields.io/badge/Active-success?style=flat-square"> |
| **`v1.x`** | ❌ Unsupported | <img src="https://img.shields.io/badge/Deprecated-critical?style=flat-square"> |
| **Legacy Branches / PRs** | ❌ Unsupported | <img src="https://img.shields.io/badge/Unsupported-lightgrey?style=flat-square"> |

---

## 🚨 Reporting a Vulnerability

Please **DO NOT create public issues** if you discover a critical vulnerability or potentially dangerous AI instructions in the repository (e.g., instructions that open backdoors via agents).

**Secure Reporting Process:**
1. Navigate to the **[Security Advisories](https://github.com/jamoliddin/best-practise/security/advisories)** tab or contact the maintainers directly.
2. Describe the issue in detail: specify the exact `.md` file containing the vulnerability.
3. Explain how an AI agent might incorrectly or destructively interpret the instruction.
4. Attach a Proof of Concept (PoC prompt) if possible, demonstrating the exploitation of the "flawed" rule in Cursor or Windsurf.

We are committed to acknowledging your report within **48 hours** and providing a remediation plan.

---

## 🤖 AI Security Context

This project focuses on Context Injection. Therefore, we classify threats specifically for LLMs and agentic IDEs:

- **Prompt Injections:** Hidden or "poisonous" instructions in rule files that force the agent to write malicious code or ignore other project security policies.
- **Insecure Architectural Patterns:** Instructions recommending the use of vulnerable dependencies, disabling CORS in production-ready examples, or exposing APIs without proper authentication.
- **Data Leaks:** Code examples or AI configuration rules that encourage agents (or developers) to leave API keys and tokens in the codebase.

### Severity Levels

| Severity | Incident Description within Vibe Coding | Priority |
| :---: | :--- | :---: |
| 🔴 **Critical** | Malicious injections guaranteed to lead to code compromise or RCE executed by the agent. | **P0** |
| 🟠 **High** | Recommendations grossly violating basic security principles (e.g., `eval`, unvalidated `innerHTML` in Frontend rules). | **P1** |
| 🟡 **Medium** | Instructions leading to the creation of logical bugs (Bad Smells, Race conditions) in the agent-generated code. | **P2** |
| 🟢 **Low** | Typos in linters, broken or outdated minor style rules. | **P3** |

---

## 🔄 Incident Response Lifecycle

Below is a visual flowchart of our standard process for handling discovered threats in meta-instructions:

```mermaid
graph TD
    A([User finds dangerous rule]) --> B{Is it critical?}
    B -->|Yes (P0, P1)| C[Submit private Security Advisory]
    B -->|No (P2, P3)| D[Open standard Issue / Pull Request]
    
    C --> E[Threat analysis by maintainers]
    E --> F[Vulnerability isolation, disable rule]
    F --> G[Patch MD file and update instructions]
    G --> H[Publish Security Release & Notify]
    H --> I([Vulnerability resolved])
    
    D --> G
    
    classDef critical fill:#ffebeb,stroke:#ff0000,stroke-width:2px;
    classDef safe fill:#ebffeb,stroke:#00aa00,stroke-width:2px;
    class C critical;
    class D safe;
```

---

## 🛡️ Best Practices for Contributors

If you propose new instructions or architectural standards (via PR), strictly adhere to the security rules:
- **No Binary Files:** Never add executable scripts if their code cannot be verified directly.
- **Security Annotations:** Any code examples for authentication or configuration must be accompanied by `// SECURE:` comments or explanations of why this approach is standard and secure.
- **Path Restrictions:** Absolute paths and hardcoded test secrets are strictly forbidden in rules (e.g., inside `backend/nestjs/security.md`). Always use placeholders like `<YOUR_SECRET_KEY>`.

<br>

<div align="center">
  <b>Thank you for contributing to the security and quality of AI-driven development (Vibe Coding)! 🚀</b>
</div>
