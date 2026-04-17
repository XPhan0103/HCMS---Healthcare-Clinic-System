# Architecture Decision Record (ADR)

---

## Title: [ADR-003] JWT Authentication Standard
**Date:** 2026-04-16
**Status:** Proposed
**Author(s):** AI Architect / Senior BA

---

### 1. Context
*   **Requirement:** The HCMS system requires secure, stateless authentication for multiple roles (Parents on the Self-Service Portal, Doctors and Receptionists on the main Dashboard). The frontend will be a separate NextJS application communicating with a Spring Boot REST API.
*   **Initial AI Suggestion:** Traditional Session-based authentication using cookies, or OAuth2. However, session-based authentication doesn't scale as well for decoupled SPA/API architectures, and OAuth2 is too complex for an MVP without external integration.

### 2. Decision
*   We have decided to use **JSON Web Tokens (JWT)** for securing REST APIs.
*   **Justification:** JWT enables a completely stateless backend, relieving the Spring Boot server from managing session states in-memory. It fits naturally with our NextJS frontend decoupled architecture. JWTs can easily carry user roles (`ROLE_DOCTOR`, `ROLE_RECEPTIONIST`, `ROLE_PARENT`) allowing for quick role-based access control (RBAC) at the frontend and backend without hitting the database for every request.

### 3. Consequences
*   **Positive (Pros):**
    *   Stateless architecture, lowering server memory footprint.
    *   Easily decouples frontend (NextJS) and backend (Spring Boot), enabling cross-domain requests effortlessly.
*   **Negative (Cons / Tech Debt):**
    *   JWTs cannot be easily revoked/invalidated before their expiration time without implementing a token blacklist (which adds state).
    *   Requires secure storage implementation on the frontend (e.g., HttpOnly cookies) to mitigate XSS attacks.

### 4. Compliance & Verification
*   **Action items:** Backend team will implement Spring Security with a JWT filter and role-based endpoints. Frontend team will implement token storage logic and interceptors to attach the Bearer token to all outgoing API requests.
