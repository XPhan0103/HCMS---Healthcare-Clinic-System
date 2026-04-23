# Test Suite: TS_Patient_003
## Method: updatePatientProfile()

| Code Module | Patient | Method | updatePatientProfile |
| :--- | :--- | :--- | :--- |
| **Created By** | SeniorQA | **Executed By** | SeniorQA |
| **Test requirement** | Kiểm tra logic cập nhật thông tin lâm sàng/cá nhân của bệnh nhi (UC-14). | | |

| Passed | Failed | Untested | N/A/B | Total Test Cases |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 0 | 3 | 0 | 3 |

### Decision Table

| Condition | Precondition | UTCID11 | UTCID12 | UTCID13 |
| :--- | :--- | :---: | :---: | :---: |
| **Input Data** | | | | |
| *Patient Status* | Existing in DB | O | O | |
| | Not in DB | | | O |
| *Update Fields* | height, weight, allergies | O | | O |
| | allergies: "" (clear) | | O | |
| **Confirm** | **Return** | | | |
| | 200 OK + Updated Data | O | O | |
| | 404 EntityNotFound | | | O |
| **Result** | | **PENDING** | **PENDING** | **PENDING** |
