---
technology: React
domain: frontend
level: Senior/Architect
version: "19+"
tags: [react, security, best-practices, clean-code, xss, server-components, ai-coding]
ai_role: Senior React Security Expert
last_updated: 2026-04-05
---

# 🛡️ React Security Best Practices

[⬆️ Back to Top](#)
# 📖 Context & Scope
- **Primary Goal:** Establish ironclad security constraints for React applications.
- **Target Tooling:** Cursor, Windsurf, Antigravity.
- **Tech Stack Version:** React 19+

> [!IMPORTANT]
> **Strict Constraints for AI:**
> - **Never** bypass React's built-in XSS protection without rigorous justification and secondary sanitization.
> - **Always** handle sensitive data exclusively within Server Components or Server Actions.

---

## 🚀 I. Cross-Site Scripting (XSS) Prevention

### 🚨 1. Dangerously Setting Inner HTML
> [!NOTE]
> **Context:** Rendering raw HTML from external or untrusted sources.
### ❌ Bad Practice
```tsx
function Article({ content }: { content: string }) {
  // content WILL be "<img src=x onerror=alert('XSS')>"
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
```
### ⚠️ Problem
Using `dangerouslySetInnerHTML` bypasses React's automatic string escaping. If the input is not sanitized, malicious scripts MUST execute within the user's browser, leading to session hijacking or data theft.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```tsx
import DOMPurify from 'dompurify';

function Article({ content }: { content: string }) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}
```
### 🚀 Solution
If you must render raw HTML, strictly sanitize it using a robust library like `DOMPurify` before injecting it into the DOM. Whenever possible, rely on React's default text rendering, which automatically escapes embedded data.

---

## 🔒 II. Data Exposure & Server Components

### 🚨 2. Leaking Secrets to the Client
> [!NOTE]
> **Context:** Accessing environment variables and sensitive configuration.
### ❌ Bad Practice
```tsx
// Inside a Client Component
export function PaymentGateway() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  return <button onClick={() => processPayment(apiKey)}>Pay Now</button>;
}
```
### ⚠️ Problem
Exposing secret keys or database credentials to the client bundle allows attackers to easily extract them, compromising the entire infrastructure.
### ✅ Best Practice
> [!NOTE]
> **Internal Routing:** For more context, refer back to the [parent directory/readme](./readme.md).
```tsx
// Server Action (actions.ts)
'use server';

export async function processPaymentAction() {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  // securely interact with Stripe backend here
  return { success: true };
}

// Client Component
'use client';
import { processPaymentAction } from './actions';

export function PaymentGateway() {
  return <button onClick={() => processPaymentAction()}>Pay Now</button>;
}
```
### 🚀 Solution
Leverage React Server Components and Server Actions (`'use server'`) to keep sensitive logic, secrets, and database connections entirely on the server. The client only receives the safe, computed result.

---
[⬆️ Back to Top](#)
