-- Phase 5: Combo Domain

CREATE TABLE combos (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url VARCHAR(500),
    price       DECIMAL(19, 2) NOT NULL DEFAULT 0.0,
    status      VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE combo_items (
    id         BIGSERIAL PRIMARY KEY,
    combo_id   BIGINT NOT NULL,
    subject_id BIGINT,
    topic_id   BIGINT,
    display_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_combo_item_combo   FOREIGN KEY (combo_id)   REFERENCES combos(id) ON DELETE CASCADE,
    CONSTRAINT fk_combo_item_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    CONSTRAINT fk_combo_item_topic   FOREIGN KEY (topic_id)   REFERENCES topics(id) ON DELETE CASCADE,
    CONSTRAINT ck_combo_item_target  CHECK (subject_id IS NOT NULL OR topic_id IS NOT NULL)
);

CREATE TABLE enrollments (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    combo_id     BIGINT NOT NULL,
    enrolled_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status       VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CANCELLED
    CONSTRAINT fk_enrollment_user  FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_combo FOREIGN KEY (combo_id) REFERENCES combos(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_combo UNIQUE (user_id, combo_id)
);

CREATE TABLE combo_progress (
    id             BIGSERIAL PRIMARY KEY,
    enrollment_id  BIGINT NOT NULL,
    lesson_id      BIGINT NOT NULL,
    completed      BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at   TIMESTAMP,
    CONSTRAINT fk_progress_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson     FOREIGN KEY (lesson_id)     REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT uk_enrollment_lesson UNIQUE (enrollment_id, lesson_id)
);

-- Indexes
CREATE INDEX idx_combo_items_combo ON combo_items(combo_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_combo_progress_enrollment ON combo_progress(enrollment_id);
