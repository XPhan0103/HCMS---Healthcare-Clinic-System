# Layer 5C: System Test Convention (HCMS)

> **Parent:** `05-testing-convention.md` | **Template:** `SEP490_G1_Report5.3_System_Test.xlsx`

---

## 1. Tech Stack

<st_tech_stack>
  <primary_tool>Manual testing (browser-based)</primary_tool>
  <automation>Postman Collection (smoke regression)</automation>
  <environment>Docker Compose: backend + MySQL 8.x + Vite frontend dev server</environment>
  <browsers>Chrome latest (primary), Firefox (secondary)</browsers>
  <test_data>V99__test_seed.sql – dedicated seed script for ST environment</test_data>
  <entry_point>Full end-to-end workflow per Use Case UC-01 → UC-14</entry_point>
  <acceptance>NFR thresholds: API response &lt; 2s; mobile-friendly (375px+)</acceptance>
</st_tech_stack>

---

## 2. Test Design Techniques (ST Focus)

<st_techniques>
  <technique name="Use Case Testing">
    Dựa vào các Use Case (UC-01 -> UC-14) để thiết kế kịch bản kiểm thử bao gồm luồng cơ bản (Normal Flow) và luồng thay thế (Alternative Flow).
  </technique>

  <technique name="State Transition Testing">
    Kiểm thử luồng nghiệp vụ E2E (End-to-End) xuyên suốt các module.
    - Luồng: Đặt lịch (Portal) -> Tiếp nhận (Dashboard) -> Khám (Clinical) -> Thanh toán (Billing).
  </technique>

  <technique name="Boundary Value Analysis (BVA)">
    Áp dụng cho các trường nhập liệu trên giao diện người dùng (UI Fields) như Số điện thoại, Ngày sinh, Tên thuốc.
  </technique>

  <technique name="Decision Table Testing">
    Áp dụng cho các quy tắc nghiệp vụ phức tạp (Business Rules - BR).
    - Ví dụ: Quy tắc thanh toán (BR-06), quy tắc xác thực OTP (BR-04).
  </technique>

  <technique name="Error Guessing">
    Kiểm tra các hành vi không mong muốn của người dùng (Double click, Refresh trang khi đang xử lý, nhập ký tự đặc biệt vào URL).
  </technique>
</st_techniques>

---

## 3. ST-Specific Rules

<st_rules>
  <rule id="ST-R01">TEST SCOPE: Full stack end-to-end – UI → API → DB → UI response.</rule>
  <rule id="ST-R02">Map 1-1 với Use Cases trong SRS: mỗi UC ≥ 1 TC happy path + alt flows quan trọng.</rule>
  <rule id="ST-R03">Acceptance Test sheet phải có đủ: GUI/Usability, Core Features, Performance, Security groups.</rule>
  <rule id="ST-R04">Test data phải độc lập với dev/prod DB. Reset về seed state trước mỗi Round.</rule>
  <rule id="ST-R05">Round 3 phải đạt 100% Passed hoặc N/A trước khi sign-off.</rule>
  <rule id="ST-R06">Screenshot/video evidence bắt buộc với mọi Failed TC (attach vào Note column).</rule>
</st_rules>

---

## 3. Naming Convention

<st_naming>
  TC ID      : TC_{Feature}_{NN}        e.g. TC_Booking_01, TC_EMR_05, TC_Billing_02
  Sheet name : {Feature Name} (matching Use Case feature group in SRS)
  Examples   : "Self-Service Booking" | "Clinical Consultation" | "Billing & Payment"
</st_naming>

---

## 4. Output Format – SEP490_G1_Report5.3_System_Test.xlsx

<st_output_format>

  <cover_sheet>
    Title   : SYSTEM TEST REPORT DOCUMENT
    Fields  : Project Name | Project Code | Document Code | Creator | Issue Date | Version
    Record of Change : Effective Date | Version | Change Item | *A,D,M | Description | Reference
    Document Code pattern: HCMS_SystemTest_v{X.Y}
  </cover_sheet>

  <test_cases_list_sheet name="Test Cases">
    Purpose: Master index of ALL ST test cases
    Header block:
      Project Name | [HCMS]
      Project Code | [HCMS-MVP]
      Test Environment Setup Description:
        1. Docker Compose up (backend + MySQL 8.x)
        2. Frontend: npm run dev (Vite, port 5173)
        3. Browser: Chrome latest, viewport 1440px desktop + 375px mobile
        4. DB seeded with V99__test_seed.sql

    Columns:
      No           | Sequential (1.0, 2.0, ...)
      Function Name| Use Case name (e.g. Book Appointment Online)
      Sheet Name   | Linked feature sheet name
      Description  | Brief TC description
      Pre-Condition| System state required before test
  </test_cases_list_sheet>

  <acceptance_test_sheet name="Acceptance Test">
    Columns: No | Acceptance Test Plan | Acceptance criteria description | Test Result (Accept)
    Result values: True / False

    GROUPS:
    GUI and Usability:
      - Interface displays in Vietnamese and English correctly
      - All mandatory fields validated with appropriate error messages
      - Navigation menu organized logically
      - Responsive on mobile (375px) and desktop (1440px)

    Core Features:
      - Patients can book appointments online (UC-01, UC-02)
      - Doctor can record clinical notes and prescriptions (UC-12, UC-13)
      - Receptionist can confirm and manage appointments (UC-06, UC-07)
      - Billing invoice auto-generated and 1-click paid (UC-08, UC-09)
      - Parent can view EMR via OTP link (UC-04)

    Performance:
      - API response time &lt; 2 seconds under normal load
      - Page load time &lt; 3 seconds on 4G mobile

    Security:
      - Unauthenticated users cannot access protected routes
      - OTP expires after 5 minutes (BR-04)
      - JWT token invalid after logout
  </acceptance_test_sheet>

  <statistics_sheet name="Round {N} Test Statistics">
    Header : Project Name | Creator | Project Code | Reviewer | Document Code | Issue Date
    Columns: No | Module code | Passed | Failed | Pending | N/A | Number of test cases
    One row per feature sheet. Final row: SUM.
  </statistics_sheet>

  <feature_sheet name="{Feature Name}">
    HEADER BLOCK:
      Row 1: Workflow       | [Name]   | [legend: Passed/Failed/Pending/N/A]
             (use "Feature" for CRUD sheets, "Workflow" for end-to-end flow sheets)
      Row 2: Test requirement| [desc]
      Row 3: Number of TCs  | [count]
      Row 4: Testing Round  | Passed | Failed | Pending | [blank] | N/A
      Row 5-7: Round 1/2/3  | [counts]

    COLUMN HEADERS (row 8):
      Test Case ID | Test Case Description | Test Case Procedure | Expected Results |
      Test Data | Pre-conditions |
      Round 1 | Test date | Tester |
      Round 2 | Test date | Tester |
      Round 3 | Test date | Tester | Note

    GROUP ROW: [Merged, bold] e.g. "Book Appointment Online" / "Confirm Appointment"

    TC ROW example:
      TC_Booking_01 |
      "Parent books appointment via Self-Service Portal" |
      "1. Open portal URL\n2. Select doctor & slot\n3. Click Continue\n4. Fill demographics\n5. Submit" |
      "Appointment created with status=PENDING; success screen shown; receptionist dashboard updated" |
      "{ doctor: BS.Minh, slot: next day 08:00, child: Nguyen Thi B, parentPhone: 0901234567 }" |
      "Portal accessible; slot available" |
      Passed | 22/04/2026 | TesterID |
      Passed | 23/04/2026 | TesterID |
      Passed | 24/04/2026 | TesterID | ""
  </feature_sheet>

</st_output_format>

---

## 5. ST Suite Map

<st_suite_map>
  "Self-Service Booking"       → UC-01 (slot select), UC-02 (demographics), UC-03 (confirmation)
  "Patient EMR Portal"         → UC-04 (OTP + view notes)
  "Appointment Management"     → UC-05 (dashboard), UC-06 (confirm), UC-07 (walk-in)
  "Billing & Payment"          → UC-08 (view invoice), UC-09 (1-click paid)
  "Clinical Dashboard"         → UC-10 (queue), UC-11 (patient history)
  "Clinical Consultation"      → UC-12 (record visit), UC-13 (prescription + auto billing)
  "Patient Profile Management" → UC-14 (edit profile, allergy)
</st_suite_map>

---

## 6. Acceptance Criteria Checklist

<st_acceptance_checklist>
  <!-- Sign-off conditions before UAT -->
  [ ] Round 3 Statistics: 0 Failed, 0 Pending across all feature sheets
  [ ] Acceptance Test sheet: ALL criteria = True
  [ ] Performance: Postman collection avg response &lt; 2000ms
  [ ] Security: Auth bypass attempts all return 401/403
  [ ] Mobile: All screens usable on 375px viewport
  [ ] Scope: No insurance or inventory features tested (Project Oath)
</st_acceptance_checklist>
