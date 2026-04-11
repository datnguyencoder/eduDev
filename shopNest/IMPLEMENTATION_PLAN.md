# 🚀 ShopNest v2.0 - Implementation Plan

Dựa trên tài liệu SRS, đây là kế hoạch hành động từng bước (Actionable Roadmap) chia thành 3 giai đoạn chính. File này hoạt động như một **Checklist định hướng**, bạn có thể đánh dấu `[x]` khi hoàn thành từng task để theo dõi tiến độ.

---

## 🛠 Nguyên Tắc Cốt Lõi (Nhớ kỹ trong quá trình code)
- **Kiến trúc:** Bám sát `N-Layer` (Controller -> Service -> Repository). Không phân tán logic lung tung.
- **Thiết kế API:** Cấu trúc Response chuẩn hoá với class `ApiResponse<T>`.
- **Java Core:** Tự viết tính năng thay vì phụ thuộc thư viện ngoài (Tự viết State Machine, Custom LRU Cache, Custom ThreadPool).
- **Git Strategy:** Commit 1 tính năng / 1 lần với message chuẩn (`feat:`, `fix:`, `refactor:`...). Đẩy lên repo mỗi ngày để xanh GitHub!

---

## 📂 Cấu Trúc Thư Mục Dự Kiến (Project Structure)
Dự án được ứng dụng tư tưởng **Package by Feature** (Chia theo module nghiệp vụ) để dễ dàng scale và tách Microservices sau này, kết hợp với các components dùng chung ở tầng core và infra.

```text
shopNest/
├── shopnest-api/                        # ☕ Thư mục chính chứa code Backend Spring Boot
│   ├── src/main/java/com/shopnest
│   │   ├── config/                      # Cấu hình độc lập (Security, Redis, Swagger, Kafka...)
│   │   ├── core/                        # Code dùng chung (Commons)
│   │   │   ├── exception/               # GlobalExceptionHandler, CustomExceptions
│   │   │   ├── response/                # Struct API Response (ApiResponse, PagedResponse)
│   │   │   ├── base/                    # BaseEntity, BaseRepository
│   │   │   └── statemachine/            # Engine tự code cho Order State Machine
│   │   ├── modules/                     # ✨ Chứa các module nghiệp vụ (Tương tự Domain Driven Design)
│   │   │   ├── auth/                    # Controllers, Services, DTOs, JwtUtils... cho xác thực
│   │   │   ├── user/                    # Quản lý User, Address
│   │   │   ├── catalog/                 # Category, Product, Product Variant (JPA Entities & APIs)
│   │   │   ├── cart/                    # Giỏ hàng thao tác chính với Redis
│   │   │   ├── inventory/               # Quản lý khóa tồn kho (Pessimistic Lock)
│   │   │   ├── order/                   # Đặt hàng, xử lý luồng sự kiện (Events)
│   │   │   ├── payment/                 # Strategy VNPay, Stripe...
│   │   │   └── review/                  # Đánh giá sản phẩm, gọi AI Sentiment
│   │   ├── infra/                       # Adapter giao tiếp với bên ngoài
│   │   │   ├── storage/                 # MinIO client upload/download ảnh
│   │   │   ├── cache/                   # Custom LRU Cache component
│   │   │   ├── search/                  # Spring Data Elasticsearch repositories
│   │   │   └── external/                # Feign Client gọi Python AI service
│   │   └── ShopNestApplication.java     # Entry point
│   └── src/main/resources/
│       ├── db/migration/                # Flyway base scripts (V1__init.sql, V2__data.sql)
│       └── application(-dev/-prod).yml  # Cấu hình theo môi trường
│
├── shopnest-ai/                         # 🐍 Microservice xử lý AI bằng Python (Tuần 3)
│   ├── main.py                          # FastAPI Entry point
│   ├── api/                             # Endpoints FastAPI
│   ├── services/                        # Logic Sentiment, Recommendation DB, RAG Langchain
│   ├── models/                          # Pydantic Schemas
│   └── requirements.txt                 # Dependencies
│
├── docker/                              # 🐳 Chứa cấu hình hạ tầng Dev
│   ├── docker-compose.yml               # Postgres, Redis, ES, MinIO, Kafka...
│   ├── prometheus/                      # File config Prometheus
│   └── grafana/                         # File config Grafana dashboards
│
├── .github/workflows/                   # 🤖 Actions build CI/CD
│   └── ci-cd.yml
│
├── IMPLEMENTATION_PLAN.md               # File roadmap hiện tại
└── README.md                            # Github documentation
```

**Tại sao chọn cấu trúc này?**
- **Dễ bảo trì:** Mỗi Module (VD: `order`) tự bù đắp trọn vẹn các thành phần. Nhìn vào thư mục là hiểu hệ thống làm được các chức năng gì mà không phải lục lọi khắp nơi.
- **Dễ tách Microservice:** Khi một module phình to, ta chỉ cần "bốc" toàn bộ folder đó rời đi và dựng thành một service mới một cách dễ dàng.
- **Phân lập rõ ràng:** Tầng `infra/` cách ly hoàn toàn logic code nghiệp vụ khỏi các API thư viện ngoài (MinIO, Elasticsearch). Việc thay provider sẽ không làm "vỡ" source code ở tầng domain và application.

---

## 🟢 GIAI ĐOẠN 1: Setup Môi Trường, Auth & Catalog (Tuần 1)
*Mục tiêu: Dựng xong nền móng hạ tầng, người dùng có thể lướt xem hàng và thêm hàng vào giỏ.*

### Bước 1: Khởi tạo Project & Infrastructure
- [ ] Tạo Spring Boot 3 + Java 21 project (Web, JPA, Security, PostgreSQL, Validation, Lombok).
- [ ] Setup `docker-compose.yml` local cho: **PostgreSQL**, **Redis**, **Kafka**, **Elasticsearch**, **MinIO**.
- [ ] Thiết lập `application-dev.yml` và `application-prod.yml`.
- [ ] Cấu hình **Flyway** migration script (`V1__init_db.sql`) để khởi tạo base tables.
- [ ] Xây dựng bộ khung nền: `BaseEntity` (auto tracking thời gian tạo/sửa), `ApiResponse<T>`, `GlobalExceptionHandler` (bắt exception toàn cục).

### Bước 2: Module Auth & User
- [ ] Setup `Spring Security 6` và viết `JwtAuthFilter`.
- [ ] Cấu hình `JwtService` tạo/validate Access Token (15p) & Refresh Token (7 ngày).
- [ ] Viết các API public: `/auth/register` (Pass Bcrypt), `/auth/login`.
- [ ] Áp dụng **Refresh Token Rotation**: Xoá cache trong Redis khi rotate / logout.
- [ ] Tích hợp **Google OAuth2** để Login.
- [ ] Viết API quản lý Người Dùng & CRUD Địa chỉ giao hàng.

### Bước 3: Module Catalog (Danh mục & Sản phẩm)
- [ ] Dựng API Cây danh mục (Category) đa cấp. Tích hợp **Redis Caching** (TTL 1h). 
- [ ] **Tự implement LRU Cache** backup ở memory (thay vì lệ thuộc hoàn toàn Redis).
- [ ] Cấu hình và tích hợp SDK **MinIO** upload ảnh -> lấy presigned URL.
- [ ] Xây dựng CRUD cho Products & Product Variants (kèm jsonb attributes).
- [ ] Viết Custom Pagination Builder cho chức năng filter linh hoạt.

### Bước 4: Fulltext Search với Elasticsearch & Cart
- [ ] Cài đặt Spring Data Elasticsearch để tự động đẩy dữ liệu (Sync) khi tạo mới Product.
- [ ] Viết API `/search` có filter phức tạp, highlight chữ.
- [ ] Viết API `/suggest` Autocomplete sử dụng ES completion suggester (hoặc tự code `Trie` trên app).
- [ ] Dựng Module Giỏ hàng (Cart) hoàn toàn lưu vào **Redis**, xử lý trường hợp Guest-cart và User-cart.
- [ ] Logic merge Giỏ hàng từ Guest sang User khi Login xảy ra.

---

## 🟡 GIAI ĐOẠN 2: Core Business & Payment (Tuần 2)
*Mục tiêu: Người dùng có thể Đặt hàng, Khóa tồn kho, Thanh toán VNPay và hệ thống tự deploy.*

### Bước 5: Inventory (Tồn kho)
- [ ] Viết service kiểm tra và trừ tồn kho bằng cơ chế **Pessimistic Locking** (`SELECT FOR UPDATE`). 
- [ ] Viết logic cảnh báo (Low Stock Notification) kết nối gửi qua **Kafka**.
- [ ] Tính năng Flash Sale counter sử dụng **AtomicInteger** và Redis `DECRBY`.

### Bước 6: Order (Đơn hàng) & State Machine
- [ ] Sinh Mã Đơn Hàng (Order code generator unique).
- [ ] Xây dựng tính năng Checkout Checkout: Kiểm tra Giỏ Hàng -> Lock tồn kho -> Tạo Đơn -> Clear Giỏ Hàng (Toàn bộ gom chung 1 `@Transactional`).
- [ ] **Tự viết Order State Machine** bằng enum và Map (`Map<Status, Set<Status>>`) để quản lý nghiêm ngặt quy trình chuyển status của đơn hàng.
- [ ] Dùng `Spring Events` (`@EventListener`) nhận sự kiện đơn hàng tạo thành công để xuất bill báo Kafka/Email.

### Bước 7: Thanh toán VNPay (Payment)
- [ ] Áp dụng **Strategy Pattern** cho Interface thiết lập thanh toán (VNPayStrategy, CODStrategy, BankStrategy).
- [ ] Tích hợp hàm băm **HMAC-SHA512** của VNPay sinh String chữ ký.
- [ ] Viết Return URL để hứng người dùng lúc thanh toán xong trả về Frontend.
- [ ] Nhận và bảo mật xử lý Webhook **IPN (Instant Payment Notification)** -> Bắt buộc xử lý **Idempotency** (Tránh trừ tiền / xác nhận đơn 2 lần).

### Bước 8: CI/CD & Cloud Deployment
- [ ] Viết Multi-stage `Dockerfile` (size nhỏ).
- [ ] Thiết lập `GitHub Actions` CI/CD Workflow.
- [ ] Deploy Database + Các service phụ trợ và Spring Boot lên platform cloud (Railway/Render).
- [ ] Cập nhật **Live URL** ngay cho vào CV.

---

## 🔴 GIAI ĐOẠN 3: AI Service, Dashboard & Testing (Tuần 3)
*Mục tiêu: Đưa điểm nhấn vào Profile qua AI Integrations, Batch jobs, tối ưu và kiểm thử.*

### Bước 9: AI System (RAG, Chatbot, Recommendation)
- [ ] Setup microservice AI bằng **Python FastAPI + Uvicorn**.
- [ ] Tạo **Qdrant Vector DB** và nhúng (`embedding`) sản phẩm qua *Sentence Transformers*.
- [ ] API Recommendation: Logic gợi ý (Top nearest distance based on user history).
- [ ] Viết Chatbot API bằng RAG với LangChain kết nối OpenAI/Gemini phục vụ người dùng.

### Bước 10: Reviews & Sentiment Analysis
- [ ] Xây dựng module CRUD Đánh giá (Review) sản phẩm, chỉ cho phép User đã nhận hàng (`Completed`).
- [ ] Cấu trúc Asynchronous: Có review mới -> Bắn Kafka gọi Python AI lấy "Tình trạng cảm xúc" (Positive/Neutral/Negative).
- [ ] Quét cron job gom review chạy **AI summary** hàng ngày dùng `Spring Batch`.

### Bước 11: Admin Control & Batch Jobs
- [ ] Xây dựng Admin Dashboard APIs (Doanh thu tuần/tháng, sản phẩm hot).
- [ ] Import sản phẩm qua CSV sử dụng **Custom Async Executor** (tự configure ThreadPool).
- [ ] Security Guard cho API Admin (Chỉ role ADMIN access được).

### Bước 12: Testing, Metrics & Polish
- [ ] Cắm `Spring Actuator` + Prometheus + Grafana lấy Metrics cho ngầu.
- [ ] Viết Unit Test cho Service quan trọng bằng `JUnit 5 + Mockito`.
- [ ] Viết Integration Test cho Flow Đặt Hàng giả lập bằng `Testcontainers`.
- [ ] Hoàn thiện Code refactoring, bắt Exception kỹ. Đính kèm Swagger UI.
- [ ] Hoàn thiện `README.md` để khoe CV với GIF demo + System Architecture Diagram.
