# Test Suite: TS_Patient_004
## Method: searchPatientsByPhone()

| Code Module | Patient | Method | searchPatientsByPhone |
| :--- | :--- | :--- | :--- |
| **Created By** | SeniorQA | **Executed By** | SeniorQA |
| **Test requirement** | Kiểm tra logic tìm kiếm bệnh nhi theo số điện thoại phụ huynh (UC-07 Alt Flow). | | |

| Passed | Failed | Untested | N/A/B | Total Test Cases |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 0 | 3 | 0 | 3 |

### Decision Table

| Condition | Precondition | UTCID14 | UTCID15 | UTCID16 |
| :--- | :--- | :---: | :---: | :---: |
| **Input Data** | | | | |
| *phoneNumber* | Valid + Match Found | O | | |
| | Valid + No Match | | O | |
| | Empty String | | | O |
| **Confirm** | **Return** | | | |
| | 200 OK + List[N] | O | | |
| | 200 OK + Empty List | | O | O |
| **Result** | | **PENDING** | **PENDING** | **PENDING** |
