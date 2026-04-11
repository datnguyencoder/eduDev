-- Phase 3: Subject, Topic, Lesson, LessonResource, Bookmark, LessonProgress

CREATE TABLE subjects (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url    VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics (
    id          BIGSERIAL PRIMARY KEY,
    subject_id  BIGINT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_topic_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE lessons (
    id               BIGSERIAL PRIMARY KEY,
    topic_id         BIGINT NOT NULL,
    creator_id       BIGINT NOT NULL,
    title            VARCHAR(255) NOT NULL,
    content          TEXT,
    summary          VARCHAR(500),
    difficulty       VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    status           VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    estimated_minutes INTEGER,
    display_order    INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lesson_topic   FOREIGN KEY (topic_id)   REFERENCES topics(id) ON DELETE CASCADE,
    CONSTRAINT fk_lesson_creator FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE lesson_resources (
    id            BIGSERIAL PRIMARY KEY,
    lesson_id     BIGINT NOT NULL,
    title         VARCHAR(255) NOT NULL,
    resource_url  VARCHAR(500) NOT NULL,
    resource_type VARCHAR(30) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_resource_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

CREATE TABLE bookmarks (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    lesson_id  BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookmark_user   FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmark_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT uk_bookmark UNIQUE (user_id, lesson_id)
);

CREATE TABLE lesson_progress (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL,
    lesson_id    BIGINT NOT NULL,
    completed    BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_user   FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT uk_lesson_progress UNIQUE (user_id, lesson_id)
);

-- Indexes for common queries
CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_lessons_topic ON lessons(topic_id);
CREATE INDEX idx_lessons_creator ON lessons(creator_id);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
