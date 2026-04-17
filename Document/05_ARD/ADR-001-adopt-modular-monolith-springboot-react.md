# ADR-001: Adopt Modular Monolith with Spring Boot + React Tech Stack

| Field        | Value                                                   |
| ------------ | ------------------------------------------------------- |
| **Date**     | 2026-04-16                                              |
| **Status**   | Accepted                                                |
| **Author(s)**| Solution Architect (SA Lead)                            |
| **Applies to**| HCMS (Healthcare Clinic Management System) MVP Project |

---

## 1. Context

### 1.1 Business Context (Bối cảnh Nghiệp vụ)

We are building an **MVP-phase management system** for a small-to-medium healthcare clinic:

| Project | Domain | Scale | Users | MVP Timeline |
|---------|--------|-------|-------|--------------|
| **HCMS** | Healthcare Clinic (Pediatrics) | 1-2 BS, 10-20 khám/ngày, 1 chi nhánh | Patient, Doctor, Receptionist | 4-6 weeks |

### 1.2 Technical Constraints (Ràng buộc Kỹ thuật)

| Constraint | Detail |
|------------|--------|
| **Team Size** | 1 Tech Lead + 2-4 Mid/Junior developers per project |
| **Team Skill** | Java/Spring Boot proficient (university curriculum). React via bootcamp. Limited DevOps experience. |
| **Budget** | Hosting: $20-80/month per project (VPS or low-tier cloud) |
| **Timeline** | 3-6 weeks MVP. No room for complex infrastructure setup. |
| **Concurrent Users** | 50-500 CCU max at peak. No flash-sale or viral-traffic scenarios. |
| **Data Sensitivity** | HCMS requires patient data encryption (EMR). Others: standard PII protection. |

### 1.3 Problem Statement

> **We need a robust, reusable architecture pattern and tech stack that the team can adopt with minimal ramp-up time**, ensuring fast delivery, low hosting cost, and sufficient extensibility for post-MVP growth.

---

## 2. Options Considered (Các Phương án Đánh giá)

### Option A: Microservices (Spring Cloud + K8s)

| Criterion | Assessment |
|-----------|-----------|
| Infra Cost | $150-400/mo minimum (EKS/GKE + service mesh + monitoring) |
| Team Fit | Requires K8s, Docker orchestration, distributed tracing — Junior team cannot operate |
| Time-to-Market | 3-4 months for infra alone before any business logic |
| Scalability | Excellent horizontal scaling per service |
| **Verdict** | **REJECTED** — Catastrophically over-engineered for 50-500 CCU MVPs. Kills both budget and timeline. |

### Option B: Serverless (AWS Lambda + API Gateway)

| Criterion | Assessment |
|-----------|-----------|
| Infra Cost | Pay-per-invoke ($5-20/mo at MVP scale) |
| Team Fit | Requires AWS Lambda + SAM/CDK experience. Cold-start debugging is non-trivial. |
| Time-to-Market | 6-8 weeks with learning curve |
| Scalability | Auto-scales to zero |
| Local Dev | LocalStack/SAM Local adds significant development friction |
| **Verdict** | **REJECTED** — Cold-start latency (3-8s) unacceptable for real-time booking UX. Vendor lock-in contradicts academic portability goals. |

### Option C: Modular Monolith (Spring Boot + React) — Recommended

| Criterion | Assessment |
|-----------|-----------|
| Infra Cost | $20-40/mo (single VPS: DigitalOcean/Vultr) |
| Team Fit | Spring Boot is university curriculum. React is mainstream. Zero ramp-up. |
| Time-to-Market | 3-4 weeks to production-ready MVP |
| Scalability | Vertical scaling only, but sufficient for 500 CCU |
| Maintainability | Clear module boundaries. Can extract to microservices post-MVP if needed. |
| Local Dev | `mvn spring-boot:run` + `npm start` — works on any laptop |
| **Verdict** | **APPROVED** — Best ROI. Fastest time-to-market. Team-ready. |

---

## 3. Decision (Quyết định)

**We will adopt the Modular Monolith architecture pattern with the following standardized tech stack for the HCMS MVP project.**

### 3.1 Architecture Pattern

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                     │
│              React 19 + Vite (SPA)                  │
│         Tailwind CSS / React Components             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / REST API
┌──────────────────────▼──────────────────────────────┐
│                  API GATEWAY LAYER                  │
│            Spring Boot 3.x (Embedded Tomcat)        │
│         JWT Auth Filter ← Spring Security           │
├─────────────────────────────────────────────────────┤
│                  MODULE LAYER (Bounded Contexts)    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ Booking  │ │ Patient/ │ │ Doctor/  │ │ Auth   │  │
│  │ Module   │ │ Customer │ │ Staff    │ │ Module │  │
│  │          │ │ Module   │ │ Module   │ │        │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘  │
│       │            │            │            │      │
│  ┌────▼────────────▼────────────▼────────────▼────┐ │
│  │           SHARED KERNEL (Common DTOs,          │ │
│  │           Exceptions, Utils, Base Entities)    │ │
│  └────────────────────┬───────────────────────────┘ │
├───────────────────────┼─────────────────────────────┤
│                  DATA LAYER                         │
│         Spring Data JPA + Hibernate ORM             │
│                 MySQL 8.0+                          │
│         (Flyway for DB Migrations)                  │
└─────────────────────────────────────────────────────┘
```

### 3.2 Full Tech Stack

#### Backend

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Runtime** | Java | 17 LTS | Long-term support. University standard. |
| **Framework** | Spring Boot | 3.5.13 | Auto-configuration. Massive ecosystem. Industry #1 for Java. |
| **Security** | Spring Security + JWT + OAuth2 with Google | — | Stateless auth. No session management overhead. |
| **ORM** | Spring Data JPA + Hibernate | — | Type-safe queries. Auto schema generation. |
| **Database** | MySQL | 8.0+ | ACID compliant. JSON support. Encryption at rest (HCMS requirement). |
| **Migration** | Flyway | — | Version-controlled database schema evolution. |
| **Validation** | Jakarta Validation (Bean Validation) | — | Declarative constraint annotations. |
| **Object Mapping** | MapStruct | — | Compile-time, type-safe Entity ↔︎ DTO mapping. High performance. |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) | — | Auto-generated API documentation. |
| **Build Tool** | Maven | — | Standard, well-documented. IDE-friendly. |
| **Message Queue** | RabbitMQ (Optional) | — | For async notifications (email/SMS). Only if needed. |
| **Caching** | Redis (Optional) | — | Session caching, rate limiting. Post-MVP consideration. |

#### Frontend

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Framework** | React | 19 | Component-based. Largest community. Team knows it. |
| **Build Tool** | Vite | 8.0 | Lightning-fast HMR. 10x faster than CRA. |
| **UI Library** | Tailwind CSS | 5+ | Enterprise-grade components. Form, Table, DatePicker out-of-box. |
| **State Mgmt** | Zustand or React Context | — | Lightweight. No Redux boilerplate for MVP scale. |
| **HTTP Client** | Axios | — | Interceptors for JWT token refresh. |
| **Routing** | React Router | 7.0 | Standard SPA routing. |
| **Language** | TypeScript | 5.0 | Type safety. Better DX for team collaboration. |

#### DevOps & Infrastructure

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **VCS** | Git + GitHub | Student-familiar. Free CI/CD via GitHub Actions. |
| **CI/CD** | GitHub Actions | Auto-build + deploy on push to `main`. |
| **Hosting (BE)** | DigitalOcean Droplet / Railway | $12-24/mo. SSH access. Simple deployment. |
| **Hosting (FE)** | Vercel / Netlify (Free tier) | Zero-config React deployment. Auto HTTPS. |
| **DB Hosting** | Managed MySQL (DO) | $15/mo. Auto backups. |
| **Containerization** | Docker + Docker Compose | Local dev parity. Single `docker-compose up`. |
| **Monitoring** | Spring Actuator + Uptime Robot | Health checks. Free uptime monitoring. |

### 3.3 Project Structure (Chuẩn thư mục)

```
project-root/
├── backend/
│   ├── src/main/java/com/project/
│   │   ├── config/          ← Security, CORS, JWT config
│   │   ├── common/          ← Shared kernel: DTOs, Exceptions, Utils
│   │   ├── auth/            ← Auth Module: login, register, roles
│   │   ├── booking/         ← Booking Module (or domain-specific)
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   └── dto/
│   │   ├── patient/         ← Patient/Customer Module
│   │   ├── doctor/          ← Doctor/Staff Module
│   │   └── notification/    ← Notification Module (optional)
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/    ← Flyway SQL scripts
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/             ← Cấu hình cốt lõi (guards, layouts, provider, routers)
│   │   │   ├── guards/
│   │   │   ├── layouts/
│   │   │   ├── provider/
│   │   │   ├── routers/
│   │   │   └── App.jsx
│   │   ├── assets/          ← Tài nguyên tĩnh (images, fonts)
│   │   ├── features/        ← Các module tính năng (pages, logic)
│   │   ├── shared/          ← Các thành phần tái sử dụng
│   │   │   ├── components/
│   │   │   ├── hoc/
│   │   │   ├── hooks/
│   │   │   ├── services/    ← Giao tiếp API
│   │   │   └── utils/
│   │   └── styles/          ← Styling toàn cục
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   ├── adr/                 ← Architecture Decision Records
│   └── api/                 ← OpenAPI YAML specs
├── docker-compose.yml
└── README.md
```

---

## 4. Consequences (Hệ quả)

### Positive (Tích cực)

| # | Impact | Detail |
|---|--------|--------|
| 1 | **Fastest time-to-market** | Single deployable unit. No inter-service communication overhead. MVP in 3-4 weeks. |
| 2 | **Lowest infrastructure cost** | 1 VPS ($20-40/mo) runs everything. No K8s, no service mesh, no API gateway infra. |
| 3 | **Zero team ramp-up** | Spring Boot + React are university curriculum. Team is productive from Day 1. |
| 4 | **Simple debugging** | Single process. Stack traces are linear. No distributed tracing needed. |
| 5 | **Highly Reusable** | Organized by bounded contexts. Code templates and patterns can be easily reused or extracted later. |
| 6 | **Clear upgrade path** | Module boundaries are enforced via Java packages. If any module needs to scale independently post-MVP, extract it as a separate service with minimal refactoring. |

### Negative (Tiêu cực / Nợ kỹ thuật)

| # | Risk | Mitigation |
|---|------|------------|
| 1 | **Single point of failure** | If the monolith crashes, all modules go down. **Mitigation:** Health checks via Spring Actuator + auto-restart via systemd/Docker restart policy. |
| 2 | **Vertical scaling limit** | Cannot scale individual modules independently. **Mitigation:** At MVP scale (50-500 CCU), a $40/mo VPS handles this easily. Revisit at 5,000+ CCU. |
| 3 | **Deployment coupling** | Any module change requires full redeployment. **Mitigation:** CI/CD pipeline deploys in < 2 minutes. Blue-green deployment via Docker if zero-downtime is critical. |
| 4 | **Module boundary discipline** | Developers may accidentally bypass module boundaries (direct DB queries across modules). **Mitigation:** Code review checklist + package-private access modifiers enforced. |

### Neutral (Trung lập)

- Database schema migrations are managed via Flyway — same operational overhead regardless of architecture pattern.
- JWT stateless authentication works identically across monolith and microservices — no migration cost if pattern changes.

---

## 5. Compliance & Verification (Kiểm chứng)

| # | Verification Action | Owner | Deadline |
|---|-------------------|-------|----------|
| 1 | Scaffold base project template with all modules + Docker Compose | Tech Lead | Sprint 0 (Week 1) |
| 2 | Load test: Verify 500 CCU sustained via JMeter/Locust on staging VPS | Backend Team | Sprint 1 |
| 3 | Security audit: Confirm JWT implementation + OAuth2 Google Login + CORS policy | Tech Lead | Sprint 1 |
| 4 | HCMS-specific: Verify MySQL encryption at rest + AES-256 for EMR fields | Backend Team | Sprint 1 |
| 5 | CI/CD pipeline: GitHub Actions → Docker build → Deploy to staging on push to `develop` | DevOps | Sprint 0 |

---

## 6. Related Documents (Tài liệu Liên quan)

| Document | Path | Relationship |
|----------|------|-------------|
| ADR-002 | `05_ADR/ADR-002-use-mysql.md` | Database selection decision |
| ADR-003 | `05_ADR/ADR-003-jwt-authentication.md` | Authentication strategy |
| HCMS Business Goals | `01_Businesses/HCMS_Business_Goals_v0.1.html` | NFR source: EMR encryption, 1-2 doctors scale |

---

## 7. Decision Log (Nhật ký Quyết định)

| Date | Action | By |
|------|--------|----|
| 2026-04-16 | ADR-001 created. Status: **Accepted**. | SA Lead |
| — | *Future: If any project exceeds 5,000 CCU, create ADR-00X to evaluate Microservices extraction.* | — |

---

> **Architect's Note:** This ADR intentionally constrains the HCMS project to a simple, unified pattern and stack. The goal is **consistency over premature optimization**. A team that masters one stack delivers faster than a team dealing with distributed complexity. For an MVP-phase product serving small clinic traffic, a well-structured monolith is not a compromise — it is the optimal engineering decision.
