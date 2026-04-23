# Layer 5B: Integration Test Convention (HCMS)

> **Parent:** `05-testing-convention.md` | **Template:** `SEP490_G1_Report5.2_Integration_Test.xlsx`

---

## 1. Tech Stack

<it_tech_stack>
  <framework>Spring Boot Test (@SpringBootTest)</framework>
  <web_env>WebEnvironment.RANDOM_PORT</web_env>
  <http_client>TestRestTemplate / MockMvc</http_client>
  <database>H2 in-memory – @ActiveProfiles("test")</database>
  <data_setup>@Sql scripts or @BeforeEach with TestEntityManager</data_setup>
  <security>@WithMockUser or inject JWT via TestRestTemplate header</security>
  <test_location>src/test/java/com/hcms/{module}/controller/</test_location>
  <naming_pattern>{ControllerName}IT.java</naming_pattern>
</it_tech_stack>

---

## 2. Test Design Techniques (IT Focus)

<it_techniques>
  <technique name="Interface Testing">
    Kiểm tra sự truyền nhận dữ liệu giữa các module (Controller -> Service -> Repository).
    - Đảm bảo DTO được map chính xác sang Entity và ngược lại.
  </technique>

  <technique name="Equivalence Partitioning (EP)">
    Áp dụng cho API payloads. Chia các trường trong Request Body thành các phân vùng hợp lệ và không hợp lệ.
  </technique>

  <technique name="State Transition Testing">
    Kiểm tra sự thay đổi trạng thái của thực thể thông qua các API.
    - Ví dụ: `APPOINTMENT` (Pending -> Confirmed -> Checked-in -> Completed).
  </technique>

  <technique name="Pairwise Testing">
    Tổ hợp các tham số đầu vào API theo cặp để giảm số lượng test case mà vẫn đảm bảo độ phủ.
  </technique>
</it_techniques>

---

## 3. IT-Specific Rules

<it_rules>
  <rule id="IT-R01">TARGET: Controller → Service → Repository (full stack, H2 DB). Không mock Repository.</rule>
  <rule id="IT-R02">Bắt buộc @ActiveProfiles("test"). application-test.properties: spring.datasource.url=jdbc:h2:mem:hcms_test</rule>
  <rule id="IT-R03">Mỗi endpoint: ≥ 1 happy path TC (2xx) + ≥ 1 error TC (4xx).</rule>
  <rule id="IT-R04">Assert ApiResponse wrapper: { success, message, data, code } – không assert raw string.</rule>
  <rule id="IT-R05">Mỗi Module/Feature = 1 sheet. Group TCs theo operation: Create | Read | Update | Workflow.</rule>
</it_rules>

---

## 3. Naming Convention

<it_naming>
  TC ID     : TC_{Module}_{NN}       e.g. TC_Booking_01, TC_Finance_02
  Java class: {Controller}IT.java    e.g. AppointmentControllerIT.java
  Sheet name: "{Module} CRUD Operations" | "{Module} Workflow Management"
</it_naming>

---

## 4. Output Format – SEP490_G1_Report5.2_Integration_Test.xlsx

<it_output_format>

  <cover_sheet>
    Document Code pattern : HCMS_IntegrationTest_v{X.Y}
    Fields : Project Name | Project Code | Document Code | Creator | Issue Date | Version
    Record of Change : Effective Date | Version | Change Item | *A,D,M | Description | Reference
  </cover_sheet>

  <statistics_sheet name="Round {N} Test Statistics">
    Header : Project Name | Creator | Project Code | Reviewer | Document Code | Issue Date
    Columns: No | Module code | Passed | Failed | Pending | N/A | Number of test cases
    One row per feature sheet. Final row: SUM.
  </statistics_sheet>

  <feature_sheet name="{Module} CRUD Operations">
    HEADER BLOCK:
      Row 1: Feature        | [Name]   | [legend: Passed/Failed/Pending/N/A]
      Row 2: Test requirement| [desc]
      Row 3: Number of TCs  | [count]
      Row 4: Testing Round  | Passed | Failed | Pending | [blank] | N/A
      Row 5: Round 1        | [n]    | [n]    | [n]     |         | [n]
      Row 6: Round 2        | ...
      Row 7: Round 3        | ...

    COLUMN HEADERS (row 8):
      Test Case ID | Test Case Description | Test Case Procedure | Expected Results |
      Test Data | Pre-conditions |
      Round 1 | Test date | Tester |
      Round 2 | Test date | Tester |
      Round 3 | Test date | Tester | Note

    GROUP ROW: [Merged, bold] e.g. "Create Appointment"

    TC ROW example:
      TC_Booking_01 |
      "Create appointment with valid data" |
      "1. POST /api/v1/appointments with body\n2. Verify response" |
      "HTTP 201; body.data contains appointmentId, status=PENDING" |
      "{ patientId:[uuid], slotTime:[future], reason:'Fever' }" |
      "Patient exists; slot available" |
      Passed | 22/04/2026 | TesterID |
      Passed | 23/04/2026 | TesterID |
      Passed | 24/04/2026 | TesterID | ""
  </feature_sheet>

</it_output_format>

---

## 5. IT Suite Map

<it_suite_map>
  "Authentication"            → UC-01, UC-02  | /api/v1/auth/login, /api/v1/auth/register
  "Patient CRUD Operations"   → UC-02, UC-14  | /api/v1/patients (POST, GET, PATCH)
  "Booking CRUD Operations"   → UC-01,05,06,07| /api/v1/appointments (POST, GET, PATCH/confirm, walk-in)
  "Clinical Workflow"         → UC-10,11,12   | /api/v1/visits (queue, history, POST)
  "Pharmacy CRUD Operations"  → UC-13         | /api/v1/prescriptions (POST, GET)
  "Billing Workflow"          → UC-08, UC-09  | /api/v1/billings (GET, PATCH/pay)
</it_suite_map>

---

## 6. Code Sample

<it_code_sample>

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AppointmentControllerIT {

    @Autowired private TestRestTemplate restTemplate;

    @Test // TC_Booking_01 – happy path
    void shouldCreateAppointmentWhenValidRequest() {
        // Arrange
        AppointmentRequest req = new AppointmentRequest(patientId, futureSlot, "Fever");
        HttpEntity<AppointmentRequest> entity = withJwt(req);
        // Act
        ResponseEntity<ApiResponse> resp =
            restTemplate.postForEntity("/api/v1/appointments", entity, ApiResponse.class);
        // Assert
        assertEquals(HttpStatus.CREATED, resp.getStatusCode());
        assertTrue(resp.getBody().isSuccess());
    }

    @Test // TC_Booking_02 – slot conflict → 409
    void shouldReturn409WhenSlotAlreadyBooked() {
        AppointmentRequest req = new AppointmentRequest(patientId, takenSlot, "Cough");
        ResponseEntity<ApiResponse> resp =
            restTemplate.postForEntity("/api/v1/appointments", withJwt(req), ApiResponse.class);
        assertEquals(HttpStatus.CONFLICT, resp.getStatusCode());
    }
}
```

</it_code_sample>
