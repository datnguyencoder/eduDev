# eduDev — Modular Monolith Learning Platform

Senior-level Java/Spring Boot backend for a modular monolith learning and career orientation platform for high school students. Designed with production-ready patterns, clean architecture, and scalability in mind.

## 🚀 Technology Stack
- **Languages:** Java 21
- **Frameworks:** Spring Boot 3.4+, Spring Security, Spring Data JPA
- **Database:** PostgreSQL (Primary), Redis (Token storage/Rotation)
- **Messaging:** Kafka (Event-driven notifications/Analytics)
- **Migrations:** Flyway
- **Mapping:** MapStruct
- **Docs:** OpenAPI/Swagger (SpringDoc)

## 🏗 Architecture: Modular Monolith
The project follows a **package-by-feature** structure, ensuring strict separation of domains while remaining within a single deployable unit.

- `com.datdev.edudev.auth`: Security, JWT, Refresh Token Rotation, Profiles.
- `com.datdev.edudev.subject`: Core learning content (Subjects, Topics).
- `com.datdev.edudev.lesson`: Lessons, Bookmarks, Progress Tracking.
- `com.datdev.edudev.quiz`: Automated testing, grading logic, attempts.
- `com.datdev.edudev.combo`: Learning paths (Combos), Enrollments.
- `com.datdev.edudev.teacher`: Mentoring, Assignments, Feedbacks.
- `com.datdev.edudev.review`: Content moderation workflow.
- `com.datdev.edudev.major`: Career orientation, Recommendation engine.
- `com.datdev.edudev.notification`: Async alerts via Kafka.
- `com.datdev.edudev.analytics`: Admin dashboard metrics.

## 🔑 Key Features
1. **Security & Auth:** Secure JWT flow with Refresh Token Rotation in Redis. Account lockout and secure session management.
2. **Content Lifecycle:** DRAFT -> PENDING -> PUBLISHED workflow for lessons and quizzes.
3. **Auto-Grading:** Real-time quiz evaluation with detailed answer snapshots.
4. **Learning Paths:** Ability to bundle subjects into paid/free "Combos".
5. **Career AI:** Recommendation engine that analyzes student performance (Extensible for OpenAI integration).
6. **Async Notifications:** Event-driven architecture using Kafka for decoupled system alerts.

## 🛠 Setup & Running
1. **Start Infrastructure:**
   ```bash
   docker-compose up -d
   ```
2. **Environment Variables:**
   Ensure your `.env` (or IDE env) has:
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `KAFKA_BROKERS`
3. **Run App:**
   ```bash
   ./mvnw spring-boot:run
   ```

## 📚 API Documentation
Once running, visit: `http://localhost:8080/swagger-ui.html`
