-- Mock Data Seeding cho ứng dụng eduDev
-- Chạy tự động thông qua Flyway

-- 1. Thêm Users: admin, teacher, student (Password: 123456 -> hash bcrypt mock)
-- Lưu ý: Mật khẩu này nên đc mã hoá tương tự password thực tế. Để đơn giản dùng bcrypt hash của "123456" ($2a$10$X... )
INSERT INTO users (id, email, password_hash, full_name, role, status) VALUES
(1, 'admin@edudev.com', '$2b$10$8vEPSzZbappR2qHz3tjrJO3fm1UVbs0GSzODEm6u8rjUf1VS51q8q', 'System Admin', 'ADMIN', 'ACTIVE'),
(2, 'teacher@edudev.com', '$2b$10$8vEPSzZbappR2qHz3tjrJO3fm1UVbs0GSzODEm6u8rjUf1VS51q8q', 'Teacher Nguyen', 'TEACHER', 'ACTIVE'),
(3, 'student@edudev.com', '$2b$10$8vEPSzZbappR2qHz3tjrJO3fm1UVbs0GSzODEm6u8rjUf1VS51q8q', 'Student Tran', 'STUDENT', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;

-- Reset sequence manually
SELECT setval('users_id_seq', 3);

-- 2. Thêm Subject
INSERT INTO subjects (id, name, description, icon_url, display_order) VALUES
(1, 'Math Fundamentals', 'Basic to advanced mathematical logic for high school', 'icon-math.png', 1),
(2, 'English Prep', 'IELTS & University entrance exam preparation', 'icon-english.png', 2)
ON CONFLICT DO NOTHING;

SELECT setval('subjects_id_seq', 2);

-- 3. Thêm Topics
INSERT INTO topics (id, subject_id, name, description, display_order) VALUES
(1, 1, 'Algebra', 'Trình độ phương trình và hệ phương trình', 1),
(2, 1, 'Geometry', 'Hình học không gian và mặt cầu', 2)
ON CONFLICT DO NOTHING;
SELECT setval('topics_id_seq', 2);

-- 4. Thêm Lesson
INSERT INTO lessons (id, topic_id, creator_id, title, content, status, display_order) VALUES
(1, 1, 2, 'Lesson 1: Quadratic Equations', 'Bậc hai và định lý Vi-et. Ví dụ: ax^2 + bx + c = 0.', 'PUBLISHED', 1),
(2, 1, 2, 'Lesson 2: Inequalities', 'Bất đẳng thức Cauchy và ứng dụng.', 'PENDING_REVIEW', 2)
ON CONFLICT DO NOTHING;
SELECT setval('lessons_id_seq', 2);

-- 5. Thêm Majors
INSERT INTO majors (id, code, name, description, group_name) VALUES
(1, '7480201', 'Computer Science', 'Khoa học máy tính và lập trình AI', 'IT'),
(2, '7340101', 'Business Administration', 'Quản trị kinh doanh tổng hợp', 'Economics')
ON CONFLICT (code) DO NOTHING;
SELECT setval('majors_id_seq', 2);
