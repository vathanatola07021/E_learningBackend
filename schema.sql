-- ==============================================================
-- EduLearn E-Learning Platform - MySQL Database Schema
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
-- ==============================================================

CREATE DATABASE IF NOT EXISTS `edulearn_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `edulearn_db`;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------
-- 1. Users Table (Authentication & Base Identity)
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'instructor', 'admin') NOT NULL DEFAULT 'student',
  `profile_photo` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 2. Students Table (Detailed Student Profile)
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `gender` VARCHAR(50) DEFAULT 'Not Specified',
  `date_of_birth` VARCHAR(50) DEFAULT '',
  `phone_number` VARCHAR(50) DEFAULT '',
  `email` VARCHAR(255) NOT NULL,
  `profile_photo` VARCHAR(500) DEFAULT '',
  `education_level` VARCHAR(255) DEFAULT 'Undergraduate',
  `account_status` VARCHAR(50) DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_students_student_id` (`student_id`),
  KEY `idx_students_email` (`email`),
  CONSTRAINT `fk_students_user` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 3. Instructors Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `instructors`;
CREATE TABLE `instructors` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) DEFAULT '',
  `bio` TEXT,
  `avatar` VARCHAR(500) DEFAULT '',
  `user_id` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_instructors_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 4. Categories Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon_url` VARCHAR(500) DEFAULT '',
  `status` VARCHAR(50) DEFAULT 'active',
  `course_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 5. Courses Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category_id` VARCHAR(64) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500) DEFAULT '',
  `instructor_id` VARCHAR(64) NOT NULL,
  `duration` VARCHAR(50) DEFAULT '0h 00m',
  `level` VARCHAR(50) DEFAULT 'All Levels',
  `lesson_count` INT DEFAULT 0,
  `rating` DECIMAL(3,2) DEFAULT 4.50,
  `enrollment_count` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'published',
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `is_free` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_courses_category` (`category_id`),
  KEY `idx_courses_instructor` (`instructor_id`),
  KEY `idx_courses_rating` (`rating`),
  CONSTRAINT `fk_courses_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_courses_instructor` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 6. Lessons Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `lesson_order` INT NOT NULL DEFAULT 1,
  `video_url` VARCHAR(500) DEFAULT '',
  `duration` VARCHAR(50) DEFAULT '00:00',
  `status` VARCHAR(50) DEFAULT 'published',
  `is_locked` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_lessons_course_order` (`course_id`, `lesson_order`),
  CONSTRAINT `fk_lessons_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 7. Materials Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `materials`;
CREATE TABLE `materials` (
  `id` VARCHAR(64) NOT NULL,
  `lesson_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) DEFAULT 'pdf',
  `file_url` VARCHAR(500) DEFAULT '',
  `upload_date` VARCHAR(50) DEFAULT '',
  `description` TEXT,
  `file_size` VARCHAR(50) DEFAULT '2.0 MB',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_materials_lesson` (`lesson_id`),
  CONSTRAINT `fk_materials_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 8. Quizzes Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE `quizzes` (
  `id` VARCHAR(64) NOT NULL,
  `lesson_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `total_questions` INT DEFAULT 0,
  `time_limit_minutes` INT DEFAULT 15,
  `passing_score` DECIMAL(5,2) DEFAULT 70.00,
  `maximum_attempts` INT DEFAULT 3,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_quizzes_lesson` (`lesson_id`),
  KEY `idx_quizzes_course` (`course_id`),
  CONSTRAINT `fk_quizzes_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_quizzes_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 9. Questions Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` VARCHAR(64) NOT NULL,
  `quiz_id` VARCHAR(64) NOT NULL,
  `question_text` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'multiple_choice',
  `options_json` JSON NOT NULL,
  `correct_answer_index` INT NOT NULL DEFAULT 0,
  `explanation` TEXT,
  `question_order` INT DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_questions_quiz` (`quiz_id`),
  CONSTRAINT `fk_questions_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 10. Quiz Attempts Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `quiz_attempts`;
CREATE TABLE `quiz_attempts` (
  `id` VARCHAR(64) NOT NULL,
  `quiz_id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `score` INT DEFAULT 0,
  `percentage` DECIMAL(5,2) DEFAULT 0.00,
  `correct_answers` INT DEFAULT 0,
  `incorrect_answers` INT DEFAULT 0,
  `passed` TINYINT(1) DEFAULT 0,
  `attempt_date` VARCHAR(100) NOT NULL,
  `selected_answers_json` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_attempts_quiz_student` (`quiz_id`, `student_id`),
  CONSTRAINT `fk_attempts_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 11. Assignments Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `lesson_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `instruction` TEXT,
  `due_date` VARCHAR(100) DEFAULT '',
  `supporting_file` VARCHAR(500) DEFAULT '',
  `maximum_score` INT DEFAULT 100,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_assignments_course` (`course_id`),
  KEY `idx_assignments_lesson` (`lesson_id`),
  CONSTRAINT `fk_assignments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_assignments_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 12. Assignment Submissions Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `assignment_submissions`;
CREATE TABLE `assignment_submissions` (
  `id` VARCHAR(64) NOT NULL,
  `assignment_id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `submission_date` VARCHAR(100) NOT NULL,
  `submission_file` VARCHAR(500) DEFAULT NULL,
  `text_submission` TEXT NOT NULL,
  `comment` TEXT DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'submitted',
  `score` INT DEFAULT NULL,
  `grade` VARCHAR(10) DEFAULT NULL,
  `feedback` TEXT DEFAULT NULL,
  `reviewed_date` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_submissions_asg_student` (`assignment_id`, `student_id`),
  CONSTRAINT `fk_submissions_asg` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 13. Enrollments Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `enrollment_date` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'active',
  `progress` DECIMAL(5,2) DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_course` (`student_id`, `course_id`),
  KEY `idx_enrollments_student` (`student_id`),
  KEY `idx_enrollments_course` (`course_id`),
  CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 14. Lesson Completions Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `lesson_completions`;
CREATE TABLE `lesson_completions` (
  `id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `lesson_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `completed_at` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_lesson` (`student_id`, `lesson_id`),
  KEY `idx_completions_student_course` (`student_id`, `course_id`),
  CONSTRAINT `fk_completions_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_completions_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 15. Course Progress Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `course_progress`;
CREATE TABLE `course_progress` (
  `id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `completed_lessons` INT DEFAULT 0,
  `total_lessons` INT DEFAULT 0,
  `completed_quizzes` INT DEFAULT 0,
  `total_quizzes` INT DEFAULT 0,
  `submitted_assignments` INT DEFAULT 0,
  `total_assignments` INT DEFAULT 0,
  `percentage` DECIMAL(5,2) DEFAULT 0.00,
  `last_activity` VARCHAR(100) DEFAULT '',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_course_progress` (`course_id`, `student_id`),
  CONSTRAINT `fk_progress_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 16. Certificates Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `certificates`;
CREATE TABLE `certificates` (
  `id` VARCHAR(64) NOT NULL,
  `student_id` VARCHAR(64) NOT NULL,
  `student_name` VARCHAR(255) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `course_title` VARCHAR(255) NOT NULL,
  `issue_date` VARCHAR(100) NOT NULL,
  `certificate_code` VARCHAR(100) NOT NULL,
  `credential_url` VARCHAR(500) DEFAULT '',
  `instructor_name` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_cert_code` (`certificate_code`),
  KEY `idx_cert_student` (`student_id`),
  CONSTRAINT `fk_certificates_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 17. Learning Activities Table (History)
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `learning_activities`;
CREATE TABLE `learning_activities` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `course_title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `timestamp` VARCHAR(100) NOT NULL,
  `score_or_detail` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_activities_user` (`user_id`, `timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 18. Notifications Table
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(100) DEFAULT 'general',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notifs_user` (`user_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------
-- 19. User Favorites Table (Saved Courses)
-- --------------------------------------------------------------
DROP TABLE IF EXISTS `user_favorites`;
CREATE TABLE `user_favorites` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `course_id` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_favorite` (`user_id`, `course_id`),
  KEY `idx_fav_user` (`user_id`),
  CONSTRAINT `fk_fav_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
