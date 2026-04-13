# eduDev Project Docs

## 1. Tổng quan dự án

**eduDev** là một nền tảng giáo dục trực tuyến dành cho học sinh THPT, tập trung vào 3 nhóm người dùng chính:

- **Student**: học nội dung, làm quiz, theo dõi tiến độ, nhận gợi ý ngành học.
- **Teacher**: xây dựng bài giảng, quiz, combo học tập, theo dõi học sinh và gửi feedback.
- **Admin**: kiểm duyệt nội dung, quản lý người dùng, quản lý dữ liệu ngành học, theo dõi thống kê hệ thống.

Mục tiêu của hệ thống là kết nối **học tập + đánh giá + định hướng nghề nghiệp** trong cùng một sản phẩm.

---

## 2. Bài toán dự án giải quyết

Học sinh thường phải dùng nhiều hệ thống rời rạc:

- một nơi để học lý thuyết,
- một nơi để luyện đề,
- một nơi để theo dõi tiến độ,
- và gần như không có công cụ định hướng ngành học đủ cá nhân hóa.

eduDev gom các nhu cầu này vào một nền tảng thống nhất:

- học theo môn, chủ đề, bài giảng,
- làm quiz và lưu lịch sử kết quả,
- giáo viên có thể hướng dẫn trực tiếp,
- admin có thể kiểm soát chất lượng nội dung,
- hệ thống có thể gợi ý ngành học phù hợp dựa trên dữ liệu học tập.

---

## 3. Chức năng chính theo vai trò

### 3.1. Student

- Đăng ký, đăng nhập, quản lý hồ sơ cá nhân.
- Xem danh sách môn học, chủ đề, bài giảng.
- Học bài giảng theo từng topic.
- Đánh dấu bookmark bài học.
- Đánh dấu hoàn thành bài học để theo dõi tiến độ.
- Làm quiz theo bài học.
- Xem lịch sử các lần làm bài.
- Nhận gợi ý ngành học phù hợp.
- Lưu ngành học yêu thích vào wishlist.
- Xem combo học tập đã đăng ký.
- Nhận thông báo trong hệ thống.

### 3.2. Teacher

- Tạo và cập nhật **Lesson**.
- Tạo và cập nhật **Quiz**.
- Thêm câu hỏi vào quiz.
- Tạo **Combo** học tập từ nhiều nội dung.
- Gửi nội dung lên quy trình kiểm duyệt.
- Xem danh sách học sinh được phân công.
- Xem dashboard học sinh.
- Gửi feedback cho học sinh.
- Theo dõi nội dung đã tạo và trạng thái duyệt.

### 3.3. Admin

- Xem dashboard tổng quan hệ thống.
- Quản lý ngành học và dữ liệu định hướng.
- Quản lý subject/topic.
- Duyệt hoặc từ chối nội dung do giáo viên gửi lên.
- Quản lý workflow gán giáo viên với môn học hoặc học sinh.
- Xem analytics về nội dung, người dùng, recommendation.

---

## 4. Các module nghiệp vụ trong backend

Backend được tổ chức theo kiểu **package-by-feature / modular monolith**, mỗi domain tách riêng tương đối rõ:

- `auth`: đăng ký, đăng nhập, JWT, refresh token, hồ sơ người dùng.
- `subject`: quản lý môn học và chủ đề.
- `lesson`: bài giảng, bookmark, tiến độ học.
- `quiz`: đề quiz, câu hỏi, đáp án, attempt, chấm điểm.
- `combo`: nhóm nội dung hoặc lộ trình học tập, enrollment.
- `teacher`: workflow phân công giáo viên, học sinh, feedback.
- `review`: kiểm duyệt nội dung trước khi public.
- `major`: ngành học, wishlist, recommendation.
- `notification`: thông báo và xử lý sự kiện bất đồng bộ.
- `analytics`: dashboard và số liệu tổng quan.
- `system`: health check, upload/download file, endpoint kiểm tra hệ thống.

Điểm mạnh kiến trúc:

- Dễ mở rộng tính năng theo domain.
- Dễ bảo trì hơn kiểu chia package theo controller/service/repository thuần túy.
- Phù hợp với team backend muốn scale dần nhưng chưa cần tách microservices.

---

## 5. Luồng nghiệp vụ nổi bật

### 5.1. Luồng học tập

1. Student đăng nhập.
2. Student chọn môn học.
3. Đi vào topic và lesson cụ thể.
4. Học nội dung, bookmark hoặc complete lesson.
5. Làm quiz liên quan.
6. Hệ thống lưu kết quả attempt.
7. Dữ liệu này có thể được dùng để phân tích recommendation.

### 5.2. Luồng tạo nội dung

1. Teacher tạo lesson / quiz / combo.
2. Teacher submit nội dung để review.
3. Admin xem hàng chờ moderation.
4. Admin approve hoặc reject.
5. Nội dung được xuất bản cho student nếu được duyệt.

### 5.3. Luồng định hướng ngành học

1. Student học bài và làm quiz.
2. Hệ thống thu thập dữ liệu kết quả học tập.
3. Recommendation module tính toán mức độ phù hợp.
4. Student xem danh sách ngành được gợi ý.
5. Student có thể lưu wishlist để theo dõi.

### 5.4. Luồng thông báo

1. Một sự kiện nghiệp vụ xảy ra, ví dụ nội dung được duyệt hoặc có feedback mới.
2. Hệ thống đẩy event qua Kafka.
3. Notification module consume event.
4. Tạo thông báo cho user liên quan.

---

## 6. Tech stack

### 6.1. Backend

- **Java 21**
- **Spring Boot 3.5.x**
- **Spring Web**
- **Spring Security**
- **Spring Data JPA**
- **PostgreSQL**
- **Redis**
- **Kafka**
- **Flyway**
- **MapStruct**
- **JWT (jjwt)**
- **Swagger / OpenAPI**

### 6.2. Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand**
- **TanStack React Query**
- **Axios**
- **Ant Design**
- **Recharts**
- **React Hook Form**
- **Zod**
- **Framer Motion**
- **Lucide React**

### 6.3. Infrastructure local

- **Docker Compose**
- **Postgres 16**
- **Redis 7**
- **Kafka + Zookeeper**
- **Kafka UI**

---

## 7. Kiến trúc kỹ thuật

### 7.1. Frontend

Frontend dùng **Next.js App Router** và chia route theo từng nhóm vai trò:

- `(public)`
- `(student)`
- `(teacher)`
- `(admin)`

Các phần quan trọng:

- `src/lib/api`: định nghĩa lớp gọi API.
- `src/lib/query/hooks`: custom hooks dùng React Query để fetch/mutate dữ liệu.
- `src/store/authStore.ts`: lưu trạng thái đăng nhập bằng Zustand.
- `src/components/layout`: sidebar theo từng role.

Frontend gọi backend qua `Axios client` với:

- gắn `Bearer token` ở request interceptor,
- chuẩn hóa response,
- tự logout khi gặp `401 Unauthorized`.

### 7.2. Backend

Backend là REST API đặt dưới prefix:

- `/api/v1/...`

Một số nhóm endpoint chính:

- `/v1/auth`
- `/v1/users`
- `/v1/students/me/profile`
- `/v1/teachers/me/profile`
- `/v1/subjects`
- `/v1/topics`
- `/v1/lessons`
- `/v1/quizzes`
- `/v1/combos`
- `/v1/reviews`
- `/v1/notifications`
- `/v1/recommendations`
- `/v1/admin/...`

Security dùng:

- Stateless JWT authentication
- Custom JWT filter
- Custom authentication entry point
- Custom access denied handler
- Method security

---

## 8. Những điểm kỹ thuật đáng nói khi đi phỏng vấn

Bạn có thể nhấn mạnh các điểm sau:

### 8.1. Kiến trúc

- Dự án không làm kiểu CRUD đơn giản mà có phân chia domain rõ ràng.
- Chọn **modular monolith** để cân bằng giữa tốc độ phát triển và khả năng scale.
- Có workflow nội dung thực tế: draft, submit review, approve/reject.

### 8.2. Bảo mật

- Xác thực bằng JWT.
- Có refresh token flow.
- Redis được dùng cho token storage/rotation.
- API được phân quyền theo vai trò Student / Teacher / Admin.

### 8.3. Dữ liệu và vận hành

- Dùng PostgreSQL làm database chính.
- Dùng Flyway để version hóa schema và seed dữ liệu mẫu.
- Có Docker Compose để dựng full local stack nhanh.

### 8.4. Event-driven

- Dùng Kafka để tách luồng notification / event processing khỏi nghiệp vụ chính.
- Đây là điểm cộng khi trình bày vì cho thấy bạn không chỉ làm CRUD đồng bộ.

### 8.5. Frontend architecture

- Frontend tách rõ API layer, query hooks, auth store, layout theo role.
- Dùng React Query để quản lý cache và đồng bộ server state.
- Dùng Zustand cho client auth state, nhẹ hơn Redux trong ngữ cảnh này.

### 8.6. Product thinking

- Dự án không chỉ có “học online” mà có thêm lớp **career recommendation**.
- Hệ thống thể hiện tư duy sản phẩm giáo dục end-to-end: học, đánh giá, theo dõi, định hướng.

---

## 9. Các màn hình có thể demo với recruiter

### Student

- Dashboard học tập
- Danh sách môn học
- Chi tiết môn học
- Chi tiết bài học
- Trang làm quiz
- Trang recommendations
- Trang majors
- Trang notifications
- Trang profile
- Trang combos

### Teacher

- Dashboard giáo viên
- Quản lý nội dung
- Tạo bài giảng
- Tạo quiz
- Tạo combo
- Xem học sinh được phân công
- Gửi feedback

### Admin

- Dashboard admin
- Moderation queue
- Quản lý majors
- Quản lý users
- Settings

---

## 10. Điểm mạnh nổi bật của dự án

- Có đầy đủ **backend + frontend + database + message broker + cache**.
- Có **đa vai trò** với nghiệp vụ khác nhau, không phải app một luồng đơn giản.
- Có **content moderation workflow** giống sản phẩm thật.
- Có **career recommendation module**, tăng tính khác biệt.
- Có **analytics, notifications, profile, learning progress**, giúp dự án trông “production-oriented”.

---

## 11. Một số câu giới thiệu ngắn với nhà tuyển dụng

### Phiên bản ngắn 30 giây

> Em xây dựng một nền tảng e-learning full-stack tên là eduDev, gồm backend Spring Boot và frontend Next.js. Hệ thống có 3 vai trò Student, Teacher, Admin; hỗ trợ quản lý bài giảng, quiz, combo học tập, kiểm duyệt nội dung, theo dõi tiến độ và gợi ý ngành học. Về kỹ thuật, em dùng PostgreSQL, Redis, Kafka, Flyway, JWT và React Query để triển khai theo hướng gần với production.

### Phiên bản 1 phút

> eduDev là dự án em làm theo hướng product thực tế chứ không chỉ CRUD. Em thiết kế backend theo modular monolith với các domain như auth, lesson, quiz, review, major recommendation, notification và analytics. Phía frontend dùng Next.js App Router, Zustand cho auth state, React Query cho server state. Điểm em thấy nổi bật là có workflow duyệt nội dung giữa teacher và admin, có event-driven notification bằng Kafka, và có module định hướng ngành học cho học sinh dựa trên dữ liệu học tập.

---

## 12. Cách chạy dự án

### Backend

```bash
cd eduDev
docker-compose up -d
./mvnw spring-boot:run
```

Swagger:

- `http://localhost:8080/api/swagger-ui.html`

### Frontend

```bash
cd edudev-frontend
npm install
npm run dev
```

Frontend:

- `http://localhost:3000`

---

## 13. Tài khoản demo

- **Admin**: `admin@edudev.com` / `123456`
- **Teacher**: `teacher@edudev.com` / `123456`
- **Student**: `student@edudev.com` / `123456`

---

## 14. Nếu recruiter hỏi “em học được gì từ dự án này?”

Bạn có thể trả lời:

- Cách thiết kế backend theo domain thay vì viết dồn logic vào một chỗ.
- Cách triển khai auth thực tế với JWT và refresh token.
- Cách tổ chức frontend khi có nhiều role và nhiều màn hình.
- Cách quản lý migration database bằng Flyway.
- Cách dùng Kafka và Redis trong một hệ thống full-stack.
- Cách nghĩ về workflow sản phẩm chứ không chỉ code từng API rời rạc.

---

## 15. Kết luận

eduDev là một dự án mạnh để đưa vào CV vì thể hiện được:

- năng lực làm **full-stack**,
- hiểu biết về **kiến trúc hệ thống**,
- khả năng xây dựng **nghiệp vụ nhiều vai trò**,
- và tư duy phát triển sản phẩm gần với môi trường doanh nghiệp thực tế.

Nếu cần trình bày với recruiter, nên tập trung vào 4 ý:

1. Đây là nền tảng e-learning full-stack nhiều vai trò.
2. Có workflow nội dung và moderation như sản phẩm thật.
3. Có stack kỹ thuật khá đầy đủ: Spring Boot, Next.js, PostgreSQL, Redis, Kafka.
4. Có điểm khác biệt là recommendation ngành học và analytics.
