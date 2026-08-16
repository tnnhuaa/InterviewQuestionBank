-- Create table for Question Bank
CREATE TABLE IF NOT EXISTS question_bank (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    sub_topic VARCHAR(255),
    question_text TEXT NOT NULL,
    sample_answer TEXT,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Sessions (Each JD upload is a session)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    job_title VARCHAR(255),
    raw_jd TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Session Topics
CREATE TABLE IF NOT EXISTS session_topics (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for Session Questions
CREATE TABLE IF NOT EXISTS session_questions (
    id SERIAL PRIMARY KEY,
    session_topic_id INTEGER REFERENCES session_topics(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    sample_answer TEXT,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    source VARCHAR(50) DEFAULT 'AI_Generated', -- 'AI_Generated', 'Question_Bank', 'User_Added'
    original_bank_id INTEGER REFERENCES question_bank(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
