# Architecture Decision Record (ADR)

---

## Title: [ADR-004] Core Technology Stack - Spring Boot & NextJS
**Date:** 2026-04-16
**Status:** Proposed
**Author(s):** AI Architect / Senior BA

---

### 1. Context
*   **Requirement:** The HCMS project has a tight timeline of 1 month (Go-live MVP by 15/06/2026). It requires a stable, enterprise-grade backend for managing medical records securely, and a highly responsive, modern frontend for the Parent Self-Service booking portal and the internal clinic dashboard.
*   **Initial AI Suggestion:** Using a monolithic approach like PHP/Laravel, or a full JavaScript stack (NodeJS + React).

### 2. Decision
*   We have decided to use **Java Spring Boot for the Backend** and **NextJS (React) for the Frontend**.
*   **Justification:** 
    *   **Backend (Java Spring Boot):** Provides an exceptionally robust and secure ecosystem for REST APIs. Spring Data JPA drastically speeds up the development of our 5-entity database schema, ensuring strong DB typing and data reliability critical for healthcare software. It also enforces good OOP principles.
    *   **Frontend (NextJS):** Offers unparalleled UI performance and developer experience. The fast routing, component reusability (via React), and rich ecosystem will enable rapid development of the "Frictionless" parent portal and "1-Click" clinic interfaces as demanded by our User Personas. NextJS handles API integrations gracefully.

### 3. Consequences
*   **Positive (Pros):**
    *   Clear separation of concerns (Frontend vs Backend), allowing parallel UI and API development by different team members.
    *   High ecosystem maturity; both technologies have massive community support and out-of-the-box enterprise features.
*   **Negative (Cons / Tech Debt):**
    *   Requires the development team to be proficient in two different technology stacks (Java and JavaScript/TypeScript).
    *   Slightly higher initial setup complexity and deployment overhead (needs both a JVM container and a Node server or static hosting) compared to a simple MVC monolith.

### 4. Compliance & Verification
*   **Action items:** Team will initialize the Spring Boot project via Spring Initializr and the NextJS project using `npx create-next-app`. Both applications will be configured with simple generic boilerplate code and basic CI/CD for automated builds to ensure compatibility early on.
