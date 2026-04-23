# Layer 5A: Unit Test Convention (HCMS)

> **Parent context:** `05-testing-convention.md` (universal rules, naming, test data)
> **Report template:** `Template/SEP490_G1_Report5.1_Unit_Test.xlsx`

---

## 1. Tech Stack

<ut_tech_stack>
  <runtime>Java 17 LTS</runtime>
  <framework>JUnit 5 (Jupiter) + Mockito 5.x</framework>
  <runner>@ExtendWith(MockitoExtension.class)</runner>
  <assertions>AssertJ / JUnit 5 Assertions</assertions>
  <coverage>JaCoCo – target ≥ 80% line coverage per Service class</coverage>
  <build>Maven → mvn test</build>
  <test_location>src/test/java/com/hcms/{module}/service/</test_location>
  <naming_pattern>{ClassName}Test.java  e.g. PatientServiceTest.java</naming_pattern>
</ut_tech_stack>

---

## 2. Test Design Techniques (UT Focus)

<ut_techniques>
  <technique name="Equivalence Partitioning (EP)">
    Chia các giá trị đầu vào thành các nhóm tương đương (valid/invalid). Mỗi nhóm chỉ cần test 1 giá trị đại diện.
    - Ví dụ: Tuổi bệnh nhi (0-15: valid, <0 hoặc >15: invalid).
  </technique>

  <technique name="Boundary Value Analysis (BVA)">
    Kiểm tra các giá trị tại biên của phân vùng tương đương (Min, Min+, Max, Max-).
    - Ví dụ: Với Patient Name (Length: 2-100), test với 1, 2, 3, 99, 100, 101 ký tự.
  </technique>

  <technique name="Classification Tree Method (CTM)">
    Phân loại các khía cạnh của input (Classification) và các lớp giá trị (Classes). Tổ hợp chúng lại để tạo test case tối ưu.
    - Sử dụng khi một method có nhiều tham số đầu vào phối hợp phức tạp.
  </technique>

  <technique name="Decision Table Testing">
    Sử dụng bảng quyết định để liệt kê các tổ hợp logic của điều kiện đầu vào và kết quả tương ứng.
    - Áp dụng cho: Billing logic (paid/unpaid status), Slot validation (available/conflict).
  </technique>

  <technique name="Error Guessing">
    Dựa trên kinh nghiệm để liệt kê các trường hợp lỗi tiềm ẩn (null object, empty string, special characters).
  </technique>
</ut_techniques>

---

## 3. UT-Specific Rules

<ut_rules>

  <rule id="UT-R01" name="Service Layer Only">
    Unit test TARGET: Service classes chỉ (PatientService, AppointmentService,
    VisitService, PrescriptionService, BillingService, AuthService).
    Controller và Repository KHÔNG là đối tượng UT trực tiếp.
  </rule>

  <rule id="UT-R02" name="Mock All Dependencies">
    Mọi dependency của Service phải được Mock:
    - Repository  → @Mock
    - External API → @Mock
    - Mapper       → @Mock hoặc dùng real mapper (tùy độ phức tạp)
    Tuyệt đối không để DB thật hoặc HTTP thật được gọi.
  </rule>

  <rule id="UT-R03" name="Decision Table Coverage">
    Mỗi method cần có đủ test case phủ toàn bộ decision table:
    - Happy path (valid inputs)
    - Boundary values (min/max)
    - Invalid inputs (null, empty, wrong format)
    - Exception paths (entity not found, conflict)
  </rule>

  <rule id="UT-R04" name="Coverage Target">
    JaCoCo line coverage ≥ 80% mỗi Service class.
    Chạy: mvn test jacoco:report → kiểm tra target/site/jacoco/index.html
  </rule>

  <rule id="UT-R05" name="Sheet Granularity">
    Mỗi method under test = 1 sheet riêng (TS_{Module}_{NNN}).
    Không gộp nhiều method vào 1 sheet.
  </rule>

</ut_rules>

---

## 3. Naming Convention (UT)

<ut_naming>

  <!-- Excel Sheet Name -->
  Pattern : TS_{Module}_{NNN}
  Examples:
    TS_Auth_001      → AuthService.login()
    TS_Auth_002      → AuthService.register()
    TS_Patient_001   → PatientService.createPatient()
    TS_Booking_001   → AppointmentService.bookSlot()
    TS_Clinical_001  → VisitService.recordVisit()
    TS_Pharmacy_001  → PrescriptionService.issuePrescription()
    TS_Finance_001   → BillingService.generateInvoice()

  <!-- Test Case Column ID (decision table) -->
  Pattern : UTCID{NN}
  Examples: UTCID01, UTCID02, UTCID03 ...

  <!-- Java Test Class -->
  Pattern : {ServiceName}Test.java
  Examples: PatientServiceTest.java, BillingServiceTest.java

  <!-- Java Test Method -->
  Pattern : should{ExpectedBehavior}When{Condition}()
  Examples:
    shouldCreatePatientSuccessfullyWhenValidRequest()
    shouldThrowExceptionWhenPatientNotFound()
    shouldReturnBillingWhenVisitIsCompleted()
    shouldRejectBookingWhenSlotAlreadyTaken()

</ut_naming>

---

## 4. Output Format – SEP490_G1_Report5.1_Unit_Test.xlsx

<ut_output_format>

  <cover_sheet>
    Fields : Project Name | Project Code | Document Code | Creator | Issue Date | Version
    Record of Change table: Effective Date | Version | Change Item | *A,D,M | Change description | Reference
    Document Code pattern : HCMS_UnitTest_v{X.Y}
    *A,D,M meanings       : A = Add | D = Delete | M = Modify
  </cover_sheet>

  <method_list_sheet name="MethodList">
    <!-- Index of ALL test suites in this document -->
    Header info:
      Normal number of Test cases/KLOC : 100
      Test Environment Setup Description:
        1. IntelliJ IDEA with JDK 17 and JUnit 5 + Mockito dependency
        2. Maven build tool (mvn test)
        3. JaCoCo plugin for coverage report

    Columns (one row per method):
      No           | Sequential (1.0, 2.0, ...)
      Module Name  | Module under test (Authentication, Patient, Booking, Clinical, Pharmacy, Finance)
      Method Name  | Exact Java method name (e.g. createPatient, bookSlot)
      Sheet Name   | Linked sheet (e.g. TS_Patient_001)
      Description  | One-line purpose of the method
      Pre-Condition| What must be true before any TC in this suite runs
  </method_list_sheet>

  <statistics_sheet name="Statistics">
    Columns: No | Module Name | Passed | Failed | Untested | N/A/B | Total Test Cases
    One row per TS_ sheet.
    Final row: SUM totals.
    Status legend (top-right corner): Passed | Failed | Pending | N/A
  </statistics_sheet>

  <test_suite_sheet name="TS_{Module}_{NNN}">
    <!-- Decision Table format – match template exactly -->

    HEADER BLOCK (rows 1–5):
      Row 1 : Code Module | [Module]   | [blank] | [blank] | [blank] | Method | [blank] | ... | [MethodName]
      Row 2 : Created By  | [TesterID] | [blank] | [blank] | [blank] | Executed By | [blank] | ... | [TesterID]
      Row 3 : Test requirement | [brief description of what is being tested]
      Row 4 : Passed | [blank] | Failed | [blank] | Untested | [blank] | N/A/B | [blank] | Total Test Cases
      Row 5 : [pass count] | [blank] | [fail count] | [blank] | [untested count] | [blank] | [n/a count] | [blank] | [total]

    COLUMN HEADER ROW:
      Col A: Condition
      Col B: Precondition
      Col C: [description sub-col]
      Col D: [description sub-col]
      Col E: [description sub-col]
      Col F+: UTCID01 | UTCID02 | UTCID03 | ... (one column per test case)

    CONDITION ROWS:
      - Group label row: e.g. "Enter the username:" (merged, italic)
      - Value rows: [blank] | [input value] | [blank x3] | O (mark which UTCID uses this value)
      - Only ONE "O" per input group row per UTCID column (mutually exclusive values)

    CONFIRM ROWS:
      Row label : Confirm | Return
      Sub-rows  : [blank] | [expected return value per UTCID]
      e.g.        [blank] | 200 OK - Patient created | [blank] | 400 Bad Request | ...

    RESULT ROW:
      Label: Result
      Values: Passed | Failed | N/A | Passed | ... (one per UTCID column)
  </test_suite_sheet>

</ut_output_format>

---

## 5. HCMS UT Suite Map

<ut_suite_map>
  TS_Auth_001     → AuthService.login()           [UC-01 backend]
  TS_Auth_002     → AuthService.register()        [UC-02 backend]
  TS_Patient_001  → PatientService.createPatient()[UC-02, UC-07]
  TS_Patient_002  → PatientService.updatePatient()[UC-14]
  TS_Booking_001  → AppointmentService.bookSlot() [UC-01, UC-06]
  TS_Booking_002  → AppointmentService.confirmAppointment() [UC-06]
  TS_Booking_003  → AppointmentService.registerWalkIn()     [UC-07]
  TS_Clinical_001 → VisitService.recordVisit()              [UC-12]
  TS_Clinical_002 → VisitService.finalizeConsultation()     [UC-13]
  TS_Pharmacy_001 → PrescriptionService.issuePrescription() [UC-13]
  TS_Finance_001  → BillingService.generateInvoice()        [UC-13 post]
  TS_Finance_002  → BillingService.markAsPaid()             [UC-09]
</ut_suite_map>

---

## 6. Code Sample

<ut_code_sample>

```java
@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private PatientMapper patientMapper;

    @InjectMocks
    private PatientService patientService;

    // TS_Patient_001 – createPatient()
    @Test
    // UTCID01 – Happy path: valid request
    void shouldCreatePatientSuccessfullyWhenValidRequest() {
        // Arrange
        PatientRequest req = new PatientRequest("Nguyen Van A", "2020-01-15", "MALE", "0901234567");
        PatientEntity entity = new PatientEntity();
        PatientEntity saved  = new PatientEntity(); saved.setId(UUID.randomUUID());
        PatientResponse expected = new PatientResponse();

        when(patientMapper.toEntity(req)).thenReturn(entity);
        when(patientRepository.save(entity)).thenReturn(saved);
        when(patientMapper.toResponse(saved)).thenReturn(expected);

        // Act
        PatientResponse result = patientService.createPatient(req);

        // Assert
        assertNotNull(result);
        verify(patientRepository, times(1)).save(entity);
    }

    @Test
    // UTCID02 – Invalid: blank fullName → validation exception
    void shouldThrowValidationExceptionWhenFullNameIsBlank() {
        PatientRequest req = new PatientRequest("", "2020-01-15", "MALE", "0901234567");

        assertThrows(ValidationException.class,
            () -> patientService.createPatient(req));

        verify(patientRepository, never()).save(any());
    }
}
```

</ut_code_sample>
