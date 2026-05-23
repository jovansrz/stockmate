-- ================================================
-- StockMate Database Schema
-- Run this SQL in your PostgreSQL client (e.g. pgAdmin or psql)
-- after creating the 'stockmate' database.
-- ================================================

-- 1. Create the userdata table
CREATE TABLE IF NOT EXISTS userdata (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    totalXp       INTEGER      NOT NULL DEFAULT 0,
    saldo_virtual BIGINT       NOT NULL DEFAULT 10000000
);

-- 2. Create the course table
CREATE TABLE IF NOT EXISTS course (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    deskripsi_title TEXT,
    content         TEXT,
    totalxp         INTEGER NOT NULL DEFAULT 0
);

-- 3. Create the quizzes table (links quiz to a course)
CREATE TABLE IF NOT EXISTS quizzes (
    id        SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES course(id) ON DELETE CASCADE
);

-- 4. Create the questions table
CREATE TABLE IF NOT EXISTS questions (
    id          SERIAL PRIMARY KEY,
    quizzes_id  INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question    TEXT NOT NULL
);

-- 5. Create the question options table
CREATE TABLE IF NOT EXISTS questions_options (
    id              SERIAL PRIMARY KEY,
    questions_id    INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    question_option TEXT NOT NULL
);

-- ================================================
-- Sample seed data (optional - insert a test user)
-- ================================================

-- Insert a test user (password stored as plain text - match backend behavior)
-- You can change these values as needed.
INSERT INTO userdata (name, username, password, totalXp, saldo_virtual)
VALUES ('Test User', 'testuser', 'password123', 0, 10000000)
ON CONFLICT (username) DO NOTHING;

-- Insert sample courses
INSERT INTO course (title, deskripsi_title, content, totalxp) VALUES
  ('Saham Itu Apa?', 'Pengenalan dasar investasi saham', 'Saham adalah bukti kepemilikan sebagian perusahaan...', 20),
  ('Cara Membaca Laporan Keuangan', 'Memahami laporan keuangan perusahaan', 'Laporan keuangan terdiri dari neraca, laporan laba rugi...', 30),
  ('Analisis Teknikal Dasar', 'Belajar membaca grafik saham', 'Analisis teknikal menggunakan data historis harga...', 25)
ON CONFLICT DO NOTHING;
