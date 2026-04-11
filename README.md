# 🎓 eduDev - Nền tảng Giáo dục Trực tuyến Toàn diện

**eduDev** là một hệ thống giáo dục trực tuyến (E-learning Platform) Full-stack hiện đại, được thiết kế để kết nối **Học sinh**, **Giáo viên**, và **Quản trị viên** (Admin) trong một môi trường học tập và quản lý đồng bộ.

![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black?style=for-the-badge&logo=next.js)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?style=for-the-badge&logo=spring-boot)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🏗 Cấu trúc Dự án

Dự án được chia thành 2 thư mục chính:

- 📂 \`eduDev/\` - **Backend**: Được xây dựng trên nền tảng **Java Spring Boot**, cung cấp các RESTful APIs an toàn, tích hợp PostgreSQL, Redis, Kafka và Flyway Migration.
- 📂 \`edudev-frontend/\` - **Frontend**: Được phát triển bằng **Next.js (App Router)**, kết hợp React Query, Tailwind CSS, và Ant Design mang lại trải nghiệm UI/UX mượt mà.

---

## ✨ Tính năng Nổi bật (Theo Vai trò)

### 👨‍🎓 Tương tác Học sinh (Student)
- **Học tập đa phương tiện**: Xem bài giảng, lý thuyết, học theo lộ trình môn học.
- **Luyện tập & Đánh giá**: Làm bài tập trắc nghiệm (Quizzes), chấm điểm và xem giải thích chi tiết.
- **Định hướng Nghề nghiệp**: Hệ thống gợi ý ngành học/trường đại học dựa trên sở thích và điểm số.
- **Combo Khoá học**: Đăng ký các gói khóa học (Combos) được thiết kế chuyên biệt.

### 👩‍🏫 Phân hệ Giáo viên (Teacher)
- **Quản lý Nội dung (Content Management)**: Soạn thảo, biên tập lý thuyết (Lessons), bài tập (Quizzes) và đóng gói thành Combos.
- **Theo dõi Tiến độ**: Giám sát kết quả học tập của học sinh, tiến độ chấm điểm.
- **Gửi Phản hồi**: Đánh giá và gửi nhận xét cá nhân hóa tới từng học viên.

### 🛡 Quản trị Hệ thống (Admin)
- **Kiểm duyệt Nội dung (Moderation)**: Phê duyệt (Approve/Reject) các bài giảng và khóa học từ giáo viên trước khi công khai.
- **Quản lý Người dùng**: Điều hành tài khoản, phân quyền, khóa/mở khóa tài khoản.
- **Thiết lập Danh mục**: Quản lý danh sách các ngành thi, môn học cốt lõi.
- **Báo cáo Thống kê**: Xem tổng quan hệ thống qua biểu đồ và số liệu (Analytics).

---

## 🛠 Công nghệ Sử dụng

### Dàn Backend (Spring Boot Ecosystem)
- **Core**: Java 21, Spring Boot 3.x, Spring Security (JWT Authentication)
- **Database**: PostgreSQL (Data lưu trữ), Flyway (DB Migration), Redis (Caching)
- **Messaging**: Apache Kafka (Xử lý thông báo/Sự kiện bất đồng bộ)
- **API Docs**: SpringDoc OpenAPI (Swagger UI)

### Dàn Frontend (React Ecosystem)
- **Core**: Next.js (App Router), React, TypeScript
- **State & Data Fetching**: Zustand (Auth State), @tanstack/react-query, Axios
- **UI/Styling**: Tailwind CSS, Shadcn/ui, Ant Design (Data Tables), Lucide React (Icons), Recharts (Biểu đồ)

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Local Development)

### 1. Yêu cầu hệ thống (Prerequisites)
- Java 21+ & Maven
- Node.js 20+ & npm
- Docker & Docker Compose (cho CSDL và hệ sinh thái backend)

### 2. Khởi chạy Backend (\`eduDev\`)

\`\`\`bash
cd eduDev

# Mở Docker Compose để chạy PostgreSQL, Redis, Kafka
docker-compose up -d

# Chạy ứng dụng Spring Boot (Port 8080)
# Lưu ý: Flyway sẽ tự động tạo bảng và nạp dữ liệu mẫu (Mock data)
./mvnw spring-boot:run
\`\`\`
> Endpoint Swagger UI: `http://localhost:8080/api/v3/api-docs`

### 3. Khởi chạy Frontend (\`edudev-frontend\`)

\`\`\`bash
cd edudev-frontend

# Cài đặt các gói phụ thuộc
npm install

# Khởi chạy server phát triển (Port 3000)
npm run dev
\`\`\`
> Giao diện sẽ chạy tại: `http://localhost:3000`

---

## 🔑 Tài khoản Mặc định (Mock Credentials)

Khi Flyway chạy Script Migration (V10, V11), hệ thống đã nạp sẵn các tài khoản dưới đây (Mật khẩu được mã hóa bằng BCrypt):

| Vai trò | Email Đăng nhập | Mật khẩu | Chuyển hướng sau đăng nhập |
| --------- | ---------------- | ----------- | ----------------------------- |
| **Admin** | `admin@edudev.com` | `123456` | `/admin/dashboard` |
| **Teacher**| `teacher@edudev.com` | `123456` | `/teacher/dashboard` |
| **Student**| `student@edudev.com` | `123456` | `/student/dashboard` |

*Lưu ý: Bạn có thể chọn đăng nhập qua UI `/login` hoặc dùng lệnh cURL / REST Client extension qua API `POST /v1/auth/login`.*

---

## 📜 Kiến trúc Dữ liệu & Quy trình Đóng góp
Dự án được áp dụng tiêu chuẩn code chặt chẽ:
- **Git Flow**: Chức năng mới mở từ nhánh `feature/*`.
- **Clean Architecture Frontend**: Tách biệt `features/`, `hooks/`, `lib/api/`, và cấu trúc routing tĩnh `app/(role)/...`.
- **Domain-Driven Backend**: Tổ chức theo modules `auth`, `lesson`, `quiz`, `review`...
