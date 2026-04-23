# Test Suite: TS_Patient_002
## Method: getPatientById()

| Code Module | Patient | Method | getPatientById |
| :--- | :--- | :--- | :--- |
| **Created By** | SeniorQA | **Executed By** | SeniorQA |
| **Test requirement** | Kiểm tra logic truy xuất thông tin bệnh nhi theo UUID. | | |

| Passed | Failed | Untested | N/A/B | Total Test Cases |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 0 | 3 | 0 | 3 |

### Decision Table

| Condition | Precondition | UTCID08 | UTCID09 | UTCID10 |
| :--- | :--- | :---: | :---: | :---: |
| **Input Data** | | | | |
| *ID* | Existing UUID | O | | |
| | Non-existing UUID | | O | |
| | Null | | | O |
| **Confirm** | **Return** | | | |
| | 200 OK + Data | O | | |
| | 404 EntityNotFound | | O | |
| | 400 IllegalArg | | | O |
| **Result** | | **PENDING** | **PENDING** | **PENDING** |
