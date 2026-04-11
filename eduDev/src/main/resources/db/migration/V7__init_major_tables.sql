-- Phase 8: Major Domain

CREATE TABLE majors (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(20) NOT NULL UNIQUE, -- Mã ngành (e.g. 7480201)
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    group_name  VARCHAR(100), -- Nhóm ngành
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admission_combinations (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(10) NOT NULL UNIQUE, -- Khối thi (e.g. A00, A01, D01)
    description VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE major_admissions (
    id             BIGSERIAL PRIMARY KEY,
    major_id       BIGINT NOT NULL,
    combination_id BIGINT NOT NULL,
    benchmark_score DECIMAL(5, 2), -- Điểm chuẩn tham khảo
    year           INTEGER,
    CONSTRAINT fk_ma_major       FOREIGN KEY (major_id)       REFERENCES majors(id) ON DELETE CASCADE,
    CONSTRAINT fk_ma_combination FOREIGN KEY (combination_id) REFERENCES admission_combinations(id) ON DELETE CASCADE,
    CONSTRAINT uk_major_comb_year UNIQUE (major_id, combination_id, year)
);

CREATE TABLE student_wishlists (
    id         BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    major_id   BIGINT NOT NULL,
    priority   INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wishlist_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_major   FOREIGN KEY (major_id)   REFERENCES majors(id) ON DELETE CASCADE,
    CONSTRAINT uk_student_major UNIQUE (student_id, major_id)
);

-- Recommendation Domain
CREATE TABLE career_personalities (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE, -- e.g. Realistic, Investigative, Artistic, Social, Enterprising, Conventional
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Recommendation Table
CREATE TABLE career_recommendations (
    id               BIGSERIAL PRIMARY KEY,
    student_id       BIGINT NOT NULL,
    suggested_major_id BIGINT,
    reasoning        TEXT,
    confidence_score DECIMAL(5, 2),
    is_saved         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rec_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_rec_major   FOREIGN KEY (suggested_major_id) REFERENCES majors(id) ON DELETE SET NULL
);
