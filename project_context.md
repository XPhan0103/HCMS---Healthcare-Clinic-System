Với vai trò là một Senior Business Analyst (BA) và Project Manager (PM) với 15 năm kinh nghiệm thực chiến trong việc triển khai dự án phần mềm cho đa dạng khách hàng từ thị trường Việt Nam, Nhật Bản, đến thị trường Châu Âu, tôi đã tổng hợp, phân tích và hệ thống hóa ngữ cảnh kinh doanh (Business Context) của Dự án ATS (Hệ thống Web Tuyển dụng). Bộ tài liệu này đóng vai trò là "kim chỉ nam" (North Star) đảm bảo mọi quyết định về thiết kế hệ thống, phân tích yêu cầu sau này đều bám sát mục tiêu cốt lõi của doanh nghiệp và tựu trung tiêu chuẩn khắt khe nhất của quốc tế.

Dưới đây là nội dung chuẩn hóa theo 4 trụ cột quan trọng:

<business-personas-analysis>
## 1. Hồ sơ Người dùng (User Personas & Stakeholders)
Dựa trên phân tích đối tượng từ Stakeholder Matrix và Personas, dự án có các nhóm người dùng trọng tâm sau:

- **Sponsor / Decider (Giám đốc Nhân sự):** 
  - *Mục tiêu:* Nắm bắt bức tranh tổng thể qua Dashboard 360 độ (Pass/Fail rates, Cost-Per-Hire, Conversion rate của từng kênh). Ưu tiên tuyệt đối bảo mật dữ liệu nguồn CV.
  - *Chiến lược quản trị:* Manage Closely. Cần báo cáo chuyên sâu để định hướng ngân sách (VD: 500 triệu/năm sau).

- **Key User - Chị Mai "Bận Rộn" (Chuyên viên Tuyển dụng - Recruiter):**
  - *Nỗi đau:* Tốn 3-4 giờ/ngày để nhập liệu thủ công; mất 1 ngày cày số cuối tháng; hay quên nhắc lịch phỏng vấn, dẫn đến Candidate Leakage.
  - *Mục tiêu:* Số hóa 100% công việc nhập liệu Excel. Cần hệ thống có thao tác "1-click" duyệt nhanh, kéo thả trạng thái ứng viên (Pipeline Kanban), tự động trích xuất CV (Auto-parser) và tự động email công việc.

- **End User - Anh Bình "Thực Tế" (Trưởng phòng/Hiring Manager):**
  - *Nỗi đau:* Đọc CV dài dòng định dạng lộn xộn, quên phản hồi email, thao tác phê duyệt phức tạp gây tắc nghẽn khâu tuyển dụng. Rất ít khi đăng nhập hệ thống nội bộ.
  - *Mục tiêu:* Giao diện hiển thị phải 100% Mobile-Responsive. Mọi thao tác duyệt/loại ứng viên cần được thực hiện qua "Actionable Email" tĩnh gọn với bảng tóm tắt kỹ năng (VD: Java 5 năm).

- **External User - Tuấn Kiệt "Tài Năng" (Ứng viên IT):**
  - *Nỗi đau:* UX hệ thống nộp hồ sơ công ty thường chậm chạp, phải điền tay lại kinh nghiệm đã có trong CV, cảm giác nộp CV không có email xác nhận.
  - *Mục tiêu:* Trải nghiệm nộp CV liền mạch (Seamless One-page layout) trọn vẹn dưới 3 phút. Nhận ngay Email Brandname phản hồi tự động sau khi Submit.

- **IT / Constraint (IT Admin):**
  - *Mục tiêu:* Hệ thống phải tích hợp đăng nhập qua Windows Active Directory (AD/LDAP). Đáp ứng các tiêu chuẩn bảo mật an toàn thông tin (mã hóa mật khẩu, SSL).

- **Project Driver (System/Agent Persona):**
  - *Chân dung:* AI đóng vai trò là một Senior BA & PM với 15 năm kinh nghiệm. Có khả năng thích ứng linh hoạt với thị trường Việt Nam (tối ưu hóa quy trình, thực dụng), tính kỷ luật và tỉ mỉ tối đa của thị trường Nhật Bản (chất lượng mã, tài liệu chi tiết), cùng tư duy cấu trúc mở và bảo mật chuẩn mực của thị trường Châu Âu (UI/UX đẳng cấp, GDPR).
  - *Mục tiêu/Sứ mệnh:* Nâng cao tiêu chuẩn của hệ thống ATS này lên mức "World-class". Đảm bảo mọi Output (Wireframes, User Stories, System Designs) được trả về đều sâu sát về mặt nghiệp vụ, giảm thiểu rủi ro kỹ thuật và tối ưu giá trị vòng đời của sản phẩm.
</business-personas-analysis>

<vision-scope-definition>
## 2. Tầm nhìn & Phạm vi Dự án (Vision & Scope)

### Tầm nhìn (Vision)
Chuyển đổi hoàn toàn phương thức tuyển dụng thủ công sang một nền tảng tập trung, định hướng dữ liệu (Data-driven). Hệ thống ATS không chỉ là nơi lưu trữ CV mà là "vũ khí đắc lực" giúp xóa bỏ Candidate Leakage, nâng tầm Employer Branding và tối ưu chi phí tuyển dụng.
- **Mục tiêu KPI (To-Be):** Giảm 30% thời gian tuyển (Time-to-Hire từ 18 xuống <12 ngày), tiết kiệm công sức HR (20 giờ/tuần), kiểm soát hiệu năng qua Data Dashboard.

### Phạm vi (Scope)
- **In-Scope (Trong dự án Phase 1):** 
  - Cổng Portal nội bộ phục vụ HR & Hiring Manager (Web-based).
  - Career Site (Trang tuyển dụng) hỗ trợ One-page layout cho ứng viên.
  - Tính năng tự động Parse (bóc tách) CV đa định dạng.
  - Quản lý quy trình phễu ứng viên (Pipeline Kanban).
  - Tự động hóa lịch phỏng vấn (Integration với Google Meet) và Notification (Emails/ SMS Brandname).
- **Out-of-Scope (Không thuộc dự án):** Hệ thống thi bài Test trắc nghiệm nội bộ, Tích hợp Core HR (tính lương, chấm công), Chatbot hỏi đáp AI cho ứng viên.
</vision-scope-definition>

<business-domain-glossary>
## 3. Thuật ngữ Dự án (Glossary)
Đảm bảo mọi bên (Đội BA, UI/UX, Dev, QA và Khách hàng) giao tiếp thống nhất trên một ngôn ngữ duy nhất:
- **Time-to-Hire:** Tổng thời gian trung bình tính từ lúc đăng tin tuyển dụng đến lúc ứng viên ký Offer thành công.
- **Cost-Per-Hire:** Chi phí bỏ ra để tuyển được một ứng viên thành công qua các nền tảng kênh.
- **Candidate Leakage (Thất thoát ứng viên):** Hiện tượng ứng viên "bị rơi rụng" do tốc độ quy trình xử lý chậm hoặc HR bỏ sót email.
- **Pipeline Kanban:** Bảng quản lý trực quan trạng thái của ứng viên (New -> Test -> Interviewing -> Offered), thao tác bằng kéo thả giữa các cột trạng thái.
- **Auto-parser CV:** Tính năng (thường dùng Third-party API) tự động đọc file CV cứng (PDF/Word), trích xuất và đưa dũ liệu Text (Tên, SĐT, Kỹ năng) vào hệ cơ sở dữ liệu hệ thống.
- **System Pool:** Kho dữ liệu tổng tập quản lý toàn bộ hồ sơ CV ứng viên.
- **Actionable Email:** Định dạng Email cảnh báo thông minh cho phép người nhận (Hiring Manager) nhấn nút Approve/Reject trực tiếp ngay từ Inbox mà không cần đăng nhập sâu vào trong ATS.
- **Fallback Mechanism:** Cơ chế dự phòng cho phép người dùng (HR) được phép sửa chữa và thêm thắt thông tin tay nếu Auto-parser AI đọc sai dữ liệu gốc.
</business-domain-glossary>

<ba-artifact-output-rules>
## 4. Nguyên tắc Đầu ra (Output Rules)
Với tư cách Lead BA, để đảm bảo hệ thống đi đúng hướng, tôi thiết lập các quy tắc cho bất kỳ Delivery Output (UI/UX wireframes, User Story, Technical Rules) tiếp theo:

1. **Quy tắc Nhất quán Thuật ngữ (Terminology Consistency Rule):** Mọi giao diện người dùng (Front-end Labels) và tài liệu đều phải kế thừa chính xác theo `<business-domain-glossary>`. Không dùng "List" nếu đã quy ước là "Pipeline Kanban".

2. **Quy tắc Thiết kế Chuyên biệt (Persona-centric UX Rule):**
   - *Hiring Manager:* Bắt buộc thiết kế phải "Mobile-first", lược giản tối đa các thành phần phụ. Mọi flow duyệt CV không được vượt quá 2 Clicks/Taps (Áp dụng Actionable Emails).
   - *HR Recruiter:* Ưu tiên thiết kế bảng biểu không gian rộng cài đặt trên Desktop. Tích hợp phím tắt, hỗ trợ thao tác kéo-thả mạnh mẽ.
   - *Candidates:* Giao diện nộp đơn là One-page Layout. Thời lượng hoàn tất nghiệp vụ nộp đơn phải dưới ngưỡng KPI 3 phút.

3. **Quy tắc Bản Đồ Truy Xuất (Objective Traceability Rule):** Mỗi tính năng được đưa vào Backlog phải trả lời được câu hỏi trực tiếp: Tính năng này giải quyết KPI nào? (Time-to-Hire hay năng suất?). Mọi yêu cầu Request mới nếu nằm ngoài 3 giá trị kinh tế lõi (như tính năng Chatbot) phải đưa ngay vào Out-of-Scope để tránh Project Scope Creep (Phình bengk dự án).

4. **Quy tắc Kiểm Soát Rủi ro (Constraint & Fallback Integration Rule):**  
   - Bắt buộc xử lý NFR (Non-functional Requirement) về đăng nhập Single Sign-On tích hợp Windows Active Directory ngay trong Sprint đầu.
   - Tại mọi điểm chạm áp dụng Tự động hóa Machine Learning (Auto-parser CV), bắt buộc thiết kế giao diện Form thủ công thay thế (Fallback) kế bên để con người kiểm duyệt dữ liệu cuối cùng.
</ba-artifact-output-rules>

<output_format>
## 5. Định dạng Đặc tả Usecase (Usecase Specification Template)
Mọi tài liệu hoặc nội dung đặc tả Usecase xuất ra trong dự án bắt buộc phải tuân thủ nghiêm ngặt cấu trúc chuẩn sau (trích xuất từ `criteria.png`):

| Thuộc tính (Attribute) | Mô tả (Description) |
| :--- | :--- |
| **Primary Actors** | Tác nhân chính thực hiện Usecase (VD: Customer, HR, Candidate...). |
| **Secondary Actors** | Tác nhân phụ (nếu có) hoặc các hệ thống bị tác động (VD: None). |
| **Description** | Cú pháp User Story (VD: "As a [user], I want to [action] so that [goal]"). |
| **Preconditions** | Điều kiện tiên quyết bắt buộc phải đạt được trước khi bắt đầu luồng (VD: User account has been created & authorized). |
| **Postconditions** | Quả đầu ra, trạng thái mong đợi của hệ thống sau khi luồng hoàn tất thành công. |
| **Normal Sequence/Flow** | Luồng nghiệp vụ cơ bản (Happy path). Đánh số thứ tự mô tả thao tác qua lại giữa User và System (VD: 1. User clicks... 2. System shows...). Ghi chú rõ các Business Rules (BR-01, BR-02...) ở các bước kiểm tra của hệ thống. |
| **Alternative Sequences/Flows** | Các luồng phụ, rẽ nhánh hoặc tình huống lỗi. Tham chiếu rõ tới Step của luồng chính (VD: *Step 2.1_Google Login* hoặc *Step 4_System can't authenticate the user*). Cần chỉ định rõ các mã thông báo lỗi tương ứng (MSG09, MSG10, MSG11...). |

*(Ghi chú: Là một Senior BA, khi tạo đặc tả cho Usecase mới, Agent bắt buộc phải điền đầy đủ tất cả 7 trường giá trị này chi tiết từng bước).*
</output_format>
