-- Phase 6: Teacher Workflow Domain

CREATE TABLE teacher_subject_assignments (
    id         BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ts_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ts_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT uk_teacher_subject UNIQUE (teacher_id, subject_id)
);

CREATE TABLE teacher_student_assignments (
    id         BIGSERIAL PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status     VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tstud_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tstud_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_teacher_student UNIQUE (teacher_id, student_id)
);

CREATE TABLE teacher_feedbacks (
    id          BIGSERIAL PRIMARY KEY,
    teacher_id  BIGINT NOT NULL,
    student_id  BIGINT NOT NULL,
    lesson_id   BIGINT,
    content     TEXT NOT NULL,
    rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_lesson  FOREIGN KEY (lesson_id)  REFERENCES lessons(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_ts_assignments_teacher ON teacher_subject_assignments(teacher_id);
CREATE INDEX idx_tstud_assignments_teacher ON teacher_student_assignments(teacher_id);
CREATE INDEX idx_feedbacks_student ON teacher_feedbacks(student_id);
