-- Full Mock Data Seeding for eduDev
-- Chạy tự động thông qua Flyway

-- 1. Profiles
INSERT INTO student_profiles (user_id, grade, target_exam_year, interested_majors, favorite_subjects)
VALUES (3, '12', 2026, 'IT, Economics', 'Math, English')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO teacher_profiles (user_id, specialization, years_of_experience, bio)
VALUES (2, 'Math & Science', 5, 'Chuyên gia luyện thi Đại học khối A, A1')
ON CONFLICT (user_id) DO NOTHING;

-- 2. Quizzes
-- Note: 'lesson_id' is optional. We will attach one and leave one standalone.
INSERT INTO quizzes (id, lesson_id, creator_id, title, description, time_limit_minutes, passing_score, status)
VALUES (1, NULL, 2, 'Math Midterm Quiz', 'Đề thi giữa kỳ môn Toán', 45, 50, 'PUBLISHED'),
       (2, 1, 2, 'Math Advanced Quiz', 'Đề kiểm tra nâng cao', 60, 60, 'PENDING_REVIEW')
ON CONFLICT DO NOTHING;
SELECT setval('quizzes_id_seq', 2);

-- 3. Quiz Questions
INSERT INTO questions (id, quiz_id, content, explanation, point, display_order)
VALUES (1, 1, 'Giải phương trình x^2 - 4 = 0', 'Sử dụng hằng đẳng thức', 10, 1),
       (2, 1, 'Chọn các số nguyên tố trong dãy', 'Số nguyên tố chỉ chia hết cho 1 và chính nó', 10, 2)
ON CONFLICT DO NOTHING;
SELECT setval('questions_id_seq', 2);

-- 4. Quiz Options (table is named choices)
INSERT INTO choices (id, question_id, content, is_correct, display_order)
VALUES (1, 1, 'x = 2 hoặc x = -2', TRUE, 1),
       (2, 1, 'x = 4', FALSE, 2),
       (3, 2, '2, 3, 5', TRUE, 1),
       (4, 2, '4, 6', FALSE, 2)
ON CONFLICT DO NOTHING;
SELECT setval('choices_id_seq', 4);

-- 5. Combos
INSERT INTO combos (id, name, description, price, status)
VALUES (1, 'Khóa luyện thi Đại học Tổ hợp A01', 'Bao gồm Toán, Lý, Anh', 999000.0, 'PUBLISHED'),
       (2, 'Khóa IELTS 6.5 Cấp tốc', 'Luyện thi IELTS trong 3 tháng', 1500000.0, 'DRAFT')
ON CONFLICT DO NOTHING;
SELECT setval('combos_id_seq', 2);

-- 6. Combo Items
INSERT INTO combo_items (id, combo_id, subject_id, display_order)
VALUES (1, 1, 1, 1),
       (2, 1, 2, 2)
ON CONFLICT DO NOTHING;
SELECT setval('combo_items_id_seq', 2);

-- 7. Enrollments & Progress
INSERT INTO enrollments (id, user_id, combo_id, status)
VALUES (1, 3, 1, 'ACTIVE')
ON CONFLICT DO NOTHING;
SELECT setval('enrollments_id_seq', 1);

INSERT INTO combo_progress (id, enrollment_id, lesson_id, completed)
VALUES (1, 1, 1, TRUE)
ON CONFLICT DO NOTHING;
SELECT setval('combo_progress_id_seq', 1);

-- 8. Teacher Assignments
INSERT INTO teacher_subject_assignments (id, teacher_id, subject_id)
VALUES (1, 2, 1)
ON CONFLICT DO NOTHING;
SELECT setval('teacher_subject_assignments_id_seq', 1);

INSERT INTO teacher_student_assignments (id, teacher_id, student_id, status)
VALUES (1, 2, 3, 'ACTIVE')
ON CONFLICT DO NOTHING;
SELECT setval('teacher_student_assignments_id_seq', 1);

-- 9. Teacher Feedbacks
INSERT INTO teacher_feedbacks (id, teacher_id, student_id, lesson_id, content, rating)
VALUES (1, 2, 3, 1, 'Học sinh làm bài tập tốt, cần cải thiện tốc độ giải toán', 4)
ON CONFLICT DO NOTHING;
SELECT setval('teacher_feedbacks_id_seq', 1);

-- 10. Content Reviews
INSERT INTO content_reviews (id, lesson_id, reviewer_id, status, note)
VALUES (1, 1, 1, 'APPROVED', 'Nội dung chuẩn')
ON CONFLICT DO NOTHING;
SELECT setval('content_reviews_id_seq', 1);

-- 11. Admission Combinations & Major Admissions
INSERT INTO admission_combinations (id, code, description)
VALUES (1, 'A00', 'Toán, Lý, Hóa'),
       (2, 'A01', 'Toán, Lý, Anh')
ON CONFLICT DO NOTHING;
SELECT setval('admission_combinations_id_seq', 2);

INSERT INTO major_admissions (id, major_id, combination_id, benchmark_score, year)
VALUES (1, 1, 1, 26.5, 2023),
       (2, 1, 2, 27.0, 2023)
ON CONFLICT DO NOTHING;
SELECT setval('major_admissions_id_seq', 2);

-- 12. Student Wishlist
INSERT INTO student_wishlists (id, student_id, major_id, priority)
VALUES (1, 3, 1, 1)
ON CONFLICT DO NOTHING;
SELECT setval('student_wishlists_id_seq', 1);

-- 13. Recommendations
INSERT INTO career_personalities (id, name, description)
VALUES (1, 'Investigative', 'Thích nghiên cứu, tìm tòi'),
       (2, 'Realistic', 'Thích làm việc thực tế, kỹ thuật')
ON CONFLICT DO NOTHING;
SELECT setval('career_personalities_id_seq', 2);

INSERT INTO career_recommendations (id, student_id, suggested_major_id, reasoning, confidence_score, is_saved)
VALUES (1, 3, 1, 'Phù hợp với nhóm tính cách Investigative', 88.5, TRUE)
ON CONFLICT DO NOTHING;
SELECT setval('career_recommendations_id_seq', 1);

-- 14. Notifications
INSERT INTO notifications (id, user_id, title, content, type, is_read)
VALUES (1, 3, 'Chào mừng đến với eduDev', 'Hệ thống đã sẵn sàng cho bạn.', 'SYSTEM', FALSE)
ON CONFLICT DO NOTHING;
SELECT setval('notifications_id_seq', 1);
