# HCMS — Sequence Diagram (Mermaid)

**UC-01: Book Appointment Online** | **UC-02: Provide Patient Demographics**  
API Contract Reference: `HCMS_API_contract.yaml v1.0`  
Architecture: ADR-001 Modular Monolith — React SPA → Spring Boot API Gateway → Module Services → MySQL 8.0

---

## UC-01 + UC-02: Self-Service Booking Flow

```mermaid
sequenceDiagram
    autonumber

    participant P  as :Parent
    participant UI as bookingPortal<br/>React SPA
    participant GW as apiGateway<br/>Spring Boot
    participant AS as appointmentService<br/>AppointmentService
    participant PS as patientService<br/>PatientService
    participant DB as db<br/>MySQL 8.0

    Note over P,DB: ══ UC-01: Book Appointment Online ══

    P->>UI: accessBookingPortal()

    UI->>GW: GET /api/v1/doctors
    GW->>AS: getAvailableDoctors()
    AS->>DB: SELECT * FROM doctors WHERE active = true
    DB-->>AS: doctorsList[ ]
    AS-->>GW: doctorsList[ ]
    GW-->>UI: { code: 200, message: "Success", data: doctorsList[ ] }
    UI-->>P: displayDoctors() — list doctors & available slots for next 7 days

    P->>UI: selectDoctor(doctorId) + selectTimeSlot(slotDateTime)

    UI->>GW: GET /api/v1/doctors/{doctorId}/available-slots?fromDate={date}
    GW->>AS: checkSlotAvailability(doctorId, date)
    AS->>DB: SELECT slotDateTime, status FROM appointments<br/>WHERE doctorId = ? AND date = ?
    DB-->>AS: availableSlots[ ]
    AS-->>GW: availableSlots[ ]
    GW-->>UI: { code: 200, message: "Success", data: availableSlots[ ] }

    alt [slotAvailable = true — Slot is free]
        UI-->>P: displayAvailableSlots() — show confirmed time slots
        P->>UI: clickContinue() — slot held in UI state, proceed to demographics
    else [slotAvailable = false — Slot just taken (MSG01)]
        GW-->>UI: { code: 409, message: "MSG01 — Time slot no longer available", data: null }
        UI-->>P: displayError(MSG01) — refresh available slots, return to slot selection
    end

    Note over P,DB: ══ UC-02: Provide Patient Demographics ══

    UI-->>P: displayPatientDemographicForm()

    P->>UI: fillDemographics(fullName, dateOfBirth, gender,<br/>parentPhoneNumber, parentEmail, reasonForVisit)

    alt [valid = true — BR-01: required fields, BR-02: phone/email format]
        UI->>UI: validateForm() → true
        P->>UI: submitBooking() — click 'Submit Booking' button

        UI->>GW: POST /api/v1/appointments<br/>{ doctorId, slotDateTime,<br/>  patient: { fullName, dateOfBirth, gender,<br/>             parentPhoneNumber, parentEmail, reasonForVisit } }

        GW->>PS: createOrUpdatePatient(patientDto)
        PS->>DB: SELECT * FROM patients WHERE parentPhoneNumber = ?
        DB-->>PS: patientRecord (existing or null)
        PS->>DB: INSERT or UPDATE patients<br/>SET fullName, dateOfBirth, gender, parentPhoneNumber, parentEmail
        DB-->>PS: patientId (UUID)
        PS-->>GW: patientId (UUID)

        alt [count = 0 — Slot still free, create APPOINTMENT]
            GW->>AS: createAppointment(doctorId, slotDateTime, patientId, reasonForVisit)
            AS->>DB: SELECT COUNT(*) FROM appointments<br/>WHERE slotDateTime = ? AND doctorId = ?<br/>AND status != 'CANCELLED'
            DB-->>AS: count = 0 (slot confirmed free)
            AS->>DB: INSERT INTO appointments<br/>(patientId, doctorId, slotDateTime, status = 'PENDING', reasonForVisit)
            DB-->>AS: appointmentId (UUID)
            AS-->>GW: appointmentId (UUID)
            GW-->>UI: { code: 201, message: "Booking submitted successfully",<br/>             data: { appointmentId, status: "PENDING", slotDateTime, doctorName } }
            UI-->>P: displayBookingSuccessScreen(appointmentRef, status: "PENDING", doctorName, slotDateTime)

        else [count > 0 — Slot taken by concurrent booking (Race Condition / MSG01)]
            AS-->>GW: throws SlotConflictException
            GW-->>UI: { code: 409, message: "MSG01 — Slot no longer available", data: null }
            UI-->>P: displayError(MSG01) — prompt to re-select slot (return to UC-01 Step 4)
        end

    else [valid = false — Missing required field (MSG02) or invalid format (MSG03)]
        UI->>UI: validateForm() → false
        UI-->>P: highlightErrors(MSG02/MSG03) — block submission, return to form
    end
```

---

## API Endpoints Referenced (HCMS_API_contract.yaml)

| Step | Method | Endpoint | Description |
|------|--------|----------|-------------|
| 2 | `GET` | `/api/v1/doctors` | List available doctors (UC-01) |
| 5 | `GET` | `/api/v1/doctors/{doctorId}/available-slots` | Get doctor's open time slots (UC-01) |
| 5 (UC-02) | `POST` | `/api/v1/appointments` | Book appointment — create PATIENT + APPOINTMENT (UC-01, UC-02) |

---

## Alternative Flows Summary

| Fragment | Condition | Outcome |
|----------|-----------|---------|
| `alt` #1 — Slot Check | `slotAvailable = false` | API returns `409` (MSG01); UI prompts re-select slot |
| `alt` #2 — Client Validation | `valid = false` | UI shows MSG02/MSG03; blocks form submission |
| `alt` #3 — Server Race Condition | `count > 0` at INSERT | AppointmentService throws `SlotConflictException`; API returns `409` |

---

## Entities Created/Updated

| Entity | Operation | Condition |
|--------|-----------|-----------|
| `PATIENT` | `INSERT` or `UPDATE` | Always on booking submission |
| `APPOINTMENT` | `INSERT` with `status = PENDING` | Only if slot free (count = 0) |
