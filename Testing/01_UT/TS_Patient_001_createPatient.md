# Test Suite: TS_Patient_001
## Method: createPatient()

| Code Module | Patient | Method | createPatient |
| :--- | :--- | :--- | :--- |
| **Created By** | SeniorQA | **Executed By** | SeniorQA |
| **Test requirement** | Kiểm tra logic tạo mới bệnh nhi (UC-02) và các ràng buộc dữ liệu (BR-01). | | |

| Passed | Failed | Untested | N/A/B | Total Test Cases |
| :--- | :--- | :--- | :--- | :--- |
| 0 | 0 | 5 | 0 | 5 |

### Decision Table

| Condition | Precondition | UTCID01 | UTCID02 | UTCID03 | UTCID04 | UTCID05 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Input Data** | | | | | | |
| *fullName* | Valid (Nguyen Van A) | O | | | | |
| | Min Length (An) | | O | | | |
| | Empty ("") | | | O | | |
| *dob* | Valid Past Date | O | O | O | | O |
| | Future Date (2099) | | | | O | |
| *parentPhone* | Valid (10 digits) | O | O | O | O | |
| | Invalid (9 digits) | | | | | O |
| **Confirm** | **Return** | | | | | |
| | 201 Created + Response | O | O | | | |
| | 400 Validation Error | | | O | O | O |
| **Result** | | **PENDING** | **PENDING** | **PENDING** | **PENDING** | **PENDING** |
