CREATE DATABASE IF NOT EXISTS habit_forest DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE habit_forest;

CREATE TABLE IF NOT EXISTS habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    frequency_type VARCHAR(50) DEFAULT 'daily', -- 'daily', 'weekly'
    frequency_count INT DEFAULT 1,
    reminder_time VARCHAR(5) DEFAULT NULL,
    tree_type VARCHAR(50) DEFAULT 'pine',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    habit_id INT NOT NULL,
    check_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE KEY unique_habit_date (habit_id, check_date)
);

CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    badge_key VARCHAR(50) NOT NULL UNIQUE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
