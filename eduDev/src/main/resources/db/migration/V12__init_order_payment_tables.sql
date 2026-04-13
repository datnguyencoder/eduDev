-- ============================================================
-- V12: Order, Payment, and Audit tables for VNPay integration
-- ============================================================

-- 1. Orders table
CREATE TABLE orders (
    id            BIGSERIAL PRIMARY KEY,
    order_code    VARCHAR(50)    NOT NULL UNIQUE,
    student_id    BIGINT         NOT NULL,
    total_amount  DECIMAL(19, 2) NOT NULL,
    currency      VARCHAR(10)    NOT NULL DEFAULT 'VND',
    status        VARCHAR(30)    NOT NULL DEFAULT 'PENDING',
    created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_orders_student    ON orders(student_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 2. Order items table
CREATE TABLE order_items (
    id                 BIGSERIAL PRIMARY KEY,
    order_id           BIGINT         NOT NULL,
    item_type          VARCHAR(30)    NOT NULL,
    item_id            BIGINT         NOT NULL,
    item_name_snapshot VARCHAR(500)   NOT NULL,
    unit_price         DECIMAL(19, 2) NOT NULL,
    quantity           INTEGER        NOT NULL DEFAULT 1,
    line_total         DECIMAL(19, 2) NOT NULL,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 3. Payment transactions table
CREATE TABLE payment_transactions (
    id                     BIGSERIAL PRIMARY KEY,
    order_id               BIGINT         NOT NULL,
    provider               VARCHAR(30)    NOT NULL DEFAULT 'VNPAY',
    txn_ref                VARCHAR(100)   NOT NULL UNIQUE,
    provider_transaction_no VARCHAR(100),
    amount                 DECIMAL(19, 2) NOT NULL,
    status                 VARCHAR(30)    NOT NULL DEFAULT 'INITIATED',
    bank_code              VARCHAR(50),
    response_code          VARCHAR(10),
    pay_date               TIMESTAMP,
    raw_request_params     TEXT,
    raw_response_params    TEXT,
    ipn_received_at        TIMESTAMP,
    return_received_at     TIMESTAMP,
    created_at             TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_order      ON payment_transactions(order_id);
CREATE INDEX idx_payment_status     ON payment_transactions(status);
CREATE INDEX idx_payment_created_at ON payment_transactions(created_at);

-- 4. Payment audit logs table (immutable)
CREATE TABLE payment_audit_logs (
    id                     BIGSERIAL PRIMARY KEY,
    payment_transaction_id BIGINT,
    source                 VARCHAR(30) NOT NULL,
    payload                TEXT        NOT NULL,
    signature_valid        BOOLEAN,
    note                   VARCHAR(500),
    created_at             TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_payment FOREIGN KEY (payment_transaction_id) REFERENCES payment_transactions(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_payment    ON payment_audit_logs(payment_transaction_id);
CREATE INDEX idx_audit_created_at ON payment_audit_logs(created_at);

-- 5. Extend enrollments table with order/payment tracking
ALTER TABLE enrollments ADD COLUMN order_id                BIGINT;
ALTER TABLE enrollments ADD COLUMN payment_transaction_id  BIGINT;
ALTER TABLE enrollments ADD COLUMN activated_at            TIMESTAMP;
ALTER TABLE enrollments ADD COLUMN expired_at              TIMESTAMP;

ALTER TABLE enrollments ADD CONSTRAINT fk_enrollment_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE enrollments ADD CONSTRAINT fk_enrollment_payment
    FOREIGN KEY (payment_transaction_id) REFERENCES payment_transactions(id) ON DELETE SET NULL;

-- Missing index from V4 (combo_id in enrollments for joins)
CREATE INDEX idx_enrollments_combo ON enrollments(combo_id);
