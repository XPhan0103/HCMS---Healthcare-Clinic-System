# Layer 4: Coding Conventions (HCMS)

This document establishes the official coding standards for the Healthcare Clinic Management System. Consistency across the team is mandatory.

## 1. Naming & Formatting Standards

### Global Naming DOs and DON'Ts

| Element | Format | DO | DON'T |
|---------|--------|----|-------|
| **Java Classes** | PascalCase | `PatientService` | `patientService`, `Patient_Service` |
| **Java Methods** | camelCase | `calculateTotalFee()` | `CalculateTotalFee()`, `calc_fee()` |
| **React Components** | PascalCase | `BookingCard` | `bookingCard`, `booking_card` |
| **URL Paths** | kebab-case | `/api/v1/patient-records` | `/api/v1/patientRecords` |
| **DB Tables** | snake_case (Plural) | `prescriptions` | `Prescription`, `prescription_table` |
| **DB Columns** | snake_case | `parent_phone` | `parentPhone`, `phone_no` |

### Code Style (Java)
- **Indentation:** 4 spaces (standard for Java).
- **Line Length:** Max 120 characters.
- **Braces:** Kernighan & Ritchie style (opening brace on the same line).

---

## 2. Testing Conventions (Detailed)

All tests must strictly follow the **AAA (Arrange, Act, Assert)** pattern.

### 2.1 Backend Unit Testing Sample (JUnit 5 + Mockito)
- **Goal:** Test logic in isolation without touching the Database.
- **File:** `src/test/java/.../service/PatientServiceTest.java`

```java
@ExtendWith(MockitoExtension.class)
class PatientServiceTest {
    @Mock
    private PatientRepository patientRepository;
    @InjectMocks
    private PatientService patientService;

    @Test
    void shouldCreatePatientSuccessfully() {
        // 1. Arrange (Setup data and mocks)
        PatientRequest request = new PatientRequest("John Doe", "0901234567");
        PatientEntity savedEntity = new PatientEntity();
        savedEntity.setId(1L);
        savedEntity.setFullName("John Doe");

        when(patientRepository.save(any(PatientEntity.class))).thenReturn(savedEntity);

        // 2. Act (Perform the operation)
        PatientResponse result = patientService.createPatient(request);

        // 3. Assert (Verify results and calls)
        assertNotNull(result.getId());
        assertEquals("John Doe", result.getFullName());
        verify(patientRepository, times(1)).save(any());
    }
}
```

### 2.2 Frontend Unit Testing Sample (Vitest + React Testing Library)
- **Goal:** Test component rendering and user interaction.
- **File:** `src/features/booking/components/__tests__/BookingButton.test.tsx`

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookingButton } from '../BookingButton';

describe('BookingButton Component', () => {
  it('should call onClick when clicked', () => {
    // 1. Arrange
    const handleClick = vi.fn();
    render(<BookingButton onClick={handleClick}>Book Now</BookingButton>);
    const button = screen.getByText('Book Now');

    // 2. Act
    fireEvent.click(button);

    // 3. Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when isLoading is true', () => {
    // 1. Arrange & Act
    render(<BookingButton isLoading={true}>Book Now</BookingButton>);
    const button = screen.getByRole('button');

    // 3. Assert
    expect(button).toBeDisabled();
    expect(screen.queryByText('Book Now')).not.toBeInDocument();
  });
});
```

### 2.3 Integration Testing Sample (Spring Boot Test)
- **Goal:** Verify the interaction between the API slice and the Service layer.
- **File:** `src/test/java/.../controller/PatientControllerIT.java`

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test") // Uses h2 or test DB
class PatientControllerIT {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldCreateAndRetrievePatient() {
        // Arrange
        PatientRequest request = new PatientRequest("Integrity Test", "0123456789");

        // Act
        ResponseEntity<ApiResponse<PatientResponse>> postResponse = 
            restTemplate.postForEntity("/api/v1/patients", request, ApiResponse.class);

        // Assert
        assertEquals(HttpStatus.CREATED, postResponse.getStatusCode());
        assertNotNull(postResponse.getBody().getData());
    }
}
```

---

## 3. Error Handling Conventions

- **Never Throw Generic Exceptions:** Don't throw `Exception` or `RuntimeException`. Always use custom business exceptions (`SlotConflictException`, `PatientNotFoundException`).
- **Standard Envelope:** All errors MUST return the unified `ApiResponse` format with a clear message and numeric business code.
- **Fail Fast:** Validate inputs at the earliest entry point (Controller layer using `@Valid`).

## 4. Documentation Standards

- **REST API:** Every endpoint must have `@Operation` and `@ApiResponse` annotations for Swagger/OpenAPI.
- **Complex Logic:** Use Javadoc (`/** ... */`) for methods that perform complex business calculations.
- **PR Rules:** No code is merged unless:
  - It has passing Unit Tests.
  - It follows the folder structure.
  - It doesn't violate the **Project Oath** (No scope creep).
