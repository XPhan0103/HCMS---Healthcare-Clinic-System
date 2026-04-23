# Layer 5: Testing Convention (HCMS)

> **Sub-context files (per level):**
> - `05a-ut-convention.md` — Unit Test (UT) detail
> - `05b-it-convention.md` — Integration Test (IT) detail
> - `05c-st-convention.md` — System Test (ST) detail

<testing_context>
  <persona>
    Senior QA Engineer với 10+ năm kinh nghiệm kiểm thử phần mềm y tế.
    Tuân thủ nghiêm ngặt ISTQB standards và SEP490 academic reporting format.
    Mọi test artifact phải đủ điều kiện submit vào báo cáo SEP490_G1_Report5.x.
  </persona>

  <project_scope>
    - Hệ thống: HCMS – Healthcare Clinic Management System (MVP Nhi khoa)
    - 5 Core Entities: PATIENT, APPOINTMENT, VISIT, PRESCRIPTION, BILLING
    - 6 Modules: Auth, Patient (Booking), Clinical, Pharmacy, Finance, Shared Kernel
    - 14 Use Cases: UC-01 → UC-14
    - Out-of-scope: Insurance, Inventory management
  </project_scope>
</testing_context>

---

## 1. Tech Stack Per Test Level

<tech_stack>

  <unit_test label="UT">
    <backend>
      - Runtime: Java 17 LTS
      - Framework: JUnit 5 (Jupiter) + Mockito 5.x
      - Runner: @ExtendWith(MockitoExtension.class)
      - Assertions: AssertJ / JUnit 5 Assertions
      - Coverage tool: JaCoCo (target ≥ 80% line coverage per Service class)
      - Build: Maven (mvn test)
      - Test location: src/test/java/com/hcms/{module}/service/
      - Naming pattern: {ClassName}Test.java (e.g. PatientServiceTest.java)
    </backend>
  </unit_test>

  <integration_test label="IT">
    <backend>
      - Framework: Spring Boot Test (@SpringBootTest)
      - Web environment: WebEnvironment.RANDOM_PORT
      - HTTP client: TestRestTemplate / MockMvc
      - DB: H2 in-memory (@ActiveProfiles("test"))
      - Data setup: @Sql scripts or @BeforeEach with TestEntityManager
      - Test location: src/test/java/com/hcms/{module}/controller/
      - Naming pattern: {ClassName}IT.java (e.g. PatientControllerIT.java)
    </backend>
  </integration_test>

  <system_test label="ST">
    - Tool: Manual + Postman Collection (automated smoke)
    - Environment: Docker Compose (backend + MySQL 8.x + frontend dev server)
    - Browser: Chrome latest (primary), Firefox (secondary)
    - Test data: Dedicated test DB seed script (V99__test_seed.sql)
    - Entry: Full end-to-end workflow per Use Case (UC-01 → UC-14)
    - Acceptance criteria: NFR thresholds (response &lt; 2s, mobile-friendly)
  </system_test>

</tech_stack>

---

## 2. Universal Testing Rules

<testing_rules>

  <rule id="TR-01" name="AAA Pattern">
    Mọi test case PHẢI tuân thủ cấu trúc:
    // 1. Arrange – Setup dữ liệu, mock, preconditions
    // 2. Act    – Gọi method/API được test
    // 3. Assert – Kiểm tra kết quả, side effects, verify interactions
  </rule>

  <rule id="TR-02" name="Single Responsibility">
    Mỗi test case chỉ kiểm tra DUY NHẤT một behavior/scenario.
    Không gộp nhiều assertions vô liên quan vào một test.
  </rule>

  <rule id="TR-03" name="Isolation">
    UT: Không gọi DB thật, không gọi HTTP thật → dùng Mock/Stub.
    IT: Không dùng production DB → dùng H2 + test profile.
    ST: Dùng dedicated test environment, không chạy trên production.
  </rule>

  <rule id="TR-04" name="Deterministic">
    Test phải cho kết quả nhất quán mỗi lần chạy.
    Cấm dùng Thread.sleep() tùy tiện, Math.random() không seed.
    Dùng fixed test data, @BeforeEach reset state.
  </rule>

  <rule id="TR-05" name="Scope Guard (Project Oath)">
    Test KHÔNG được tạo test data vượt quá 5 entities cốt lõi.
    Không test insurance logic, inventory management.
    Bất kỳ TC nào liên quan Out-of-Scope → đánh dấu N/A và ghi chú.
  </rule>

  <rule id="TR-06" name="Multi-Round Execution">
    Mỗi feature sheet chạy tối thiểu 3 rounds:
    - Round 1: Initial run (có thể có Failed)
    - Round 2: After bug fix (re-test failed cases)
    - Round 3: Final regression (phải đạt 100% Passed hoặc N/A)
  </rule>

  <rule id="TR-07" name="Coverage Targets">
    UT Backend Service layer: ≥ 80% line coverage (JaCoCo)
    UT Frontend Components: ≥ 70% branch coverage (Vitest)
    IT: 100% happy path + tối thiểu 1 alternative flow mỗi endpoint
    ST: 100% UC coverage (UC-01 đến UC-14), 100% Acceptance Criteria
  </rule>

</testing_rules>

---

## 3. Naming Convention

<naming_convention>

  <unit_test>
    <!-- Test Suite Sheet Name -->
    Pattern : TS_{Module}_{NNN}
    Examples: TS_Auth_001, TS_Booking_002, TS_Clinical_003

    <!-- Test Case ID (per cell in decision table) -->
    Pattern : UTCID{NN}
    Examples: UTCID01, UTCID02, UTCID03

    <!-- Java Test Class -->
    Pattern : {ServiceName}Test.java
    Examples: PatientServiceTest.java, BillingServiceTest.java

    <!-- Java Test Method -->
    Pattern : should{ExpectedBehavior}When{Condition}()
    Examples: shouldThrowExceptionWhenPatientNotFound()
              shouldReturnBillingWhenVisitIsCompleted()

    <!-- Frontend Test File -->
    Pattern : {ComponentName}.test.tsx
    Examples: BookingForm.test.tsx, PatientCard.test.tsx
  </unit_test>

  <integration_test>
    <!-- Test Case ID -->
    Pattern : TC_{Module}_{NN}
    Examples: TC_Auth_01, TC_Booking_03, TC_Clinical_02

    <!-- Java IT Class -->
    Pattern : {ControllerName}IT.java
    Examples: PatientControllerIT.java, AppointmentControllerIT.java

    <!-- Sheet Name (per feature/module) -->
    Pattern : {Module} CRUD Operations | {Module} Workflow Management
    Examples: "Booking CRUD Operations", "Billing Workflow Management"
  </integration_test>

  <system_test>
    <!-- Test Case ID -->
    Pattern : TC_{Feature}_{NN}
    Examples: TC_Booking_01, TC_EMR_05, TC_Billing_02

    <!-- Sheet Name (per Use Case group) -->
    Pattern : {Feature Name} (matching UC feature group)
    Examples: "Self-Service Booking", "Clinical Consultation", "Billing & Payment"
  </system_test>

  <common>
    <!-- Status values (EXACTLY as in template) -->
    Passed  → Passed
    Failed  → Failed
    Pending → Pending (not yet executed)
    N/A     → N/A (out of scope or not applicable)

    <!-- Tester ID format -->
    Pattern : {LastnameInitials}{FirstnameInitials} (no spaces)
    Examples: NguyenVA → NguyenVA, TranTH → TranTH
  </common>

</naming_convention>

---

## 4. Output Rules Per Test Level

> Chi tiết output format cho từng level đã được tách vào file riêng:
> - **UT output:** xem `05a-ut-convention.md` → Section 4
> - **IT output:** xem `05b-it-convention.md` → Section 4
> - **ST output:** xem `05c-st-convention.md` → Section 4

<output_rules_summary>
  <common_cover_fields>
    Fields : Project Name | Project Code | Document Code | Creator | Issue Date | Version
    Record of Change : Effective Date | Version | Change Item | *A,D,M | Change description | Reference
    Document Code patterns:
      UT → HCMS_UnitTest_v{X.Y}
      IT → HCMS_IntegrationTest_v{X.Y}
      ST → HCMS_SystemTest_v{X.Y}
  </common_cover_fields>

  <common_status_legend>
    Passed  = TC executed, result matches expected
    Failed  = TC executed, result does NOT match expected
    Pending = TC not yet executed
    N/A     = Not applicable / out of scope
  </common_status_legend>

  <common_round_tracking>
    Round 1 | Test date | Tester   ← initial run
    Round 2 | Test date | Tester   ← re-test after bug fix
    Round 3 | Test date | Tester   ← final regression
  </common_round_tracking>

</output_rules_summary>




---

## 5. HCMS Test Suite Map

> Chi tiết suite map cho từng level:
> - **UT suites:** `05a-ut-convention.md` → Section 5
> - **IT suites:** `05b-it-convention.md` → Section 5
> - **ST suites:** `05c-st-convention.md` → Section 5

<test_suite_map_overview>
  <!-- UC coverage summary across all levels -->
  UC-01 → IT: Booking CRUD     | ST: Self-Service Booking
  UC-02 → IT: Patient CRUD     | ST: Self-Service Booking
  UC-03 → ST: Self-Service Booking (confirmation)
  UC-04 → ST: Patient EMR Portal
  UC-05 → IT: Booking CRUD     | ST: Appointment Management
  UC-06 → IT: Booking CRUD     | ST: Appointment Management
  UC-07 → IT: Booking CRUD     | ST: Appointment Management
  UC-08 → IT: Billing Workflow  | ST: Billing & Payment
  UC-09 → IT: Billing Workflow  | ST: Billing & Payment
  UC-10 → IT: Clinical Workflow | ST: Clinical Dashboard
  UC-11 → IT: Clinical Workflow | ST: Clinical Dashboard
  UC-12 → UT: TS_Clinical_001   | IT: Clinical Workflow | ST: Clinical Consultation
  UC-13 → UT: TS_Pharmacy_001   | IT: Pharmacy CRUD     | ST: Clinical Consultation
  UC-14 → UT: TS_Patient_002    | IT: Patient CRUD      | ST: Patient Profile

</test_suite_map_overview>

---

## 6. Test Data Convention

<test_data>
  <patient>
    Valid  : { fullName: "Nguyen Van A", dob: "2020-01-15", gender: "MALE", parentPhone: "0901234567" }
    Invalid: { fullName: "", dob: "2099-01-01", parentPhone: "abc" }
  </patient>
  <appointment>
    Valid  : { patientId: [existing UUID], slotTime: [next business day 08:00], reason: "Fever" }
    Invalid: { slotTime: [past date], patientId: [non-existent UUID] }
  </appointment>
  <visit>
    Valid  : { diagnosis: "Upper Respiratory Infection", symptoms: "Fever, cough" }
    Invalid: { diagnosis: "" } <!-- BR-07: diagnosis cannot be empty -->
  </visit>
  <prescription>
    Valid  : { drugName: "Paracetamol 250mg", dosage: "2 times/day", duration: 5 }
    Edge   : No medication prescribed (finalize without adding drugs - UC-13 Alt Flow)
  </prescription>
  <billing>
    Valid  : { status: "UNPAID" → "PAID", paymentMethod: "CASH" }
  </billing>
</test_data>

---

## 7. Quick Reference: Status Codes &amp; Validation

<validation_rules>
  <!-- Maps to Business Rules in SRS -->
  BR-01 : Patient fullName required, parentPhone 10 digits Vietnamese format
  BR-02 : Appointment slot must be future datetime, no double-booking same slot
  BR-03 : APPOINTMENT status flow: Pending → Confirmed | Cancelled → Checked-in → Completed
  BR-04 : OTP valid for 5 minutes only; max 3 attempts
  BR-05 : Walk-in appointment auto-status = Checked-in (bypasses Pending)
  BR-06 : BILLING auto-generated when VISIT is finalized
  BR-07 : VISIT.diagnosis field is mandatory (cannot save empty)
  BR-08 : PRESCRIPTION linked to active VISIT session
  BR-09 : EMR data access requires OTP authentication for parents
</validation_rules>

<api_response_contract>
  <!-- All endpoints return unified ApiResponse wrapper -->
  Success: { "success": true,  "message": "...", "data": {...}, "code": 200 }
  Error:   { "success": false, "message": "...", "data": null,  "code": 4xx/5xx }
  Page:    { "success": true,  "data": { "content": [...], "totalPages": N, ... } }
</api_response_contract>
