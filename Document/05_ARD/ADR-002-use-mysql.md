# Architecture Decision Record (ADR)

---

## Title: [ADR-002] Use MySQL as Primary Relational Database
**Date:** 2026-04-16
**Status:** Proposed
**Author(s):** AI Architect / Senior BA

---

### 1. Context
*   **Requirement:** The HCMS system has a strict data scope limit of exactly 5 entities (PATIENT, APPOINTMENT, VISIT, PRESCRIPTION, BILLING). This data is highly structured and clearly relational (e.g., 1 PATIENT has N APPOINTMENTS, 1 VISIT has 1 BILLING). The system needs to guarantee data consistency, reliability, and support ACID transactions for billing and appointments.
*   **Initial AI Suggestion:** Considering Postgres or NoSQL (MongoDB). However, NoSQL doesn't fit the highly structured, relational nature of our schema constraint, and Postgres might be slightly overkill for an MVP of this scale.

### 2. Decision
*   We have decided to use **MySQL** as the primary relational database management system.
*   **Justification:** MySQL is highly reliable, ACID-compliant, and perfectly handles the strictly relational schema (5 tables) established in our Project Oath. For an MVP with a scale of 1-2 doctors and 10-20 patients/day, MySQL provides more than enough performance, requires very low operational overhead, and is universally supported by the Spring Boot / Hibernate ecosystem. 

### 3. Consequences
*   **Positive (Pros):**
    *   Ensures strong data consistency and integrity through foreign keys.
    *   Fast MVP setup and easy to deploy via Docker locally and on cloud servers.
    *   Extensive tooling and driver support in Java Spring Boot (Spring Data JPA).
*   **Negative (Cons / Tech Debt):**
    *   Schema migrations require careful management (e.g., using Flyway or Liquibase) compared to schemaless databases, though this is manageable for 5 tables.

### 4. Compliance & Verification
*   **Action items:** DevOps will provision a MySQL 8.0+ Docker container for local development. Backend team will configure Spring Data JPA to connect to it and test the 5-entity schema creation.
