<div align="center">
  <img src="https://cdn.simpleicons.org/probot" width="100" alt="Probot Logo">
  
  # Community Code of Conduct
  
  [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
  [![Harmony](https://img.shields.io/badge/Community-Harmony-brightgreen?style=for-the-badge)](#)
  [![Vibe-Coding](https://img.shields.io/badge/Vibe--Coding-Respect-blue?style=for-the-badge)](#)

  **Building the best codebase for AI agents together in a respectful and inclusive environment.**
</div>

---

## 🌟 Our Pledge

In the interest of fostering an open, welcoming, and safe environment, we as contributors and maintainers of the **best-practise** project pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, caste, color, religion, or sexual orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

---

## ⚖️ Our Standards

In our repository dedicated to *Vibe Coding* and architectural AI instructions, we value constructive dialogue and professionalism.

| 🟢 Awesome Behavior | 🔴 Unacceptable Behavior |
|:---|:---|
| 🫱🏼‍🫲🏾 Using welcoming and inclusive language. | 🤬 The use of sexualized language or imagery. |
| 🤝 Being respectful of differing viewpoints and developer experiences. | 🧌 Trolling, insulting/derogatory comments, and personal or political attacks. |
| 💡 Gracefully accepting constructive criticism on code or rules. | 🛑 Public or private harassment of project members. |
| 🌍 Focusing on what is best for the community and accommodating for programming beginners. | 📢 Publishing others' private information without explicit permission. |
| 🧠 Sharing knowledge and experience in development and AI architecture. | 🚫 Other conduct which could reasonably be considered inappropriate in a professional setting. |

---

##  Interaction Lifecycle

Interaction within the **best-practise** project is built on mutual respect and continuous improvement of AI instructions. This visual graph demonstrates the stages of healthy communication in the project:

```mermaid
graph TD
    A([👋 New Contributor]) -->|Studies rules and context| B{Proposes PR / Issue}
    B -->|Follows Code of Conduct| C[✔️ Constructive Code Review]
    B -->|Violates Code of Conduct| D[⚠️ Warning / Ban]
    
    C -->|Open dialogue and feedback| E((🤝 Acceptance of changes))
    E -->|Contribution to the common goal| F[🚀 AI Context Improvement]
    
    classDef welcome fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#155724;
    classDef review fill:#cce5ff,stroke:#004085,stroke-width:2px,color:#004085;
    classDef warning fill:#f8d7da,stroke:#dc3545,stroke-width:2px,color:#721c24;
    classDef success fill:#d1ecf1,stroke:#17a2b8,stroke-width:2px,color:#0c5460;
    
    class A welcome;
    class C,E review;
    class D warning;
    class F success;
```

---

## 📝 Как писать инструкции (Best Practices)

В нашем репозитории мы придерживаемся единого стандарта написания инструкций. В качестве эталонного примера вы можете изучить файл `frontend/typescript/readme.md`.

Каждая инструкция должна начинаться со следующего блока метаданных (YAML frontmatter):

```yaml
---
technology: [Inferred Tech]
domain: [Inferred Domain]
level: Senior/Architect
version: [Inferred Version]
tags: [tag1, tag2, tag3]
ai_role: [Specific Persona]
last_updated: YYYY-MM-DD
---
```

Далее, для описания каждого правила или паттерна, необходимо использовать следующую структуру. **Эта структура повторяется столько раз, сколько необходимо** для полного покрытия темы. Вот один из самых понятных и популярных примеров:

### ❌ Bad Practice
```typescript
function process(data: any) {
    console.log(data.name); // Нет ошибки, но может упасть в рантайме
}
```

### ⚠️ Problem
Использование `any` равносильно отключению TypeScript. Это позволяет коду скомпилироваться в любом случае, но скрывает потенциальные исключения во время выполнения программы.

### ✅ Best Practice
```typescript
function process(data: unknown) {
    if (data && typeof data === 'object' && 'name' in data) {
        console.log((data as { name: string }).name);
    }
}
```

### 🚀 Solution
Используйте `unknown` для значений, тип которых еще не определен. Это обязывает разработчика выполнить проверку типа перед использованием, гарантируя безопасность структуры данных.

---

## 🛡️ Our Responsibilities

Project maintainers, including the project founder **Jamoliddin Qodirov**, are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions (including AI instructions) that are not aligned with this Code of Conduct. Maintainers are also expected to explain the reasons for their moderation decisions when removing content or issuing bans.

---

## 🌐 Scope

This Code of Conduct applies in the following scenarios:
1. Within all **best-practise** project spaces (including the GitHub repository, branches, issue discussions, and pull request comments).
2. In public spaces when an individual is representing the project or its community. Examples include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event.

---

## 🚨 Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers:

- 📧 **Communication Method:** Please reach out directly to the project maintainers (via open issues for moderation, private messages, or public contacts found on their GitHub profiles).

All complaints will be reviewed and investigated promptly, fairly, and impartially. Project maintainers are obligated to maintain confidentiality with regard to the reporter of an incident.

### Enforcement Guidelines

Project maintainers will follow these Community Impact Guidelines in determining the consequences for any action they deem in violation of this Code of Conduct:

1. **Correction:** A private, written warning from the maintainers, providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested.
2. **Warning:** A warning with consequences, such as a temporary suspension from communicating in the project or a ban on interacting with specific individuals for a set period.
3. **Temporary Ban:** A temporary ban from any interaction with the project, including creating issues and pull requests.
4. **Permanent Ban:** A complete and permanent ban from any sort of public interaction within the project for systematic, intentional, or severe violations (e.g., harassment or threats).

---

## 📜 Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org), version 2.1, available at [https://www.contributor-covenant.org/version/2/1/code_of_conduct.html](https://www.contributor-covenant.org/version/2/1/code_of_conduct.html).

Answers to common questions about this code of conduct can be found in the official [FAQ](https://www.contributor-covenant.org/faq). Translations are available at [https://www.contributor-covenant.org/translations](https://www.contributor-covenant.org/translations).
