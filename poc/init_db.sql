-- Xoá bảng cũ
DROP TABLE IF EXISTS notification_jobs CASCADE;
DROP TABLE IF EXISTS feedbacks CASCADE;
DROP TABLE IF EXISTS booking_audit CASCADE;
DROP TABLE IF EXISTS question_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS slots CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 2. Slots
CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available'
);

-- 3. Bookings
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id),
    slot_id INTEGER REFERENCES slots(id),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    meeting_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ràng buộc (Chống double booking)
CREATE UNIQUE INDEX idx_unique_confirmed_booking ON bookings (slot_id) WHERE status = 'Confirmed';

-- 4. Booking Audit (Lưu vết chuyển trạng thái)
CREATE TABLE booking_audit (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Feedbacks
CREATE TABLE feedbacks (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) UNIQUE, -- 1 booking chỉ 1 feedback
    content TEXT NOT NULL
);

-- 6. Questions & Tags (Question Filtering)
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE question_tags (
    question_id INTEGER REFERENCES questions(id),
    tag_id INTEGER REFERENCES tags(id),
    PRIMARY KEY (question_id, tag_id)
);

-- 7. Notification Jobs (Outbox Retry Pattern)
CREATE TABLE notification_jobs (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, sent, failed
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============== CHÈN DỮ LIỆU MẪU ===============
INSERT INTO users (id, name, role) VALUES 
(1, 'Mentor A', 'Mentor'),
(2, 'Student B', 'Student'),
(3, 'Student C', 'Student');
-- Sửa sequence của users (Do insert ID thủ công)
SELECT setval('users_id_seq', 3);

INSERT INTO slots (id, mentor_id, start_time, status) VALUES 
(1, 1, '2026-09-01 10:00:00', 'Available'),
(2, 1, '2026-09-02 10:00:00', 'Available');
SELECT setval('slots_id_seq', 2);

-- Chèn câu hỏi & tags
INSERT INTO questions (id, content) VALUES 
(1, 'Câu hỏi React cơ bản'),
(2, 'Câu hỏi Node.js nâng cao'),
(3, 'Câu hỏi Fullstack (React + Node)');
SELECT setval('questions_id_seq', 3);

INSERT INTO tags (id, name) VALUES (1, 'React'), (2, 'Node');
SELECT setval('tags_id_seq', 2);

INSERT INTO question_tags (question_id, tag_id) VALUES 
(1, 1), -- Q1: React
(2, 2), -- Q2: Node
(3, 1), (3, 2); -- Q3: React + Node
