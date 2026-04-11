-- Phase 7: Review Workflow Domain

CREATE TABLE content_reviews (
    id            BIGSERIAL PRIMARY KEY,
    lesson_id     BIGINT,
    quiz_id       BIGINT,
    reviewer_id   BIGINT NOT NULL,
    status        VARCHAR(30) NOT NULL, -- APPROVED, REJECTED
    note          TEXT,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_lesson   FOREIGN KEY (lesson_id)   REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_quiz     FOREIGN KEY (quiz_id)     REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT ck_review_target   CHECK (lesson_id IS NOT NULL OR quiz_id IS NOT NULL)
);

-- Index
CREATE INDEX idx_content_reviews_reviewer ON content_reviews(reviewer_id);
