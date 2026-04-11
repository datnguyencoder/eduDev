# eduDev Master Implementation Guide

> Tài liệu này dùng cho 2 mục tiêu cùng lúc:
> 1. Làm **execution guide** để giao cho Codex/code agent triển khai.
> 2. Làm **study guide** để bạn học lại, review code, hiểu rõ mình đang làm gì và kể lại được khi phỏng vấn.

---

# 1. Mục tiêu của dự án

## 1.1 Bản chất dự án
eduDev là nền tảng học tập và hướng nghiệp cho học sinh THPT, có 3 vai trò chính:
- Student
- Teacher
- Admin

Dự án không chỉ là CRUD thông thường mà là một hệ thống có:
- nhiều module nghiệp vụ
- phân quyền theo vai trò
- luồng duyệt nội dung
- theo dõi tiến độ học tập
- sự kiện bất đồng bộ qua Kafka
- gợi ý nghề nghiệp bằng rule engine + AI explanation

## 1.2 Mục tiêu kỹ thuật
Khi hoàn thành, project phải thể hiện được các năng lực sau:
- Java 21
- Spring Boot backend chuẩn production mindset
- REST API thiết kế có cấu trúc
- JWT + refresh token rotation
- RBAC
- PostgreSQL + Flyway
- Redis
- Kafka
- Global exception handling
- Swagger/OpenAPI
- Docker Compose
- Frontend React + TypeScript
- Dễ deploy, dễ demo, dễ kể lại khi phỏng vấn

## 1.3 Nguyên tắc triển khai
- Không code lan man theo cảm hứng.
- Luôn làm từ **foundation -> core modules -> workflows -> integration -> polish**.
- Mỗi phase phải chạy được, test được, demo được.
- Mỗi phần code đều phải trả lời được 3 câu hỏi:
  - Nó giải quyết bài toán gì?
  - Vì sao thiết kế như vậy?
  - Nhà tuyển dụng có thể hỏi gì từ phần này?

---

# 2. Kiến trúc tổng thể cần giữ

## 2.1 Kiến trúc backend
Backend theo hướng **modular monolith**.

### Root package hiện tại
```text
com.datdev.edudev
```

### Package structure
```text
com.datdev.edudev
 ┣ common
 ┃ ┣ config
 ┃ ┣ exception
 ┃ ┣ response
 ┃ ┣ event
 ┃ ┣ security
 ┃ ┗ util
 ┣ auth
 ┃ ┣ controller
 ┃ ┣ service
 ┃ ┣ dto
 ┃ ┣ entity
 ┃ ┣ repository
 ┃ ┗ mapper
 ┣ user
 ┣ subject
 ┣ lesson
 ┣ quiz
 ┣ combo
 ┣ major
 ┣ teacher
 ┣ review
 ┣ recommendation
 ┣ notification
 ┗ admin
```

> Ghi chú: tài liệu này **giữ nguyên codebase eduDev**, không ép chuẩn hóa tên project, package root, database hay branding sang tên khác.

## 2.2 Kiến trúc frontend
Frontend theo feature-based structure:
- auth
- student
- teacher
- admin
- major
- shared UI/layout/hooks/api/store

## 2.3 Nguyên tắc backend
- Controller chỉ nhận request/response.
- Business logic nằm ở Service.
- Repository chỉ truy cập DB.
- DTO tách khỏi Entity.
- Không để business logic trong Controller.
- Không expose Entity trực tiếp ra ngoài API.

---

# 3. Công nghệ cần dùng

## 3.1 Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- Redis
- Spring Kafka
- Flyway
- Lombok
- MapStruct hoặc manual mapper có kiểm soát
- Bean Validation
- SpringDoc OpenAPI
- JUnit 5
- Mockito
- Testcontainers

## 3.2 Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Recharts

## 3.3 Infra
- Docker
- Docker Compose
- Kafka UI
- PostgreSQL
- Redis

---

# 4. Triết lý triển khai để giao cho Codex

Codex không nên code toàn bộ project trong một lần. Phải triển khai theo milestone.

## 4.1 Quy tắc bắt buộc
1. Mỗi phase phải build được.
2. Mỗi phase phải có endpoint hoặc chức năng test được.
3. Mỗi phase phải có commit scope rõ ràng.
4. Không viết frontend trước khi backend contract đủ rõ.
5. Không dùng Kafka ở mọi nơi; chỉ dùng cho cross-module durable events.
6. AI chỉ để giải thích recommendation, không ghi đè rule engine.
7. Ưu tiên code rõ ràng, dễ review hơn là “thông minh quá mức”.
8. Giữ nguyên naming hiện tại của codebase eduDev, chỉ note đề xuất rename nếu thực sự cần.

## 4.2 Output mong muốn từ Codex mỗi phase
Mỗi phase Codex phải trả về:
- Danh sách file đã tạo/sửa
- Mục đích của từng file
- API hoặc business flow mới được thêm
- Cách test
- Những trade-off kỹ thuật
- Checklist để bạn review lại

---

# 5. Master roadmap triển khai

# Phase 0 — Foundation project alignment

## Mục tiêu
Dựng nền để toàn bộ các phase sau phát triển ổn định, **trên codebase eduDev hiện tại**.

## Phải có
- Giữ nguyên tên project eduDev
- Giữ nguyên package root hiện tại
- application.yml + profile dev/test/prod
- docker-compose.yml
- PostgreSQL chạy được
- Redis chạy được
- Kafka + Zookeeper + Kafka UI chạy được
- Swagger chạy được
- Global response/error format
- SecurityConfig cơ bản
- Flyway migrate được

## Files cần có
### common/response
- ApiResponse.java
- PageResponse.java
- ErrorResponse.java

### common/exception
- ErrorCode.java
- BusinessException.java
- GlobalExceptionHandler.java

### common/config
- OpenApiConfig.java
- RedisConfig.java
- KafkaConfig.java
- Swagger/OpenAPI config nếu cần riêng

### common/security
- SecurityConfig.java
- JwtProperties.java
- JwtUtil.java
- CustomUserDetails.java
- JwtAuthenticationFilter.java
- CustomAuthenticationEntryPoint.java
- CustomAccessDeniedHandler.java

### resources
- application.yml
- application-dev.yml
- application-test.yml
- application-prod.yml
- db/migration/V1__init_auth_tables.sql

## Review checklist
- App boot được không?
- Swagger mở được không?
- Security có còn generated password mặc định không?
- Flyway có chạy migration không?
- Response có đồng nhất không?
- Error có format thống nhất không?

## Bạn phải hiểu
- Vì sao cần response wrapper
- Vì sao cần global exception handler
- Vì sao dùng Flyway thay vì tự tạo bảng bằng tay
- Vì sao cần security skeleton trước auth business

---

# Phase 1 — Auth + User foundation

## Mục tiêu
Tạo hệ thống đăng ký, đăng nhập, refresh token, logout và profile cơ bản.

## Domain cần có
### Enums
- Role: STUDENT, TEACHER, ADMIN
- UserStatus: ACTIVE, INACTIVE, BANNED

### Entities
- User
- StudentProfile
- TeacherProfile

### DTOs
- StudentRegisterRequest
- LoginRequest
- AuthResponse
- RefreshTokenRequest
- UserMeResponse
- UpdateStudentProfileRequest
- UpdateTeacherProfileRequest

### Repositories
- UserRepository
- StudentProfileRepository
- TeacherProfileRepository

### Services
- AuthService
- UserService
- RefreshTokenService

### Controllers
- AuthController
- UserController
- StudentProfileController
- TeacherProfileController

## API phải triển khai
- POST /api/v1/auth/register/student
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- POST /api/v1/auth/logout
- GET /api/v1/users/me
- GET /api/v1/students/me/profile
- PUT /api/v1/students/me/profile
- GET /api/v1/teachers/me/profile
- PUT /api/v1/teachers/me/profile

## Bảo mật phải có
- Access token TTL 15 phút
- Refresh token TTL 7 ngày
- Refresh token lưu Redis
- Refresh token rotation
- Logout invalidate refresh token
- Password encode bằng BCrypt

## Review checklist
- Register student tạo đúng user + student profile chưa?
- Login trả access token + refresh token chưa?
- Refresh có rotate token chưa?
- Logout có revoke token chưa?
- /users/me lấy đúng user theo JWT chưa?
- User bị BANNED có bị chặn không?

## Bạn phải hiểu
- Sự khác nhau giữa access token và refresh token
- Vì sao refresh token nên lưu Redis
- Vì sao logout cần revoke refresh token
- Vì sao RBAC phải check ở endpoint

## Interview angle
- Giải thích auth flow stateless
- Tại sao không dùng session truyền thống
- Tại sao refresh token rotation quan trọng

---

# Phase 2 — Subject / Topic / Lesson core learning

## Mục tiêu
Xây lõi học tập cơ bản.

## Domain
- Subject
- Topic
- Lesson
- LessonResource
- Bookmark
- LessonProgress
- Difficulty enum
- ResourceType enum
- ContentStatus enum

## API
### Subject
- GET /api/v1/subjects
- POST /api/v1/admin/subjects
- PUT /api/v1/admin/subjects/{id}

### Topic
- GET /api/v1/subjects/{id}/topics
- POST /api/v1/admin/topics
- PUT /api/v1/admin/topics/{id}

### Lesson
- GET /api/v1/topics/{id}/lessons
- GET /api/v1/lessons/{id}
- POST /api/v1/teacher/lessons
- PUT /api/v1/teacher/lessons/{id}
- POST /api/v1/teacher/lessons/{id}/submit-review
- POST /api/v1/lessons/{id}/complete
- POST /api/v1/lessons/{id}/bookmark
- DELETE /api/v1/lessons/{id}/bookmark

## Business rules
- Chỉ lesson PUBLISHED mới visible cho student
- Teacher chỉ sửa lesson của mình khi DRAFT/REJECTED
- Student có thể bookmark lesson
- Student có thể mark complete lesson

## Kafka event
- LessonCompletedEvent -> edudev.lesson.completed

## Review checklist
- Subject/Topic CRUD có phân quyền đúng không?
- Teacher có sở hữu lesson của mình không?
- Student có thấy draft lesson không?
- Bookmark có idempotent không?
- Complete lesson có tránh duplicate không?

## Bạn phải hiểu
- Quan hệ Subject -> Topic -> Lesson
- Vì sao lesson cần status workflow
- Vì sao complete lesson nên phát event thay vì gọi chéo module mạnh tay

---

# Phase 3 — Quiz system

## Mục tiêu
Tạo hệ thống quiz hoàn chỉnh có chấm điểm tự động.

## Domain
- Quiz
- Question
- Choice
- QuizAttempt
- QuizAnswer

## API
- POST /api/v1/teacher/quizzes
- POST /api/v1/teacher/quizzes/{id}/questions
- POST /api/v1/teacher/quizzes/{id}/submit-review
- GET /api/v1/quizzes/{id}
- POST /api/v1/quizzes/{id}/attempts
- GET /api/v1/users/me/quiz-attempts
- GET /api/v1/users/me/quiz-attempts/{attemptId}

## Business rules
- Quiz chỉ PUBLISHED mới hiển thị cho student
- 1 câu hỏi chỉ có 1 đáp án đúng
- Attempt phải lưu score, correctCount, totalQuestions, durationSeconds, answers
- Nếu reviewEnabled = true thì student xem lại đáp án

## Kafka event
- QuizSubmittedEvent -> edudev.quiz.submitted

## Review checklist
- Scoring có đúng không?
- Có validate số lượng đáp án gửi lên không?
- Attempt có lưu snapshot đủ để xem lại không?
- Teacher có thể sửa quiz đã published không?
- Student có submit được draft quiz không?

## Bạn phải hiểu
- Vì sao attempt cần snapshot dữ liệu
- Vì sao score nên tính backend
- Vì sao submit event giúp tách progress/recommendation module

## Interview angle
- Cách thiết kế quiz schema
- Cách chống client gửi đáp án giả
- Cách xử lý scoring minh bạch

---

# Phase 4 — Combo learning path

## Mục tiêu
Xây learning path theo mục tiêu học tập.

## Domain
- Combo
- ComboItem
- Enrollment
- ComboProgress
- ComboLevel
- ItemType

## API
- POST /api/v1/teacher/combos
- PUT /api/v1/teacher/combos/{id}
- POST /api/v1/teacher/combos/{id}/submit-review
- GET /api/v1/combos
- GET /api/v1/combos/{id}
- POST /api/v1/combos/{id}/enroll
- GET /api/v1/users/me/combos

## Business rules
- Combo gồm Lesson hoặc Quiz theo orderIndex
- Student đăng ký combo
- Progress tính theo phần trăm item hoàn thành

## Kafka event
- ComboEnrolledEvent -> edudev.combo.enrolled
- LessonCompletedEvent hoặc QuizSubmittedEvent cập nhật combo progress

## Review checklist
- ComboItem order có chuẩn không?
- Progress có update đúng khi complete lesson/quiz không?
- Student có enroll trùng không?

## Bạn phải hiểu
- Vì sao combo là abstraction của learning path
- Vì sao progress nên tính từ event hoặc state trung gian thay vì hard-code trong controller

---

# Phase 5 — Teacher workflow + content ownership

## Mục tiêu
Thể hiện rõ đây là multi-role platform có workflow thật.

## Domain
- TeacherSubjectAssignment
- TeacherStudentAssignment
- TeacherFeedback

## API
- POST /api/v1/admin/teacher-subject-assignments
- POST /api/v1/admin/teacher-student-assignments
- GET /api/v1/teacher/students/{studentId}/dashboard
- POST /api/v1/teacher/feedbacks

## Business rules
- Admin gán teacher cho subject/student
- Teacher chỉ xem student được phân công
- Teacher tạo content theo phạm vi được giao
- Teacher gửi feedback cho student

## Review checklist
- Teacher có bị truy cập dữ liệu ngoài phạm vi không?
- Feedback có lưu lịch sử không?
- Assignment có bị duplicate không?

## Bạn phải hiểu
- Đây là phần thể hiện rõ RBAC + ownership + workflow
- Đây là phần rất tốt để kể khi phỏng vấn vì không còn là CRUD đơn giản

---

# Phase 6 — Review workflow

## Mục tiêu
Xây quy trình duyệt nội dung thật.

## Domain
- ContentReview
- ContentStatus lifecycle

## Luồng trạng thái
```text
DRAFT -> PENDING_REVIEW -> PUBLISHED | REJECTED -> DRAFT (sửa lại)
PUBLISHED -> ARCHIVED
```

## API
- GET /api/v1/admin/content-reviews
- POST /api/v1/admin/content-reviews/{id}/approve
- POST /api/v1/admin/content-reviews/{id}/reject

## Business rules
- Teacher submit lesson/quiz/combo để review
- Admin approve hoặc reject có note
- Mọi content published phải đi qua review

## Kafka event
- ContentReviewedEvent -> edudev.content.reviewed

## Review checklist
- Trạng thái có chuyển hợp lệ không?
- Admin có duyệt sai loại content không?
- Teacher có submit lại từ state không hợp lệ không?

## Bạn phải hiểu
- Vì sao workflow này tăng giá trị business của project
- Vì sao cần audit fields: creatorId, reviewerId, timestamps

---

# Phase 7 — Major / Career guidance

## Mục tiêu
Thêm hướng nghiệp và dữ liệu ngành học.

## Domain
- Major
- AdmissionCombination
- MajorAdmCombination
- MajorSubjectPriority
- MajorRoadmap
- WishlistMajor

## API
- GET /api/v1/majors
- GET /api/v1/majors/{id}
- POST /api/v1/admin/majors
- PUT /api/v1/admin/majors/{id}
- POST /api/v1/users/me/wishlist-majors
- PUT /api/v1/users/me/wishlist-majors/reorder

## Business rules
- Admin quản lý ngành và tổ hợp
- Student có wishlist major theo ưu tiên
- Major gợi ý combo liên quan

## Review checklist
- Dữ liệu ngành có normalize hợp lý không?
- Wishlist có lưu order không?
- API reorder có clear và an toàn không?

## Bạn phải hiểu
- Vì sao wishlist thứ tự quan trọng
- Vì sao nên tách admission combinations và subject priorities

---

# Phase 8 — Recommendation engine

## Mục tiêu
Tạo recommendation 2 tầng đúng tinh thần sản phẩm.

## Tầng 1 — Rule engine
Tính `fitnessScore` cho từng major theo công thức:
- điểm môn
- trọng số môn
- lịch sử quiz
- tiến độ combo

## Tầng 2 — AI explanation
Dùng OpenAI để sinh:
- reasonSummary
- focusSubjects
- suggestedCombos
- wishlistAdvice

## Nguyên tắc bắt buộc
- AI không bao giờ ghi đè score
- Nếu OpenAI lỗi, vẫn trả được kết quả rule engine
- Không để recommendation endpoint trả 500 chỉ vì AI down

## Domain
- CareerRecommendation
- RecommendedMajorResult

## API
- GET /api/v1/recommendations/me
- POST /api/v1/recommendations/recalculate

## Kafka event
- RecommendationGeneratedEvent -> edudev.recommendation.generated

## Review checklist
- Rule engine có deterministic không?
- AI fallback có hoạt động không?
- Prompt có tránh hallucination quá mức không?
- Suggested combo có dựa trên dữ liệu nội bộ không?

## Bạn phải hiểu
- Đây là điểm ăn tiền nhất của project
- Giá trị thật nằm ở chỗ AI chỉ giải thích, không quyết định thay rule engine

## Interview angle
- Tại sao không để AI tự chấm điểm luôn?
- Làm sao giảm hallucination?
- Làm sao thiết kế fallback khi AI service lỗi?

---

# Phase 9 — Notification system

## Mục tiêu
Tập trung event-driven communication.

## Domain
- Notification
- NotificationType

## Nguồn event
- user.registered
- lesson.completed
- quiz.submitted
- combo.enrolled
- content.reviewed
- recommendation.generated

## Chức năng
- Lưu in-app notification
- Có thể mở rộng email qua SMTP sau

## Review checklist
- Consumer có idempotent không?
- Notification có trace được theo eventId không?
- Có DLT cho lỗi consumer không?

## Bạn phải hiểu
- Vì sao notification nên là consumer độc lập
- Vì sao event-driven giúp tách module sạch hơn

---

# Phase 10 — Admin analytics

## Mục tiêu
Tạo dashboard quản trị tổng quan.

## Metrics
- Tổng user theo role
- Active users 30 ngày
- Tổng content theo status
- Top combo theo enrollments
- Top major theo wishlist
- Xu hướng recommendation

## API
- GET /api/v1/admin/dashboard
- GET /api/v1/admin/analytics/content
- GET /api/v1/admin/analytics/recommendations

## Review checklist
- Query có tối ưu không?
- Có phân biệt aggregate query và transactional query không?
- Có cache hợp lý bằng Redis không?

## Bạn phải hiểu
- Analytics giai đoạn đầu có thể lấy từ DB aggregation, chưa cần data warehouse riêng

---

# Phase 11 — Frontend integration

## Mục tiêu
Tạo 3 portal cơ bản:
- Student portal
- Teacher portal
- Admin portal

## Phải có
### Auth
- Login page
- Register page cho student
- Protected routes
- Role guard

### Student
- Dashboard
- Lesson viewer
- Quiz runner
- Combo progress
- Recommendation page
- Wishlist major

### Teacher
- Lesson/Quiz/Combo editor
- Student monitor
- Feedback form

### Admin
- Review queue
- User manager
- Subject/Major management
- Analytics charts

## Frontend architecture
- `src/api` cho API layer
- `src/store` cho auth/ui store
- `src/hooks` cho query hooks
- `src/features/*` cho từng module

## Review checklist
- Frontend có bám đúng API contracts không?
- Có tách server state và UI state không?
- Có handle token refresh hợp lý không?

---

# Phase 12 — Testing, polish, deployment

## Testing bắt buộc
### Unit tests
- AuthService
- RecommendationService
- Quiz scoring service
- Review workflow service

### Integration tests
- Auth login/refresh/logout
- Submit quiz -> event publish
- Review approve/reject
- Recommendation fallback

### Testcontainers
- PostgreSQL
- Kafka
- Redis nếu cần

## Deployment
- Dockerfile backend
- Dockerfile frontend
- docker-compose full stack
- Deploy backend Railway/VPS
- Deploy frontend Vercel
- README hoàn chỉnh
- .env.example

## Review checklist
- App chạy local 1 lệnh được chưa?
- Swagger có usable không?
- Docker compose có đủ services không?
- README có hướng dẫn rõ không?

---

# 6. Database implementation priorities

## 6.1 Không tạo toàn bộ schema một lần
Phải chia migration theo phase.

## Gợi ý thứ tự migration
- V1__init_auth_tables.sql
- V2__init_subject_lesson_tables.sql
- V3__init_quiz_tables.sql
- V4__init_combo_tables.sql
- V5__init_teacher_workflow_tables.sql
- V6__init_review_tables.sql
- V7__init_major_tables.sql
- V8__init_recommendation_tables.sql
- V9__init_notification_tables.sql

## 6.2 Quy tắc migration
- Không sửa migration cũ nếu đã apply trên môi trường chia sẻ
- Tạo migration mới để update schema
- Đặt tên rõ ràng
- Có index cho cột query nhiều

---

# 7. API design rules bắt buộc

## 7.1 Quy tắc chung
- Base URL: `/api/v1`
- JSON request/response
- Authorization: `Bearer <token>`
- List API phải có pagination
- Response phải bọc bằng ApiResponse hoặc PageResponse
- Error phải thống nhất bằng ErrorResponse

## 7.2 Naming rules
- Danh từ số nhiều cho resource collection
- Dùng nested resource khi có quan hệ rõ ràng
- Tránh endpoint kiểu action name lộn xộn nếu không cần

## 7.3 Status code rules
- 200 OK: query/update thành công
- 201 Created: create thành công
- 204 No Content: delete hoặc action không cần body
- 400: validation/business input sai
- 401: unauthenticated
- 403: authenticated nhưng không đủ quyền
- 404: resource không tồn tại
- 409: conflict

---

# 8. Coding standards để Codex phải tuân thủ

## 8.1 Backend
- Dùng constructor injection
- Không field injection
- Dùng DTO cho request/response
- Không return Entity trực tiếp
- Không viết query phức tạp trong controller
- Không đặt logic nghiệp vụ trong mapper
- Tên method rõ nghĩa
- Exception message rõ

## 8.2 Validation
- Dùng Bean Validation ở request DTO
- Validate ownership ở service layer
- Validate state transition ở service layer

## 8.3 Security
- Không hard-code secret
- Không log token
- Không expose password hash
- Không permitAll bừa bãi

## 8.4 Kafka
- Event payload phải rõ ràng
- Có eventId và occurredAt
- Consumer phải tính tới idempotency
- Có DLT nếu cần

---

# 9. Checklist review code cho bạn

Khi Codex làm xong một phase, bạn review theo checklist này.

## 9.1 Về kiến trúc
- File có đúng package không?
- Responsibility có đúng không?
- Controller có quá dày không?
- Service có ôm quá nhiều việc không?
- Có tách DTO/entity rõ không?

## 9.2 Về nghiệp vụ
- Business rule có đúng theo SRS không?
- Phân quyền có đúng không?
- State transition có hợp lệ không?
- Ownership có được kiểm tra không?

## 9.3 Về API
- Endpoint có RESTful không?
- Request/response có nhất quán không?
- Error trả ra có đồng bộ không?
- Pagination/sort/filter có đủ chưa?

## 9.4 Về database
- Quan hệ bảng có hợp lý không?
- Có field audit không?
- Có unique/index cần thiết không?
- Enum lưu string hay ordinal? -> luôn ưu tiên string

## 9.5 Về security
- Endpoint nhạy cảm có bị hở không?
- JWT flow có đúng không?
- Refresh token có rotate không?
- Có xử lý banned/inactive user không?

## 9.6 Về testability
- Có dễ viết test không?
- Logic có bị cứng vào framework không?
- Service có thể mock dependency dễ không?

---

# 10. Framework học lại sau khi Codex code xong

Bạn không nên học bằng cách đọc từ đầu đến cuối toàn bộ code. Hãy học theo framework này.

## 10.1 Đọc theo thứ tự
1. API contract trước
2. Controller
3. DTO request/response
4. Service
5. Entity/Repository
6. Migration SQL
7. Config/security liên quan
8. Test cases

## 10.2 Với mỗi module, tự trả lời 7 câu hỏi
1. Module này giải quyết bài toán gì?
2. Actor nào dùng nó?
3. Dữ liệu chính của nó là gì?
4. Business rule nào là quan trọng nhất?
5. Endpoint nào là cốt lõi?
6. Nếu interviewer hỏi “tại sao thiết kế như vậy?” thì trả lời sao?
7. Lỗi hay bug phổ biến ở module này là gì?

## 10.3 Cách học lại hiệu quả
- Chọn 1 phase
- Đọc README phase
- Chạy endpoint bằng Swagger/Postman
- Đọc controller -> service -> entity -> SQL
- Tự ghi lại luồng request đi qua đâu
- Tự nói lại bằng lời của mình

---

# 11. Prompt mẫu để giao cho Codex

## Prompt tổng quát
```text
Bạn là senior backend engineer. Hãy triển khai project eduDev theo đúng roadmap trong file này.

Yêu cầu bắt buộc:
- Giữ nguyên codebase hiện tại là eduDev.
- Không tự ý chuẩn hóa tên project/package sang tên khác.
- Làm theo phase, không nhảy lung tung.
- Mỗi phase phải build được.
- Mỗi phase phải có danh sách file tạo/sửa.
- Mỗi phase phải giải thích ngắn gọn mục đích từng file.
- Mỗi phase phải có cách test.
- Phải tuân thủ package-by-feature.
- Không đặt business logic trong controller.
- Không expose entity trực tiếp.
- Dùng ApiResponse/ErrorResponse thống nhất.
- Dùng Flyway cho schema.
- Dùng Spring Security + JWT + refresh token rotation.
- Viết code rõ ràng, dễ review.
```

## Prompt cho từng phase
```text
Hãy triển khai Phase X của eduDev theo file master implementation guide.

Output cần có:
1. Các file mới/cập nhật
2. Full code cho từng file
3. Giải thích mục đích file
4. Cách chạy/test
5. Những điểm cần lưu ý khi review code
6. Những câu hỏi phỏng vấn có thể phát sinh từ phase này
```

---

# 12. Những lỗi lớn phải tránh

- Code hết project trong một lần không có milestone
- Dùng Kafka cho cả những chỗ không cần event
- Để AI quyết định score thay rule engine
- Không có response/error format thống nhất
- Không kiểm tra ownership
- Không kiểm tra state transition
- Entity lộ ra API
- Không version hóa schema bằng Flyway
- Security permitAll quá rộng
- Naming trong codebase bị đổi lung tung khi chưa có chủ đích

---

# 13. Định nghĩa “xong project” đúng nghĩa

Project được coi là hoàn thành tốt khi:
- Có backend chạy ổn định
- Có Swagger usable
- Có auth/JWT/RBAC thật
- Có core modules: lesson, quiz, combo, major
- Có workflow teacher/admin review
- Có Kafka events hoạt động
- Có AI recommendation explanation với fallback
- Có frontend cơ bản cho 3 vai trò
- Có Docker/deploy/README
- Có thể demo end-to-end
- Có thể kể lại sạch sẽ khi phỏng vấn

---

# 14. Lộ trình học và review sau khi code xong

## Tuần 1
- Auth + Security + JWT + Redis

## Tuần 2
- Subject / Lesson / Quiz / Combo

## Tuần 3
- Teacher workflow / Review workflow / Kafka

## Tuần 4
- Major / Recommendation / Admin analytics / Docker / Deploy / Interview story

---

# 15. Kết luận cuối

Mục tiêu không phải là “ra thật nhiều code”.
Mục tiêu là xây một project mà:
- chạy được
- có kiến trúc ổn
- đúng nghiệp vụ
- dễ review
- giúp bạn học được tư duy backend thật
- đủ mạnh để mang đi phỏng vấn

Hãy dùng file này như **bản đồ triển khai** và **bản đồ học lại** cho codebase eduDev hiện tại.
