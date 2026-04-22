# Layer 3: Backend Technical Context (HCMS)

This layer provides deep technical specifications, directory mapping, and implementation samples for the Spring Boot backend.

## 1. Primary Tech Stack
- **Framework:** Spring Boot 3.5.x (Java 17 LTS).
- **Persistence:** Spring Data JPA + Hibernate + MySQL 8.x.
- **Security:** Spring Security + JWT + OAuth2 (Google).
- **Utilities:** MapStruct (Mapping), Lombok (Boilerplate), Flyway (Migration).

## 2. Exploded Directory Structure

```text
backend/src/main/java/com/project/
├── config/                  # Global configuration (Security, JWT, CORS, Swagger)
│   ├── SecurityConfig       # Endpoints access control
│   └── RestTemplateConfig   # External API configurations
├── common/                  # Shared Kernel (Used across all modules)
│   ├── api/                 # Generic API response envelopes
│   ├── audit/               # BaseEntity with @CreatedDate, @LastModifiedDate
│   ├── exception/           # GlobalException, BusinessException
│   └── util/                # Date, JSON, String utility classes
├── auth/                    # Module: Authentication & RBAC
│   ├── controller/          # Authentication endpoints: /login, /refresh
│   ├── service/             # JWT generation, Password hashing
│   └── dto/                 # AuthRequest, AuthResponse
├── booking/                 # Module: Appointment Management
│   ├── controller/          # Endpoints: /appointments
│   ├── entity/              # AppointmentEntity.java
│   ├── repository/          # AppointmentRepository.java
│   ├── service/             # Booking logic, slot validation
│   ├── mapper/              # MapStruct interfaces
│   └── dto/                 # AppointmentRequest, AppointmentResponse
└── patient/                 # Module: Patient Demographics
    ├── entity/              # PatientEntity.java
    ├── repository/          # PatientRepository.java
    └── service/             # Patient CRUD logic
```

## 3. Implementation Code Samples

### A. Core Entity with Audit (Shared Kernel)
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
public abstract class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt; // For soft-deletes
}
```

### B. MapStruct Mapper (Efficiency & Type Safety)
```java
@Mapper(componentModel = "spring")
public interface PatientMapper {
    // Maps Entity to DTO for response
    PatientResponse toResponse(PatientEntity entity);

    // Maps Request DTO to Entity for creation
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    PatientEntity toEntity(PatientRequest request);
}
```

### C. Standardized Controller Response
```java
@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @PostMapping
    public ResponseEntity<ApiResponse<PatientResponse>> createPatient(@Valid @RequestBody PatientRequest request) {
        PatientResponse data = patientService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Patient created successfully", data));
    }
}
```

### D. Global Exception Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
    }
}
```

## 4. Operational Best Practices
- **Persistence:** Always use `snake_case` for database table and column names in `@Table` and `@Column` annotations.
- **Transactions:** Use `@Transactional` at the Service layer for any business logic involving multiple database updates (e.g., Clinical Visit + Billing creation).
- **Validation:** Utilize standard Jakarta Validation annotations (`@NotBlank`, `@Email`, `@Size`) in Request DTOs to catch errors early.
- **Logging:** Use SLF4J `@Slf4j` for structured logging. Avoid `System.out.println`.
