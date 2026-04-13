<div align="center">

# 🎓 eduDev

**Nền tảng Giáo dục Trực tuyến E-Learning Full-Stack**

Hệ thống quản lý giáo dục (LMS) hoàn chỉnh hỗ trợ đa vai trò — **Học sinh**, **Giáo viên**, **Quản trị viên** —  
với tích hợp **thanh toán VNPay**, **kiểm duyệt nội dung** và **định hướng nghề nghiệp**.

<br />

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.3-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![Kafka](https://img.shields.io/badge/Apache_Kafka-7.6-231F20?style=flat-square&logo=apachekafka&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![VNPay](https://img.shields.io/badge/VNPay-Sandbox-005BAA?style=flat-square)

</div>

---

## 📌 Giới thiệu

**eduDev** là đồ án Full-Stack E-Learning Platform được thiết kế với kiến trúc **Modular Monolith** (Backend) và **Feature-Based Clean Architecture** (Frontend). Dự án mô phỏng hệ thống giáo dục thực tế cho học sinh THPT với tính năng:

- Quản lý bài giảng, đề thi, ngân hàng câu hỏi trắc nghiệm
- Đóng gói & bán khóa học theo Combo, tích hợp thanh toán trực tuyến VNPay
- Quy trình kiểm duyệt nội dung (Content Moderation) nhiều bước
- Hệ thống định hướng nghề nghiệp & gợi ý ngành học theo điểm số
- Quản lý người dùng đa vai trò (RBAC) với JWT Authentication

### Quy mô dự án

| Chỉ số | Giá trị |
|:---|:---|
| Tổng Backend Java files | **225 files** |
| Tổng Frontend TS/TSX files | **63 files** |
| REST API Controllers | **37 controllers** |
| JPA Entities | **41 entities** |
| Database Migrations (Flyway) | **12 versions** (617 dòng SQL) |
| Backend Domain Modules | **13 modules** |
| Unit Tests | **21 test cases** |

---

## 🏗 Kiến trúc Hệ thống

```
eduDev/
├── eduDev/                    # 🖥 Backend — Java Spring Boot
│   ├── src/main/java/
│   │   └── com.datdev.edudev/
│   │       ├── analytics/     # Dashboard thống kê (Admin & Teacher)
│   │       ├── auth/          # Đăng nhập, JWT, User profiles
│   │       ├── combo/         # Khóa học Combo, Enrollment, Progress
│   │       ├── common/        # Security, Exception, Kafka, Redis, Utils
│   │       ├── lesson/        # Bài giảng, tài nguyên, bookmark
│   │       ├── major/         # Ngành học, wishlist, gợi ý nghề nghiệp
│   │       ├── notification/  # Thông báo real-time (Kafka-driven)
│   │       ├── order/         # Đơn hàng (Order → OrderItem)
│   │       ├── payment/       # Thanh toán VNPay (Gateway, IPN, Audit)
│   │       ├── quiz/          # Đề thi, câu hỏi, bài làm (Attempt)
│   │       ├── recommendation/# Module gợi ý
│   │       ├── review/        # Kiểm duyệt nội dung (Admin workflow)
│   │       ├── subject/       # Môn học, chủ đề (Subject → Topic)
│   │       ├── system/        # File upload, health check
│   │       └── teacher/       # Workflow giáo viên, feedback, phân công
│   └── src/main/resources/
│       └── db/migration/      # Flyway V1 → V12
│
└── edudev-frontend/           # 🌐 Frontend — Next.js App Router
    └── src/
        ├── app/
        │   ├── (public)/      # Login, Register, 403
        │   ├── (student)/     # Dashboard, Combos, Quizzes, Checkout...
        │   ├── (teacher)/     # CMS: Lessons, Quizzes, Combos builder
        │   └── (admin)/       # Users, Moderation, Majors, Settings
        ├── components/        # Shared UI (charts, tables, layout)
        ├── features/          # Feature-specific components
        ├── lib/api/           # Axios API clients (typed)
        ├── lib/query/hooks/   # React Query hooks
        ├── store/             # Zustand auth store
        └── types/             # TypeScript type definitions
```

---

## ✨ Tính năng Chi tiết

### 🔐 Hệ thống Xác thực & Phân quyền
- **JWT Authentication** với Spring Security (Stateless, BCrypt password hashing)
- **RBAC 3 vai trò**: `ADMIN`, `TEACHER`, `STUDENT` — mỗi vai trò có dashboard và API riêng biệt
- **Custom Security Handlers**: `AuthenticationEntryPoint`, `AccessDeniedHandler` trả về JSON chuẩn
- **Auto token injection**: Axios interceptors tự động gắn JWT vào mọi request

### 👨‍🎓 Portal Học sinh (Student)
- Xem bài giảng (Lessons) theo cấu trúc **Môn học → Chủ đề → Bài giảng**
- Làm bài trắc nghiệm (Quizzes): chấm điểm tự động, xem giải thích chi tiết
- Đăng ký Combo khóa học: hỗ trợ cả combo miễn phí (enroll trực tiếp) và trả phí (qua VNPay)
- Theo dõi tiến độ học tập (Combo Progress, Lesson Progress)
- Gợi ý ngành nghề dựa trên sở thích & điểm số ([Career Recommendation])
- Quản lý wishlist ngành học, xem thông báo

### 👩‍🏫 Portal Giáo viên (Teacher)
- **Content Management System**: Soạn bài giảng, quản lý tài nguyên đa phương tiện
- **Quiz Builder**: Tạo đề thi, câu hỏi trắc nghiệm nhiều lựa chọn
- **Combo Builder**: Đóng gói Subjects/Topics thành combo bán hàng, đặt giá
- Theo dõi học sinh được phân công (TeacherStudentAssignment)
- Gửi phản hồi cá nhân hóa (TeacherFeedback) tới từng học sinh

### 🛡 Portal Quản trị (Admin)
- **Content Moderation Workflow**: Phê duyệt (Approve) / Từ chối (Reject) bài giảng, quiz, combo trước khi công khai
- Quản lý người dùng: tạo, khóa/mở khóa, phân quyền tài khoản
- Quản lý danh mục gốc: Môn học (Subjects), Chủ đề (Topics), Ngành học (Majors)
- Dashboard Analytics: thống kê tổng quan hệ thống, biểu đồ (Recharts)

### 🛒 Luồng Thanh toán VNPay
Quy trình thanh toán e-commerce hoàn chỉnh:

```
Student chọn Combo → Tạo Order → Sinh Payment URL (HMAC-SHA512)
  → Redirect VNPay Sandbox → Thanh toán
  → VNPay gọi IPN Callback (Server-to-Server, source of truth)
  → Backend xác minh chữ ký + kiểm tra số tiền + idempotent check
  → Kích hoạt Enrollment tự động → Ghi Audit Log bất biến
  → Frontend polling trạng thái → Hiển thị kết quả
```

**Đặc điểm kỹ thuật:**
- Mã hóa `HMAC-SHA512` cho mọi tham số giao dịch
- IPN (Instant Payment Notification) là nguồn xử lý duy nhất — Return URL chỉ phục vụ redirect UI
- Xử lý idempotent: IPN trùng lặp → trả `RspCode: 02` mà không tạo enrollment thừa
- Audit Log bất biến cho mọi callback (IPN/Return) kèm trạng thái chữ ký
- Kiểm tra chéo: so khớp `vnp_Amount` với `order.totalAmount` trước khi xác nhận

---

## 🛠 Tech Stack Chi tiết

### Backend Stack

| Công nghệ | Phiên bản | Mục đích |
|:---|:---:|:---|
| **Java** | 21 | Ngôn ngữ chính với Virtual Threads support |
| **Spring Boot** | 3.5.3 | Framework backend core |
| **Spring Security** | 6.x | JWT Authentication, RBAC, Method-level Authorization |
| **Spring Data JPA** | — | ORM, Repository pattern |
| **PostgreSQL** | 16 | Cơ sở dữ liệu quan hệ chính |
| **Flyway** | — | Database migration versioning (V1→V12) |
| **Redis** | 7.4 | Caching layer (`@Cacheable` cho Combos) |
| **Apache Kafka** | 7.6.1 | Event-driven messaging (Notifications, Enrollment events) |
| **MapStruct** | 1.6.3 | Compile-time DTO ↔ Entity mapping |
| **Lombok** | — | Giảm boilerplate code |
| **JJWT** | 0.12.6 | JWT token generation & validation |
| **SpringDoc OpenAPI** | 2.8.5 | Swagger UI auto-generated API docs |
| **Bean Validation** | — | Request DTO validation (`@NotBlank`, `@Valid`) |

### Frontend Stack

| Công nghệ | Phiên bản | Mục đích |
|:---|:---:|:---|
| **Next.js** | 16.x | React framework với App Router, Server Components |
| **React** | 19.x | UI library |
| **TypeScript** | 5 | Type safety toàn dự án |
| **Tailwind CSS** | 4 | Utility-first styling |
| **Ant Design** | 5.x | Data Tables, Form components |
| **shadcn/ui** | — | Accessible UI primitives (Dialog, Button, etc.) |
| **TanStack React Query** | 5 | Server-state management, caching, polling |
| **Zustand** | 5 | Client-state management (Auth store) |
| **Axios** | 1.x | HTTP client với JWT interceptors |
| **React Hook Form** | 7 | Form management + Zod validation |
| **Framer Motion** | 11 | Page transitions & animations |
| **Recharts** | 2 | Dashboard analytics charts |
| **Lucide React** | — | Icon system |

### Infrastructure

| Công nghệ | Mục đích |
|:---|:---|
| **Docker Compose** | Orchestrate PostgreSQL, Redis, Kafka, Zookeeper, Kafka UI |
| **Kafka UI** | Web-based Kafka topic monitoring (port 8081) |

---

## 📡 API Endpoints Overview

Dự án cung cấp **37 REST API controllers** được nhóm theo domain:

| Nhóm | Prefix | Mô tả |
|:---|:---|:---|
| **Auth** | `/v1/auth` | Login, Register, JWT tokens |
| **Users** | `/v1/users` | User CRUD, Profile management |
| **Subjects** | `/v1/subjects`, `/v1/topics` | Quản lý môn học & chủ đề |
| **Lessons** | `/v1/lessons`, `/v1/teacher/lessons` | Bài giảng: xem, tạo, sửa |
| **Quizzes** | `/v1/quizzes`, `/v1/teacher/quizzes` | Đề thi trắc nghiệm |
| **Combos** | `/v1/combos`, `/v1/teacher/combos` | Khóa học combo |
| **Orders** | `/v1/student/orders` | Tạo đơn hàng, xem lịch sử |
| **Payments** | `/v1/student/payments` | Thanh toán VNPay |
| **VNPay Callbacks** | `/v1/public/payments/vnpay` | IPN + Return URL (public) |
| **Purchases** | `/v1/student/purchases` | Lịch sử mua hàng |
| **Majors** | `/v1/majors`, `/v1/recommendations` | Ngành học, gợi ý nghề nghiệp |
| **Reviews** | `/v1/reviews`, `/v1/admin/content-reviews` | Kiểm duyệt nội dung |
| **Notifications** | `/v1/notifications` | Thông báo người dùng |
| **Analytics** | `/v1/analytics` | Dashboard thống kê |
| **Admin** | `/v1/admin/*` | Quản trị hệ thống |
| **System** | `/v1/system`, `/v1/files` | Health check, File upload |

> 📖 **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`

---

## 🗄 Database Schema

**12 Flyway migrations** quản lý schema với **20+ tables**:

| Migration | Nội dung |
|:---|:---|
| `V1` | Auth tables: `users`, `roles`, `user_roles` |
| `V2` | Subject & Lesson: `subjects`, `topics`, `lessons`, `lesson_resources`, `lesson_progress`, `bookmarks` |
| `V3` | Quiz: `quizzes`, `questions`, `choices`, `quiz_attempts`, `quiz_answers` |
| `V4` | Combo: `combos`, `combo_items`, `enrollments`, `combo_progress` |
| `V5` | Teacher workflow: `teacher_subject_assignments`, `teacher_student_assignments`, `teacher_feedback` |
| `V6` | Review: `content_reviews` |
| `V7` | Major: `majors`, `admission_combinations`, `career_recommendations`, `student_wishlist` |
| `V9` | Notifications: `notifications` |
| `V10–V11` | Mock/Test data (demo accounts, sample content) |
| `V12` | **Payment**: `orders`, `order_items`, `payment_transactions`, `payment_audit_logs` + enrollment extensions |

---

## 🚀 Hướng dẫn Cài đặt

### Yêu cầu
- **Java 21+** & Maven 3.8+
- **Node.js 20+** & npm
- **Docker** & Docker Compose

### 1. Clone & Cấu hình

```bash
git clone <repository-url>
cd eduDev

# Copy file cấu hình môi trường
cp .env.example .env
# Chỉnh sửa .env nếu cần (đặc biệt VNPAY_TMN_CODE, VNPAY_HASH_SECRET cho thanh toán)
```

### 2. Khởi chạy Infrastructure

```bash
docker-compose up -d
# Khởi động: PostgreSQL (5432), Redis (6379), Kafka (9092), Kafka UI (8081)
```

### 3. Khởi chạy Backend

```bash
cd eduDev
./mvnw spring-boot:run
# Flyway tự động chạy migrations V1→V12 (tạo schema + insert dữ liệu demo)
```

> Backend: `http://localhost:8080` | Swagger: `http://localhost:8080/api/swagger-ui.html`

### 4. Khởi chạy Frontend

```bash
cd edudev-frontend
npm install
npm run dev
```

> Frontend: `http://localhost:3000`

---

## 🔑 Tài khoản Demo

| Vai trò | Email | Mật khẩu | Trang sau đăng nhập |
|:---:|:---|:---|:---|
| 👑 **Admin** | `admin@edudev.com` | `123456` | `/admin/dashboard` |
| 🧑‍🏫 **Teacher** | `teacher@edudev.com` | `123456` | `/teacher/dashboard` |
| 👨‍🎓 **Student** | `student@edudev.com` | `123456` | `/student/dashboard` |

> Mật khẩu được mã hóa BCrypt. Đăng nhập tại `/login` hoặc qua API `POST /v1/auth/login`.

---

## 🏛 Nguyên tắc Thiết kế & Best Practices

| Nguyên tắc | Áp dụng |
|:---|:---|
| **Domain-Driven Design** | 13 business modules, mỗi module tự quản entity/repo/service/controller |
| **DTO Pattern** | MapStruct compile-time mapping, không expose entity ra API response |
| **Global Exception Handling** | Centralized `BusinessException` + `ErrorCode` enum → JSON error chuẩn hóa |
| **Idempotent Payment** | VNPay IPN xử lý duplicate-safe, audit log bất biến |
| **HMAC-SHA512 Signing** | Tất cả crypto logic cô lập trong `VnPayGateway`, không lộ secret ra frontend |
| **Event-Driven** | Kafka cho notification, enrollment events |
| **Caching** | Redis `@Cacheable` cho combo listings |
| **Versioned Schema** | Flyway migration V1→V12, reproducible database state |
| **Type Safety** | TypeScript strict mode toàn frontend, Zod schema validation |
| **Server-State** | React Query caching + smart polling cho payment status |

---

## 📄 License

Dự án này được phát triển cho mục đích học tập và portfolio cá nhân.

<div align="center">
<br />
<sub>Built with ❤️ by <b>datdev</b></sub>
</div>
