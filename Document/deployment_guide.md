# Hướng dẫn Deploy Backend HCMS lên Render

Tài liệu này hướng dẫn chi tiết các bước để deploy và quản lý backend Spring Boot trên Render.

## 1. Chuẩn bị trên Render Dashboard

1. **Tạo Web Service mới:**
   - Truy cập [Render Dashboard](https://dashboard.render.com/).
   - Chọn **New +** -> **Web Service**.
   - Kết nối với Repository GitHub của bạn.
   - **Service Name:** `hcms-backend`.
   - **Environment:** `Docker`.
   - **Docker Context:** `./Developments/BE`.
   - **Dockerfile Path:** `Dockerfile`.

2. **Cấu hình Environment Variables (Quan trọng):**
   Trong mục **Environment** của Service trên Render, hãy thêm các biến sau:
   - `DB_URL`: `jdbc:mysql://mysql-1a4b8591-nguyendangkhoa5104-e33c.c.aivencloud.com:23979/defaultdb?useSSL=true&serverTimezone=UTC`
   - `DB_USERNAME`: `avnadmin`
   - `DB_PASSWORD`: (Nhập password Aiven của bạn tại đây)
   - `JWT_SECRET`: (Nhập Secret Key của bạn)
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SPRING_FLYWAY_ENABLED`: `true`

3. **Lấy Deploy Hook:**
   - Tại trang cấu hình Web Service, kéo xuống phần **Deploy Hook**.
   - Copy URL này (dạng `https://api.render.com/deploy/srv-...`).

## 2. Cấu hình trên GitHub

1. Truy cập Repository của bạn trên GitHub.
2. Vào **Settings** -> **Secrets and variables** -> **Actions**.
3. Chọn **New repository secret**.
4. Thêm secret:
   - **Name:** `RENDER_DEPLOY_HOOK`
   - **Value:** (Dán URL Deploy Hook bạn vừa copy ở Render).

## 3. Cách hoạt động của CI/CD

- Mỗi khi bạn `git push` code vào nhánh `main`, GitHub Actions sẽ tự động chạy:
  1. Kiểm tra code (Checkout).
  2. Build project với Maven để đảm bảo không có lỗi compile.
  3. Gọi Deploy Hook của Render để yêu cầu Render cập nhật bản build mới nhất từ Dockerfile.

## 4. Kiểm tra sau khi Deploy

- Theo dõi Log trên Render Dashboard để xem quá trình khởi động của Spring Boot.
- Kiểm tra Flyway migration có chạy thành công không.
- Truy cập endpoint sức khỏe: `https://your-service-name.onrender.com/api/v1/actuator/health` (Kết quả mong đợi: `{"status":"UP"}`).

---
*Lưu ý: Nếu bạn gặp lỗi kết nối Database, hãy kiểm tra lại cấu hình IP Allowlist trên Aiven.io (Đảm bảo Render IP có thể truy cập hoặc cho phép 0.0.0.0/0 nếu cần).*
