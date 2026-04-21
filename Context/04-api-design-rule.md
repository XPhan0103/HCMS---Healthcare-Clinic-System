# Layer 4: API Design Rules (HCMS)

This document defines the strict standards for REST API communication, data formatting, and error handling for the Healthcare Clinic Management System.

## 1. Routing & Versioning

- **Global Prefix:** All endpoints MUST be prefixed with `/api/v1/`.
- **Naming:** strictly use `kebab-case` for resource segments.
  - Good: `/api/v1/appointment-slots`
  - Bad: `/api/v1/appointmentSlots`, `/api/v1/appointment_slots`
- **Method Usage:**
  - `GET`: Retrieve data. No side effects.
  - `POST`: Create new resources.
  - `PUT`: Update existing resources (full replace).
  - `PATCH`: Partial update.
  - `DELETE`: Logical or physical removal.

## 2. Standardized Response Envelope

Every single API response MUST follow this JSON structure:

| Field | Type | Description |
|-------|------|-------------|
| `code` | Integer | HTTP Status or Custom Business Code |
| `message` | String | Description of the result (in Tiếng Việt for UI display or English for Debugging) |
| `data` | Object | The payload (can be `null` or `[]`) |

### Example Success (200 OK)
```json
{
  "code": 200,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "id": 123,
    "fullName": "Nguyễn Văn A"
  }
}
```

## 3. Pagination & Filtering

For list endpoints (e.g., `/api/v1/patients`), use the following Query Parameters:

- **Pagination:** `page` (start at 0) and `size` (default 20).
- **Sorting:** `sort=fieldName,asc` or `sort=fieldName,desc`.
- **Filtering:** Use field-specific parameters (e.g., `?fullName=Nguyễn`).

### Response for Paginated Data
```json
{
  "code": 200,
  "message": "Thành công",
  "data": {
    "content": [...],
    "totalPages": 5,
    "totalElements": 100,
    "size": 20,
    "number": 0 
  }
}
```

## 4. Error Codes & Handling

When a request fails, the `code` field should reflect the error category, and the `data` field should provide validation details if applicable.

| HTTP Code | Business Code | Description |
|-----------|---------------|-------------|
| 400 | `BAD_REQUEST` | Validation failed (e.g., missing phone). |
| 401 | `UNAUTHORIZED` | Invalid or expired JWT token. |
| 403 | `FORBIDDEN` | User does not have the required Role. |
| 404 | `NOT_FOUND` | Resource (Patient/Visit) does not exist. |
| 409 | `CONFLICT` | Slot already taken (Race condition - MSG01). |

### Validation Error Example (400)
```json
{
  "code": 400,
  "message": "Dữ liệu nhập vào không hợp lệ",
  "data": {
    "fullName": "Tên không được để trống",
    "phoneNumber": "Định dạng số điện thoại sai"
  }
}
```

## 5. Security & Headers

- **Authentication:** `Authorization: Bearer <JWT_TOKEN>`
- **Content-Type:** Always `application/json; charset=utf-8`.
- **CORS:** Allowed only for the authorized Frontend domain (defined in `application.yml`).
- **Privacy:** Never expose internal IDs (if not sequence-based), passwords, or stack traces in the response `message`.
