-- Phase 4: Quiz Domain

CREATE TABLE quizzes (
    id                BIGSERIAL PRIMARY KEY,
    lesson_id         BIGINT, -- Optional: Quiz can be linked to a lesson or standalone
    creator_id        BIGINT NOT NULL,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    time_limit_minutes INTEGER,
    passing_score     INTEGER NOT NULL DEFAULT 50,
    status            VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_lesson  FOREIGN KEY (lesson_id)  REFERENCES lessons(id) ON DELETE SET NULL,
    CONSTRAINT fk_quiz_creator FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE questions (
    id            BIGSERIAL PRIMARY KEY,
    quiz_id       BIGINT NOT NULL,
    content       TEXT NOT NULL,
    explanation   TEXT,
    point         INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE choices (
    id            BIGSERIAL PRIMARY KEY,
    question_id   BIGINT NOT NULL,
    content       TEXT NOT NULL,
    is_correct    BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_choice_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE quiz_attempts (
    id            BIGSERIAL PRIMARY KEY,
    quiz_id       BIGINT NOT NULL,
    user_id       BIGINT NOT NULL,
    score         INTEGER,
    completed_at  TIMESTAMP,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attempt_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE quiz_answers (
    id            BIGSERIAL PRIMARY KEY,
    attempt_id    BIGINT NOT NULL,
    question_id   BIGINT NOT NULL,
    choice_id     BIGINT NOT NULL,
    is_correct    BOOLEAN NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_attempt  FOREIGN KEY (attempt_id)  REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES questions(id),
    CONSTRAINT fk_answer_choice   FOREIGN KEY (choice_id)   REFERENCES choices(id)
);

-- Indexes
CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_choices_question ON choices(question_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
