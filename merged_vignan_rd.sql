-- ========================================================
-- VIGNAN RESEARCH & DEVELOPMENT UNIFIED DATABASE SCHEMA
-- Database: vignan_rd
-- Consolidates:
--   1. Student Publication Tracker (publications, reimbursements, users, roles)
--   2. Guideship Allotment Portal (guides, supervisor_applications, supervisor_publications, settings, admin_users)
--   3. ProjectPi Proposals Management (admins, proposals, copis)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `vignan_rd` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vignan_rd`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. STUDENT PUBLICATION TRACKER TABLES
-- --------------------------------------------------------

DROP VIEW IF EXISTS `public_publications`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `publications`;
DROP TABLE IF EXISTS `reimbursements`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) PRIMARY KEY,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_roles` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `role` ENUM('super_admin', 'admin') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `publications` (
    `id` VARCHAR(36) PRIMARY KEY,
    `roll_no` TEXT NOT NULL,
    `name` TEXT NOT NULL,
    `program` VARCHAR(100) NOT NULL,
    `branch` TEXT NOT NULL,
    `dept` TEXT DEFAULT NULL,
    `article_title` TEXT NOT NULL,
    `publication_type` VARCHAR(100) NOT NULL,
    `indexing` VARCHAR(100) NOT NULL,
    `journal_conference_title` TEXT NOT NULL,
    `sponsorship` VARCHAR(255) DEFAULT NULL,
    `mentor_name` TEXT NOT NULL,
    `paper_link` TEXT DEFAULT NULL,
    `funding_amount` DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    `nirf_ranking` VARCHAR(100) DEFAULT NULL,
    `naac_ranking` VARCHAR(100) DEFAULT NULL,
    `conf_date` VARCHAR(100) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reimbursements` (
    `id` VARCHAR(50) PRIMARY KEY,
    `paper_title` VARCHAR(255) NOT NULL,
    `host_inst` VARCHAR(255) NOT NULL,
    `conf_name` VARCHAR(255) NOT NULL,
    `conf_dates` VARCHAR(100) NOT NULL,
    `fee_paid` DECIMAL(15, 2) NOT NULL,
    `roll_no` VARCHAR(50) NOT NULL,
    `student_name` VARCHAR(255) NOT NULL,
    `program` VARCHAR(50) DEFAULT 'UG' NOT NULL,
    `branch` VARCHAR(100) NOT NULL,
    `dept` VARCHAR(100) NOT NULL,
    `guide_name` VARCHAR(255) DEFAULT NULL,
    `bank_acc_holder` VARCHAR(255) NOT NULL,
    `bank_acc_no` VARCHAR(100) NOT NULL,
    `bank_name` VARCHAR(255) NOT NULL,
    `bank_branch` VARCHAR(255) NOT NULL,
    `ifsc` VARCHAR(50) NOT NULL,
    `paper_id` VARCHAR(100) DEFAULT NULL,
    `paper_doi` VARCHAR(100) DEFAULT NULL,
    `nirf_ranking` VARCHAR(100) DEFAULT NULL,
    `naac_ranking` VARCHAR(100) DEFAULT NULL,
    `conf_date` VARCHAR(100) DEFAULT NULL,
    `status` ENUM('Submitted', 'Under Review', 'Approved', 'Rejected') DEFAULT 'Submitted' NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE OR REPLACE VIEW `public_publications` AS
SELECT 
    `id`, `roll_no`, `name`, `program`, `branch`, `dept`, `article_title`,
    `publication_type`, `indexing`, `journal_conference_title`, `sponsorship`,
    `mentor_name`, `paper_link`, `funding_amount`, `nirf_ranking`, `naac_ranking`,
    `conf_date`, `created_at`, `updated_at`
FROM `publications`;

-- Seed Publication Admins (superadmin@vignan.ac.in: super123 | admin@vignan.ac.in: admin123)
INSERT INTO `users` (`id`, `email`, `password_hash`) VALUES
('usr-super-admin-uuid-0001', 'superadmin@vignan.ac.in', '$2a$10$fCnTK.EkLTug9bqI7dnEA.ALierZ8673szhIiKTkpUIEbkrz3jGWa'),
('usr-admin-uuid-0002', 'admin@vignan.ac.in', '$2a$10$/p9qrBxMrjFOE9s2yg2lk.3BN9/LEnOLi5ub3OhLscg/ixuR780me')
ON DUPLICATE KEY UPDATE `email`=`email`;

INSERT INTO `user_roles` (`id`, `user_id`, `role`) VALUES
('role-super-uuid-0001', 'usr-super-admin-uuid-0001', 'super_admin'),
('role-admin-uuid-0002', 'usr-admin-uuid-0002', 'admin')
ON DUPLICATE KEY UPDATE `role`=`role`;


-- --------------------------------------------------------
-- 2. GUIDESHIP ALLOTMENT PORTAL TABLES
-- --------------------------------------------------------

DROP TABLE IF EXISTS `supervisor_publications`;
DROP TABLE IF EXISTS `supervisor_applications`;
DROP TABLE IF EXISTS `guides`;
DROP TABLE IF EXISTS `settings`;
DROP TABLE IF EXISTS `admin_users`;

CREATE TABLE IF NOT EXISTS `guides` (
    `employee_id` INT PRIMARY KEY,
    `guide_name` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(100) NOT NULL,
    `in_service` VARCHAR(10) NOT NULL,
    `remarks` TEXT,
    `ft_count` INT DEFAULT 0,
    `pt_count` INT DEFAULT 0,
    `awarded_count` INT DEFAULT 0,
    `allocated_date` DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `settings` (
    `config_key` VARCHAR(100) PRIMARY KEY,
    `config_value` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `supervisor_applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `faculty_name` VARCHAR(100) NOT NULL,
    `employee_id` INT NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(100) NOT NULL,
    `level` VARCHAR(50),
    `joining_date` DATE,
    `department` VARCHAR(100) NOT NULL,
    `school` VARCHAR(100),
    `thesis_title` TEXT,
    `phd_award_date` VARCHAR(100),
    `phd_institute` VARCHAR(150),
    `phd_publications` TEXT,
    `other_publications` TEXT,
    `status` VARCHAR(20) DEFAULT 'Pending',
    `score_points` INT DEFAULT 0,
    `dean_remarks` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `supervisor_publications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `application_id` INT NOT NULL,
    `paper_title` VARCHAR(255) NOT NULL,
    `authors` VARCHAR(255),
    `corresponding_author` VARCHAR(255),
    `journal_title` VARCHAR(255),
    `doi` VARCHAR(100),
    `paper_index` VARCHAR(100),
    `h_index` INT,
    `quartile` VARCHAR(20),
    `impact_factor` VARCHAR(50),
    `submission_date` DATE,
    `revision_date` DATE,
    `acceptance_date` DATE,
    `scope_db_since` VARCHAR(100),
    `review_comments` TEXT,
    `apc_charges` VARCHAR(100),
    FOREIGN KEY (`application_id`) REFERENCES `supervisor_applications`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `admin_users` (
    `employee_id` INT PRIMARY KEY,
    `faculty_name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `is_temp_password` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Settings
INSERT INTO `settings` (`config_key`, `config_value`) VALUES 
('instName', 'Vignan\'s Foundation for Science, Technology & Research (VFSTR)'),
('instDomain', 'vignan.ac.in'),
('deanName', 'Dr. Rajesh K. Sharma'),
('deanEmail', 'dean.rd@vignan.ac.in'),
('adeanEmail', 'assistant.dean@vignan.ac.in'),
('signatoryRemarks', 'Dean, Research & Development'),
('ftLimit', '4'),
('ptLimit', '4'),
('minPublications', '5'),
('coGuideLimit', 'yes'),
('superannuationCheck', 'true'),
('capacityAlert', 'true'),
('backupSync', 'true'),
('backupPath', '/var/guideship/backups/')
ON DUPLICATE KEY UPDATE `config_value` = VALUES(`config_value`);

-- Seed Guides
INSERT INTO `guides` (`employee_id`, `guide_name`, `department`, `designation`, `in_service`, `remarks`, `ft_count`, `pt_count`, `awarded_count`, `allocated_date`) VALUES
(8912, 'Dr. Rajesh K. Sharma', 'Computer Science & Eng.', 'Professor', 'Yes', 'Guide for AI/ML projects', 3, 2, 0, '2024-03-12'),
(4325, 'Dr. Ananya Murthy', 'Electronics & Comm.', 'Associate Professor', 'Yes', 'Specialist in VLSI design', 3, 4, 1, '2023-08-19'),
(1198, 'Dr. George Verghese', 'Mechanical Engineering', 'Professor', 'No', 'Superannuated, guiding legacy scholars', 1, 0, 0, '2022-05-24'),
(7865, 'Dr. Priyadharshini R.', 'Information Technology', 'Assistant Professor', 'Yes', 'Newly recognized research guide', 0, 3, 0, '2025-01-15')
ON DUPLICATE KEY UPDATE `guide_name` = VALUES(`guide_name`);

-- Seed Guideship Admins
INSERT INTO `admin_users` (`employee_id`, `faculty_name`, `role`, `password_hash`) VALUES
(1001, 'Dr. Rajesh K. Sharma', 'Dean', '$2b$10$Cecyv8vFAwVaB.N4f1zrJ.WSTDciBLJbuY6pR6Hi1TT29NmGfOWOC'),
(1002, 'Dr. Amit S. Deshmukh', 'Assistant Dean', '$2b$10$l9LUm3bxbV1nRpL50q46MO0EugGykBN/FEU4W8mjSFe5G2eA5dce2')
ON DUPLICATE KEY UPDATE `faculty_name` = VALUES(`faculty_name`);


-- --------------------------------------------------------
-- 3. PROJECTPI PROPOSALS MANAGEMENT TABLES
-- --------------------------------------------------------

DROP TABLE IF EXISTS `copis`;
DROP TABLE IF EXISTS `proposals`;
DROP TABLE IF EXISTS `admins`;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `emp_code` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `temp_password_hash` VARCHAR(255) NULL,
  `temp_password_expires` DATETIME NULL,
  `requires_reset` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `proposals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `emp_code` VARCHAR(50) NOT NULL,
  `pi_name` VARCHAR(255) NOT NULL,
  `pi_phone` VARCHAR(20) NOT NULL,
  `title` TEXT NOT NULL,
  `tracking_number` VARCHAR(50) NOT NULL UNIQUE,
  `duration` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `industrial_collab` VARCHAR(10) NOT NULL,
  `industry_name` VARCHAR(255) NULL,
  `funding_type` VARCHAR(50) NOT NULL,
  `funding_agency` VARCHAR(50) NOT NULL,
  `project_scheme` VARCHAR(255) NOT NULL,
  `proposed_amount` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `sanction_order_number` VARCHAR(100) NULL,
  `sanctioned_amount` VARCHAR(50) NULL,
  `reviewed_by_expert` VARCHAR(10) NOT NULL DEFAULT 'No',
  `reviewer_name` VARCHAR(255) NULL,
  `reviewer_address` VARCHAR(255) NULL,
  `presentation_date` DATE NULL,
  `section_number` VARCHAR(100) NULL,
  `scientist_name` VARCHAR(255) NULL,
  `feedback_file_name` VARCHAR(255) NULL,
  `feedback_text` TEXT NULL,
  `pi_email` VARCHAR(255) NULL,
  `pi_department` VARCHAR(255) NULL,
  `submission_end_date` DATE NULL,
  `proof_file_name` VARCHAR(255) NULL,
  `proof_file_type` VARCHAR(100) NULL,
  `proof_file_path` VARCHAR(500) NULL,
  `proof_file_size` BIGINT NULL,
  `proof_file_data` LONGTEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `copis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `proposal_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`proposal_id`) REFERENCES `proposals`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed ProjectPi Admin (emp_code: ADMIN01, email: deanrd@vignan.ac.in, password: admin; emp_code: 1001, password: admin123)
INSERT INTO `admins` (`emp_code`, `email`, `password_hash`) VALUES
('ADMIN01', 'deanrd@vignan.ac.in', '$2a$10$tZ2E8bFj3wB.Xl29M6Uo9.dFhW7m8qS8H8A7Z3z3E6w6rB8g6tq1G'),
('1001', 'dean.rd@vignan.ac.in', '$2a$10$tZ2E8bFj3wB.Xl29M6Uo9.dFhW7m8qS8H8A7Z3z3E6w6rB8g6tq1G')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- Table: portal_login (Central Landing Portal Super Admin SSO)
CREATE TABLE IF NOT EXISTS `portal_login` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'super_admin',
  `temp_password_hash` VARCHAR(255) DEFAULT NULL,
  `temp_password_expires` DATETIME DEFAULT NULL,
  `requires_reset` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Central Super Admin (employee_id: 1001, password: 1234, email: 221fa23029@vignan.ac.in)
INSERT INTO `portal_login` (`employee_id`, `email`, `password_hash`, `role`)
VALUES ('1001', '221fa23029@vignan.ac.in', '$2a$10$w81.6m4rC55d14iEwQWzVO6n7eL5n1W2i9u64mUo5LzM/C2aU7gIe', 'super_admin')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- ============================================================================
-- PhD Full-Time Scholar Progress Tracking Tables
-- ============================================================================

-- 1. Master Scholar Profiles (Permanent static records)
CREATE TABLE IF NOT EXISTS `scholar_profiles` (
  `reg_no` VARCHAR(50) PRIMARY KEY,
  `scholar_name` VARCHAR(150) NOT NULL,
  `guide_name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(150) NOT NULL,
  `ra_type` ENUM('ERA', 'TRA', 'CAP') DEFAULT 'ERA',
  `bank_account_no` VARCHAR(50) DEFAULT '',
  `bank_name` VARCHAR(150) DEFAULT 'State Bank of India',
  `ifsc_code` VARCHAR(50) DEFAULT 'SBIN0001234',
  `date_of_joining` DATE NULL,
  `end_of_ra` DATE NULL,
  `scholar_contact` VARCHAR(30) DEFAULT '',
  `supervisor_contact` VARCHAR(30) DEFAULT '',
  `qualifying_degree` VARCHAR(20) DEFAULT NULL,
  `degree_percentage` VARCHAR(30) DEFAULT NULL,
  `degree_class` VARCHAR(100) DEFAULT NULL,
  `courses_completed` INT DEFAULT 4,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Monthly Tracking Submissions
CREATE TABLE IF NOT EXISTS `monthly_submissions` (
  `id` VARCHAR(60) PRIMARY KEY,
  `reg_no` VARCHAR(50) NOT NULL,
  `scholar_name` VARCHAR(150) NOT NULL,
  `guide_name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(150) NOT NULL,
  `ra_type` ENUM('ERA', 'TRA', 'CAP') DEFAULT 'ERA',
  `bank_account_no` VARCHAR(50) DEFAULT '',
  `bank_name` VARCHAR(150) DEFAULT 'State Bank of India',
  `ifsc_code` VARCHAR(50) DEFAULT 'SBIN0001234',
  `date_of_joining` DATE NULL,
  `end_of_ra` DATE NULL,
  `scholar_contact` VARCHAR(30) DEFAULT '',
  `supervisor_contact` VARCHAR(30) DEFAULT '',
  `qualifying_degree` VARCHAR(20) DEFAULT NULL,
  `degree_percentage` VARCHAR(30) DEFAULT NULL,
  `degree_class` VARCHAR(100) DEFAULT NULL,
  `current_month` VARCHAR(10) NOT NULL,
  `forget_thumbs` INT DEFAULT 0,
  `courses_completed` INT DEFAULT 0,
  `leaves_taken` INT DEFAULT 0,
  `avg_spent_stayed` VARCHAR(100) NOT NULL,
  `academic_load` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_scholar_month` (`reg_no`, `current_month`),
  FOREIGN KEY (`reg_no`) REFERENCES `scholar_profiles`(`reg_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Journal Papers
CREATE TABLE IF NOT EXISTS `journal_papers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `title` VARCHAR(300),
  `journal_name` VARCHAR(250) NOT NULL,
  `status` ENUM('Communicated', 'Received', 'Accepted', 'Under Review') DEFAULT 'Communicated',
  `status_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Conference Papers
CREATE TABLE IF NOT EXISTS `conference_papers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `title` VARCHAR(300),
  `conference_name` VARCHAR(250) NOT NULL,
  `status` ENUM('Communicated', 'Received', 'Accepted') DEFAULT 'Communicated',
  `status_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Faculty Development Programs (FDPs)
CREATE TABLE IF NOT EXISTS `fdps_attended` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `name` VARCHAR(250) NOT NULL,
  `organizer` VARCHAR(200),
  `category` VARCHAR(100) DEFAULT 'Workshop',
  `event_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Courses Completed Details (Grades, NPTEL/Internal, Formative/Summative)
CREATE TABLE IF NOT EXISTS `courses_completed_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `course_code` VARCHAR(50),
  `course_name` VARCHAR(250) NOT NULL,
  `course_type` VARCHAR(50) DEFAULT 'Internal',
  `credits` VARCHAR(20) DEFAULT '',
  `formative_marks` VARCHAR(20) DEFAULT '',
  `summative_marks` VARCHAR(20) DEFAULT '',
  `grade` VARCHAR(50) DEFAULT 'Completed',
  `cgpa` VARCHAR(20) DEFAULT '',
  `result` VARCHAR(20) DEFAULT '',
  `completion_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. DC Meetings Attended
CREATE TABLE IF NOT EXISTS `dc_meetings_attended` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `scholar_id` VARCHAR(50) NOT NULL,
  `dc_name` VARCHAR(150) NOT NULL,
  `last_dc_date` DATE NULL,
  `comments` TEXT,
  `regulation` VARCHAR(20) NOT NULL DEFAULT 'R22',
  `rating` VARCHAR(50) NOT NULL,
  `recommendations` VARCHAR(100) DEFAULT 'Pre-synopsis',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`submission_id`),
  INDEX (`scholar_id`),
  FOREIGN KEY (`submission_id`) REFERENCES `monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data: 229 PhD Full-Time Research Scholars Master Profiles
INSERT IGNORE INTO `scholar_profiles` (
  `reg_no`, `scholar_name`, `guide_name`, `department`, `ra_type`,
  `bank_account_no`, `bank_name`, `ifsc_code`, `date_of_joining`,
  `end_of_ra`, `scholar_contact`, `supervisor_contact`, `courses_completed`
) VALUES
  ('201FG08002', 'Mr. G. Sudharsan Reddy', 'Research Supervisor', 'MECH', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2020-12-02', '2023-12-01', '', '', 4),
  ('211FG01008', 'Ms. Inampudi Rashmika', 'Research Supervisor', 'BIOTECH.', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2021-10-18', '2025-10-17', '', '', 4),
  ('211FG01201', 'MS. MAHIMA BHARDWAJ', 'Research Supervisor', 'BIOTECH', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2022-03-09', '2025-03-08', '', '', 4),
  ('211FG05004', 'Mr. Tejeswara Kumar Mannem', 'Research Supervisor', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2021-10-28', '2024-10-27', '', '', 4),
  ('211FG05005', 'Mr. Shaik Deneyaz', 'Research Supervisor', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2021-10-30', '2024-10-29', '', '', 4),
  ('211FG06002', 'Ms. Vattem Sridivya', 'Research Supervisor', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2021-11-01', '2024-10-31', '', '', 4),
  ('211FG06003', 'Ms. Mangalapuri Sravani', 'Research Supervisor', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2021-10-21', '2024-10-20', '', '', 4),
  ('211FG06201', 'Mr. K. Arunyuvaraj', 'Research Supervisor', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-03-14', '2025-03-13', '', '', 4),
  ('211FG06202', 'Ms. Shaik Shakeera', 'Research Supervisor', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-04-21', '2025-04-20', '', '', 4),
  ('211FG06203', 'Ms. Peram Venkata Ramana', 'Research Supervisor', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-05-23', '2025-05-22', '', '', 4),
  ('211FG08202', 'Mr. M.E. Annadorai', 'Research Supervisor', 'MECH', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-03-29', '2025-03-28', '', '', 4),
  ('211FG12201', 'MS. KUMBHA ANJANA', 'Research Supervisor', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2022-03-14', '2025-03-13', '', '', 4),
  ('211FG30202', 'Mudda pati Nageswara Rao', 'B. Naveen Kumar Reddy', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-04-11', '2026-04-10', '9502451981', '', 4),
  ('211FG31002', 'Ravula Nagaraju', 'Prof. Koya Prabhakara Rao', 'Chemistry', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-04-01', '2026-03-31', '9652134840', '', 4),
  ('211FG31003', 'Mr. P. Perumal', 'Research Supervisor', 'CHEMISTRY', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2021-10-09', '2025-10-08', '', '', 4),
  ('211FG31005', 'Mr. B. Rohith Phaneendra', 'Research Supervisor', 'CHEMISTRY', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2021-11-17', '2025-11-16', '', '', 4),
  ('211FG32201', 'G. Sravani', 'Dr. G. Srinivasa Rao', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-03-15', '2026-03-14', '6301943756', '', 4),
  ('221FG01001', 'Mrs. Aswani Kuppala', 'Research Supervisor', 'BIOTECH.', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-10-14', '2026-10-13', '', '', 4),
  ('221FG01002', 'Mrs. HYNDHAVI LATHA KARUPARAPU', 'Prof. D. John Babu', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-10-11', '2026-10-10', '8500991029', '', 4),
  ('221FG01003', 'J. Rama koteswara Rao', 'Dr. A. Venkata Narayana', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-11-12', '2026-11-11', '9701700381', '', 4),
  ('221FG01004', 'Mr. Mathe Amaze', 'Research Supervisor', 'BIOTECH.', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-12-02', '2025-12-01', '', '', 4),
  ('221FG01006', 'Nalluri. Maneesha', 'Prof. T. C. Venkateswarulu', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-01-11', '2027-01-10', '7893519879', '', 4),
  ('221FG01007', 'Vemuluri Paramesawri', 'Dr S Asha', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-01-24', '2027-01-23', '9052171336', '', 4),
  ('221FG01008', 'Sadam Venkata Girish Kumar', 'Dr Katari Sudheer Kumar', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-01-25', '2027-01-24', '7893194578', '', 4),
  ('221FG01009', 'Mr. B. Tandava Krishna', 'Dr. A. VIJAYA SAI', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-02-09', '2027-02-08', '9154314067', '', 4),
  ('221FG02002', 'Ms. M K Raveena', 'Research Supervisor', 'CHEMICAL', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-11-21', '2025-11-20', '', '', 4),
  ('221FG02003', 'Mr.SOLOMAN GODWIN BABU N S', 'Research Supervisor', 'CHEMICAL', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-01-18', '2026-01-17', '', '', 4),
  ('221FG03001', 'Vaddala Suresh', 'Dr A.V.A. Bharat Kumar', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-08-01', '2025-07-31', '9100360353', '', 4),
  ('221FG03002', 'Mr. Praveen Kumar Pandey', 'Research Supervisor', 'CIVIL', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-12-21', '2025-12-20', '', '', 4),
  ('221FG03003', 'Ch. Manasa Reddy', 'Dr. A. Siva Sankar', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-01-04', '2026-01-03', '8367536348', '', 4),
  ('221FG03004', 'PINAPALA CHANIKYA', 'Dr. M. V. RAJU', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-03-06', '2026-03-05', '9597901379', '', 4),
  ('221FG03005', 'Nelapati Susmitha', 'Dr. P. Sundara Kumar', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-05-15', '2026-05-14', '8899739371', '', 4),
  ('221FG04008', 'Ms. U. Naga Nandini', 'Research Supervisor', 'ACSE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-01-02', '2026-01-01', '', '', 4),
  ('221FG05001', 'Mrs. Nagamani Thanuboddi', 'Research Supervisor', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-11-02', '2025-11-01', '', '', 4),
  ('221FG05003', 'Ms. Gurugubelli Visalakshi', 'Research Supervisor', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-11-21', '2025-11-20', '', '', 4),
  ('221FG05004', 'Sk. Althaf', 'Dr. Sk. Jakeer Hussain', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-12-31', '2025-12-30', '7702936913', '', 4),
  ('221FG06002', 'Mr. Yerramala Jagadeesh', 'Research Supervisor', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-10-12', '2025-10-11', '', '', 4),
  ('221FG06004', 'Mr. Pathan Abdul Ishak', 'Research Supervisor', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-01-30', '2026-01-29', '', '', 4),
  ('221FG12001', 'Ms. Karuna Sindhuja Adapa', 'Research Supervisor', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2022-11-10', '2022-09-08', '', '', 4),
  ('221FG12003', 'Lakshmi Patibandla', 'Dr. K. Phani Kumar', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2022-12-01', '2025-11-30', '8686961595', '', 4),
  ('221FG12004', 'MR. JAGADISH TULIMELLLI', 'Research Supervisor', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2022-12-20', '2025-12-19', '', '', 4),
  ('221FG31001', 'J. Anjaneyulu', 'Dr. Ravi Kumar Kottalanka', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2022-10-10', '2026-10-09', '8790351550', '', 4),
  ('221FG31002', 'Anjitha V V', 'Dr. Chandrasekar Kuppan', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-01', '2026-10-13', '9747593216', '', 4),
  ('221FG31003', 'K. Naga Ashok', 'Dr. Anandarup Goswami', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-01-30', '2027-01-29', '9542672382', '', 4),
  ('221FG32001', 'Mr. Yalamanda Babu Gopisetty', 'Research Supervisor', 'Mathematics', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2022-10-27', '2025-10-26', '', '', 4),
  ('221FG33001', 'Aremanda Tushara', 'Dr. Baiju Krishnan', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2022-10-28', '2026-01-27', '8309255683', '', 4),
  ('221FG33003', 'Mr. Arshad C M', 'Research Supervisor', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-02-07', '2026-02-06', '', '', 4),
  ('221FG33004', 'Mr. Amjad Khan A', 'Research Supervisor', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-02-07', '2026-02-06', '', '', 4),
  ('231FG01001', 'Ms. Sk. Shaheda', 'Dr. N.S. Sampath Kumar', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-05-12', '2027-05-11', '9059608796', '', 4),
  ('231FG01002', 'Ampasani Chennaiah', 'Dr. K. Chandrashekar', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-05-30', '2027-05-29', '7702471262', '', 4),
  ('231FG01003', 'P. Bhuvaneswari', 'DR. Katari Sudheer Kumar', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-05-31', '2027-05-30', '7569394729', '', 4),
  ('231FG01005', 'Koduru Neeraja Sruthi', 'Prof. Vijaya Ramu Dirisala', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-08-10', '2027-08-09', '6303648408', '', 4),
  ('231FG01006', 'Mr. Ch. Hemantha Mani Kumar Chakravarthi', 'Research Supervisor', 'BIOTECH.', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-09-27', '2027-09-26', '', '', 4),
  ('231FG01007', 'Mrs. Ala.Khushala', 'Research Supervisor', 'BIOTECH.', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-10-10', '2027-10-09', '', '', 4),
  ('231FG01008', 'Ms. K. P. Sony Sigma', 'Research Supervisor', 'BIOTECH.', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-10-20', '2026-10-19', '', '', 4),
  ('231FG01009', 'P Vijayalakshmi', 'DR. D. Syam Babu', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-11-03', '2027-11-02', '8978787485', '', 4),
  ('231FG01011', 'Ms. A. Nikitha Priya', 'Dr. K. Vallayyachari', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-01-19', '2028-01-18', '8639891696', '', 4),
  ('231FG01012', 'Manaswini Narapusetty', 'Dr. A. Ranganadha Reddy', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-01-23', '2028-01-22', '9014193454', '', 4),
  ('231FG01013', 'Ms. Burra Suchika', 'Research Supervisor', 'BIOTECH.', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-01-27', '2028-01-26', '', '', 4),
  ('231FG018003', 'Mr. Jagarlamudi Nethra', 'Research Supervisor', 'Agriculture', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-10-05', '2026-10-04', '', '', 4),
  ('231FG03002', 'Shaik Bajamma', 'Dr. payel chaudhari', 'Civil', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-07-21', '2025-08-01', '8247442929', '', 4),
  ('231FG04002', 'Mr. Bathula Anil Babu', 'Research Supervisor', 'CSE', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-06-10', '2026-06-09', '', '', 4),
  ('231FG04004', 'Sunkara Anitha', 'Dr. E. Deepak Chowdary', 'CSE', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-08-08', '2026-08-07', '9505044559', '', 4),
  ('231FG04005', 'D. Tipura', 'Dr. SV. Phani Kumar', 'CSE', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-08-01', '2026-07-31', '8977267707', '', 4),
  ('231FG05001', 'Mr. Shaik Aktahar', 'Research Supervisor', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-08-01', '2026-07-31', '', '', 4),
  ('231FG05002', 'T. Rikhitha', 'Dr. Ashutosh Kumar Dikshit', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-11-08', '2026-11-07', '9502700307', '', 4),
  ('231FG05003', 'G. Chandana', 'Dr. P. Vijaya Lakshmi', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-02-12', '2027-02-11', '9121868364', '', 4),
  ('231FG06001', 'Kiran Sai Dasari', 'Dr. M. Subba Rao', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-08-12', '2026-08-11', '7981925605', '', 4),
  ('231FG06002', 'Anki Reddy Bade', 'Dr. N. Bharath Kumar', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-08-08', '2026-08-07', '9030634885', '', 4),
  ('231FG06003', 'Shaik Allabakshu', 'Dr. P.M. Venkatesh', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-10-10', '2026-10-09', '6304868299', '', 4),
  ('231FG08001', 'Bandela Rajasekhar', 'Dr Sk. Farooq', 'Mech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-08-17', '2026-08-16', '9494472104', '', 4),
  ('231FG12001', 'Ms. Karimunnissa Begum Shaik', 'Research Supervisor', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-05-05', '2026-05-04', '', '', 4),
  ('231FG12003', 'K. Pravallika', 'Dr. B. Srinivasa Rao', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-06-01', '2026-05-31', '6302240401', '', 4),
  ('231FG12004', 'Yogesh Vinayak Hadole', 'Dr. B. Madhusudhana Rao', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-05-29', '2026-05-28', '9405663811', '', 4),
  ('231FG12005', 'G. Ishwarya', 'Dr. B. M. Rao', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-08-04', '2026-08-03', '9640962887', '', 4),
  ('231FG12006', 'S. Ashok Kumar', 'Dr. Vijay Krishna', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-08-07', '2026-08-06', '8790656085', '', 4),
  ('231FG12007', 'Mr. Kwame godsway kisseih', 'Research Supervisor', 'MANAGEMENT', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-10-07', '2027-10-06', '', '', 4),
  ('231FG12008', 'Uddagiri Yojitha', 'Dr. P. Lakshmi Narayanamma', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-11-02', '2026-11-01', '9398523039', '', 4),
  ('231FG12009', 'B. Jhansi k.s. Nandini', 'Dr. A. Sai Manideep', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-02-01', '2027-01-31', '7989371610', '', 4),
  ('231FG18001', 'Joshua Vincent Donipati', 'Dr. T. Prabhakara Rao', 'AGE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-06-01', '2026-05-31', '8074752758', '', 4),
  ('231FG18002', 'M. Yousuf', 'Dr. G.Subba Rao', 'VIAT', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-10-09', '2026-10-08', '8790725687', '', 4),
  ('231FG18003', 'Mr. J. Nethra', 'Dr. M. Chandra Surya Rao', 'VIAT', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-08-01', '2026-07-31', '7337246377', '', 4),
  ('231FG18010', 'Ms. U. Anusha', 'Research Supervisor', 'AGRICULTURE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-01-05', '2027-01-04', '', '', 4),
  ('231FG30001', 'G. Viswarupachari', 'Dr. M. Ramanjaneyulu', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-05-03', '2027-05-02', '9642762111', '', 4),
  ('231FG31002', 'SHAIK RUKSANA', 'Dr. Shubhalakshmi Sengupta', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-10-17', '2027-10-16', '7793992248', '', 4),
  ('231FG32001', 'N. Venkata Prasanna', 'Dr. S. Vinoth', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-06-01', '2026-05-31', '8500318536', '', 4),
  ('231FG32002', 'B Vijay Purnima', 'Dr. M Chaitanya Priya', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-05-22', '2026-05-21', '9490998698', '', 4),
  ('231FG32003', 'NIMMAKANTI BUJJI', 'Dr. N. Seshagiri Rao', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-06-06', '2026-06-05', '9494020529', '', 4),
  ('231FG32004', 'S. Sathishkumar', 'Dr. S. Vinoth', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-07-31', '2027-07-30', '9585875242', '', 4),
  ('231FG32005', 'S. Girish Kumar', 'Dr. P. Kalpana', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-12-18', '2027-12-17', '9951545583', '', 4),
  ('231FG32006', 'Anitha jyothi. R', 'Dr. P. Sivaprasad', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-01-22', '2027-01-21', '9036655115', '', 4),
  ('231FG32007', 'Joshua Remlalliana', 'Dr. S. Parthiban', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-03-24', '2027-03-23', '9366257749', '', 4),
  ('231FG33002', 'Guduru Babu', 'Dr. G. Mohana Charyulu', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-02-07', '2027-02-06', '9014039859', '', 4),
  ('231FG33003', 'K. Vijaya Kumari', 'Dr. G. Nageswara Rao', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2023-08-01', '2026-07-31', '9121328012', '', 4),
  ('231FG36001', 'Komaragiri Krishna', 'Dr. M. Raghavendra', 'Pharmacy', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-12-29', '2027-12-28', '8247213001', '', 4),
  ('231FG36002', 'Lurdhu Mary.Kunduri', 'Dr. P. Naresh', 'Pharmacy', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-02-01', '2028-01-31', '9989249493', '', 4),
  ('241FG01001', 'Chaturya Paladugu', 'Dr. A. Ranga Rao', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-05-28', '2027-05-27', '9492479262', '', 4),
  ('241FG01002', 'Ms. Sania Aiman', 'Dr. Charles David', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-05-30', '2027-05-29', '8987906755', '', 4),
  ('241FG01003', 'Ms.K. Dhanusha', 'Prof. D. John Babu', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-09-30', '2027-09-29', '8977263629', '', 4),
  ('241FG01004', 'K.Ramalakshmi', 'Dr. R. Mamilla Charan Raja', 'BT', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-09', '2027-09-08', '9912743840', '', 4),
  ('241FG01005', 'KILARI.HARIKA', 'Dr. Jalaja. N', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-09-09', '2027-09-08', '9492479262', '', 4),
  ('241FG01006', 'Alla Yaswanth Naveen Kumar', 'Dr. K. Vallayyachari', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-09-18', '2027-09-17', '7981196728', '', 4),
  ('241FG04004', 'Swatha Koganti', 'Dr. D. Yakobu', 'CSE', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-01', '2027-07-31', '9491664577', '', 4),
  ('241FG04005', 'A. Hemalatha', 'Dr. Jyosthna Devi Bodapati', 'ACSE', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-04', '2027-09-03', '8790500801', '', 4),
  ('241FG05001', 'Mr. Akasam Sai Pavan', 'Research Supervisor', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-09-04', '2028-09-03', '', '', 4),
  ('241FG05002', 'V. Gopinadh', 'Dr. N V R Vikram G', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-09-23', '2028-09-22', '8074770890', '', 4),
  ('241FG05003', 'Bommaganti Keerthana', 'Dr. N. Usha Rani', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-11-02', '2027-11-01', '8978284772', '', 4),
  ('241FG05004', 'Ms. P. Hima Bindu', 'Dr. P. Sambaiah', 'ECE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-12-13', '2028-12-12', '9100664891', '', 4),
  ('241FG08001', 'P. Hima Bindu', 'Dr. MD. Faiyaz Ahmed', 'Mech', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-30', '2027-08-29', '9642967431', '', 4),
  ('241FG08002', 'Mr. Ch. V.S.R. Satya Prasad', 'Research Supervisor', 'MECHANICAL', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-12-06', '2027-12-05', '', '', 4),
  ('241FG12002', 'G. Haveela', 'Dr. Siva Sankar Mandal', 'Psychology', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-03-17', '2028-03-16', '7569757908', '', 4),
  ('241FG12003', 'Chikkala Meghana', 'Dr. B. Sivashankar Mandal', 'Psychology', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-03-17', '2028-03-16', '8179656508', '', 4),
  ('241FG12004', 'Bontha Harani', 'Dr. D. Rajya Lakshmi', 'Psychology', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-02-06', '2028-02-05', '8341506256', '', 4),
  ('241FG15001', 'R. Prathiba', 'Dr. Syed Irshaan', 'Food Technology', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-31', '2027-08-30', '7904034392', '', 4),
  ('241FG15002', 'Agilandeshwari', 'Dr. S. Karthikeyan', 'Food Technology', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-10', '2027-09-09', '6383042701', '', 4),
  ('241FG18002', 'K. Tejasree', 'Dr. L. Geethanjali', 'VIAT', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-12-13', '2027-12-12', '7095028745', '', 4),
  ('241FG30001', 'D. Prasantha Valli', 'Dr. B. Nageswara Rao', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-05-08', '2027-05-07', '9866423496', '', 4),
  ('241FG30002', 'K. Siva Parvathi', 'Dr. L.N. Madhu Mohan M', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-08-28', '2027-08-27', '9346335381', '', 4),
  ('241FG30003', 'Ms. Bandlamudi HimBindu', 'Research Supervisor', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-09-13', '2027-09-12', '', '', 4),
  ('241FG31001', 'Mr. P. Ashok Kumar', 'Dr. Sudip Mandal', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-05-17', '2027-05-16', '9704300607', '', 4),
  ('241FG31002', 'Gokavarapu Alekhya', 'Dr. Chandrasekar Kuppan', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-07-22', '2028-07-21', '9676637679', '', 4),
  ('241FG31003', 'SK. Hussain Basha', 'Dr. V. Srinivasadesikan', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-08-29', '2027-08-28', '8977036374', '', 4),
  ('241FG31004', 'SETTI SRIDURGA', 'Dr. Ravi Kumar Kottalanka', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-12-12', '2027-12-11', '9100898217', '', 4),
  ('241FG32001', 'P. Siva Kumari', 'Dr. N. Seshagiri Rao', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-03-12', '2027-03-11', '8309058717', '', 4),
  ('241FG32002', 'B. Bharathi', 'Dr. P. Sudam Sekhar', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-05-23', '2027-05-22', '9908104714', '', 4),
  ('241FG32003', 'P. Sowjanya', 'Dr. U.V.Manoj Kumar', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-06-07', '2027-06-06', 'N/A', '', 4),
  ('241FG32004', 'M. Janaki', 'Dr. G. Srinivasa Rao', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-27', '2027-08-26', '9866363447', '', 4),
  ('241FG32005', 'T. Jyothi', 'Dr. N. Seshagiri Rao', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-23', '2027-08-22', '9000970345', '', 4),
  ('241FG32006', 'T. Nagamani', 'S. Hanumantha Rao', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-23', '2027-08-22', '8099950414', '', 4),
  ('241FG32007', 'Nageswara Rao Arudala', 'Dr. G. Srinivasa Rao', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-05', '2027-09-04', '9603229996', '', 4),
  ('241FG32008', 'Arkaprabha Majumdar', 'Dr. P. Sudam Sekhar', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-14', '2027-09-13', '9007400824', '', 4),
  ('241FG32009', 'S. Siva Kumar', 'Dr. P. Kalpana', 'Maths', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-18', '2027-09-17', '8985975008', '', 4),
  ('241FG33001', 'P. Ramya', 'Dr. K.V.B. Ravindra Babu', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-06-24', '2027-06-23', '8639042107', '', 4),
  ('241FG33002', 'M. Sahithi', 'Dr. Gowthami.P', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-06-13', '2027-06-12', '8712122134', '', 4),
  ('241FG33003', 'Mrs. Vijaya Kumari Komera', 'Research Supervisor', 'English', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2024-06-08', '2028-06-07', '', '', 4),
  ('241FG33004', 'D. Punnamma', 'Dr. Shakila Bhanu', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-27', '2027-08-26', '7093223935', '', 4),
  ('241FG33005', 'M. Thambi Rani', 'Dr. Shah Al Mamun Sarkar', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-09', '2027-09-08', '7416518126', '', 4),
  ('241FG33008', 'Ms. Kasimkota Kiranmai', 'Research Supervisor', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-18', '2027-09-17', '', '', 4),
  ('241FG33011', 'M. Vijaya', 'Dr. K.V.B. Ravindra Babu', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-02-18', '2028-02-17', '6304968328', '', 4),
  ('241FG33012', 'Ravuri Anil Kumar', 'Dr. Srinivasarao Kasarla', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-03-26', '2028-03-25', '8142233434', '', 4),
  ('241FG3308', 'K. Kiranmai', 'Dr. P. Vijaya Babu', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-01', '2027-07-31', '8341194375', '', 4),
  ('241FG35001', 'R. Naga Sirisha', 'Dr. N. Veeranjaneyulu', 'CA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-05-17', '2027-05-16', '9494852495', '', 4),
  ('241FG35002', 'Mr.A.Siva Rao', 'Research Supervisor', 'IT', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-01', '2027-07-31', '', '', 4),
  ('241FG36001', 'S. Ramya', 'Dr. Ch. Jithendra', 'Pharmacy', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-01', '2027-07-31', '8919731397', '', 4),
  ('241FG36003', 'Ms. Sunkara Ramya', 'Research Supervisor', 'Pharmacy', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-08-23', '2027-08-22', '', '', 4),
  ('251BG08001', 'RAKESH PALADUGU', 'Dr Sanjay Kumar Gupta', 'Mech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9177994914', '', 4),
  ('251BG08002', 'P. BHANU SANKAR REDDY', 'Dr. SANJAY KUMAR GUPTA', 'Mech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-07-10', '2029-07-09', '9963677904', '', 4),
  ('251BG08003', 'Vikash Kumar', 'DR. N Narayan Rao', 'Mech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '6206296381', '', 4),
  ('251BG08004', 'D Nabin Kumar', 'Dr Ajoy Kumar Nandy', 'Mech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-11-01', '2029-10-31', '9348556989', '', 4),
  ('251BG18001', 'Vangala Nagavardhan Reddy', 'Dr. Ayyanna D.S', 'AGE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9014691553', '', 4),
  ('251BG18002', 'Ilapuram Pravallika', 'Dr. Hadole Mahesh Vinayak', 'AGE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9652794187', '', 4),
  ('251BG37001', 'LAKSHMI RAVALI V', 'DR. JYOSTNA DEVI BODAPATI', 'ACSE', 'ERA', '1234567890', 'SBI', 'SBIN0001234', '2025-11-03', '2028-11-02', '9381279468', '9876543210', 4),
  ('251FG01001', 'J. Vineela', 'Dr. Sankaran krishnamoorthy', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-03-29', '2028-03-28', '9966651771', '', 4),
  ('251FG01002', 'Darshan Ramkunja', 'Dr. K. Srikanth', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-07', '2028-04-06', '8296720622', '', 4),
  ('251FG01003', 'Thushara P Das', 'Dr S Anil Kumar', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-07-08', '2028-07-07', '9846342281', '', 4),
  ('251FG01004', 'Ramadugu. Koteswara Rao', 'Dr. Md. Nazneen Bobby', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-07-08', '2028-07-07', '7093942631', '', 4),
  ('251FG01005', 'Frederic Agasi Felix Vincent', 'Dr. N. S. Sampath Kumar', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9787031285', '', 4),
  ('251FG01006', 'R. Prasamsa', 'DR. N. Anand Kumar', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9121560874', '', 4),
  ('251FG01202', 'K.P.V.S Ganesh Chari', 'Dr.T.C.Venkateswarlu', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9398698103', '', 4),
  ('251FG03001', 'P. Leela Krishna', 'Dr. P. Parthiban', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7816076036', '', 4),
  ('251FG03201', 'K. Sangeetha Rao', 'Dr. A. Siva Sankar', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '8885472307', '', 4),
  ('251FG03202', 'Manjari Blessing B.V.', 'Dr. P. Rakesh', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7867967818', '', 4),
  ('251FG03203', 'M. Hemanth', 'Dr. P. Sundara Kumar', 'Civil', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9346299591', '', 4),
  ('251FG04001', 'KOLLA JYOTSNA', 'Research Supervisor', 'CSE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-08', '2028-04-07', '', '', 4),
  ('251FG04002', 'SHAIK MAHABUB BASHA', 'Research Supervisor', 'ACSE', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-04-17', '2028-04-16', '', '', 4),
  ('251FG04003', 'TANIGUNDALA LEELAVATHY', 'Research Supervisor', 'CSE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-22', '2028-04-21', '', '', 4),
  ('251FG04004', 'VOGIRALA NANDINI', 'Research Supervisor', 'CSE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-05-05', '2028-05-04', '', '', 4),
  ('251FG05001', 'VADLA MAHESH', 'Dr. N. Nagendra Reddy', 'ECE', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9515098178', '', 4),
  ('251FG06001', 'D Ravitheja', 'Dr.S.Yuvaraja', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-05-15', '2028-05-14', '9494300490', '', 4),
  ('251FG06002', 'Fatalrahman', 'Dr.J.Srinivasa Rao', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '6309919872', '', 4),
  ('251FG06004', 'V. VIJAYA LAKSHMI', 'Dr. K. Bala Krishna', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9963106982', '', 4),
  ('251FG06201', 'Sk. Ehthe Shamul Hasan', 'Dr. M. Subba Rao', 'EEE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9492571644', '', 4),
  ('251FG08001', 'PALADUGU RAKESH', 'Research Supervisor', 'MECHANICAL', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-07-10', '2029-07-09', '', '', 4),
  ('251FG08002', 'P.BHANU SANKAR REDDY', 'Research Supervisor', 'MECHANICAL', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-07-10', '2029-07-09', '', '', 4),
  ('251FG08003', 'CHUNDURU PAVAN KUMAR', 'Dr. Y. JYOTHHI', 'Mech', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-07-10', '2028-07-09', '7780792553', '', 4),
  ('251FG08005', 'BANAVATH SUNIL KUMAR NAIK', 'Dr. D. SATYANARAYANA', 'Mech', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-07-10', '2028-07-09', '9912041058', '', 4),
  ('251FG08201', 'N. Avinash', 'Dr.M.Rama Krishna', 'Mech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '8328582992', '', 4),
  ('251FG12001', 'CHERUKURI SWARNA LATHA', 'Research Supervisor', 'MANAGEMENT', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-02', '2028-04-01', '', '', 4),
  ('251FG12002', 'BUDAGALA HARI KRISHNA', 'Research Supervisor', 'MANAGEMENT', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-11', '2028-04-10', '', '', 4),
  ('251FG12003', 'MUTYALU NAVULURU', 'Research Supervisor', 'MANAGEMENT', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-11', '2028-04-10', '', '', 4),
  ('251FG12004', 'LALISETTI GANESH', 'Research Supervisor', 'MANAGEMENT', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-16', '2028-04-15', '', '', 4),
  ('251FG12008', 'Poranki Jayasri', 'Dr. M. SALOMI', 'Psychology', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '6300081682', '', 4),
  ('251FG12009', 'KONDURU NAGA SAITEJA', 'Dr. PREETI THAKUR', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9849686517', '', 4),
  ('251FG12201', 'Tongming.Y', 'Dr. K. Kalpana', 'MBA', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '6301085350', '', 4),
  ('251FG12203', 'V Naga Sruthi', 'Dr. T Subbarayudu', 'MBA', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2026-06-05', '2029-06-04', '7382706609', '', 4),
  ('251FG12204', 'M Bhuvaneswari', 'Dr. Ch Hymavathi', 'MBA', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2026-06-05', '2029-06-04', '8328197958', '', 4),
  ('251FG12205', 'Ch. Lakshmi Manogna', 'Dr. K Kalpana', 'MBA', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2026-06-10', '2029-06-09', '9182407668', '', 4),
  ('251FG15001', 'Shaik Sadhiq Hussain', 'Dr. Syed Irshaan', 'Food Technology', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7075746123', '', 4),
  ('251FG18001', 'Suneel Kumar Kondeti', 'Dr. Maddali Anusha', 'AGE', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9110747586', '', 4),
  ('251FG19001', 'L. Yasaswi', 'Dr. Shantappa', 'AHS', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9348919164', '', 4),
  ('251FG29001', 'Vedala Ararinda Rohini', 'Dr. Partha Sarathi Rakshit', 'Law', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-07-04', '2028-07-03', '9652524577', '', 4),
  ('251FG30002', 'Marpu Rohit Jayachandra', 'Prof Dr. J. N. Kiran', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9885035653', '', 4),
  ('251FG30003', 'KUPPA SRI LAKSHMI', 'Dr. HABIBUDDIN SHAIK', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7397426796', '', 4),
  ('251FG30201', 'T.Poojitha', 'Dr.T. Srinivasa Reddy', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7799467493', '', 4),
  ('251FG30202', 'K. Aruna Kumari', 'Dr. M.L.N. Madhu Mohan', 'Physics', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7569775818', '', 4),
  ('251FG31001', 'Dharani Kondru', 'Dharani.K', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-30', '2028-04-29', '', '', 4),
  ('251FG31002', 'Preetham.P', 'Dr. Shaik Anwar', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2023-10-17', '2027-10-16', '7702159977', '', 4),
  ('251FG31003', 'V. Nithin', 'Prof. Koya Prabhakara Rao', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-07-16', '2028-07-15', '7997600623', '', 4),
  ('251FG31004', 'Rigdha Sarkar', 'Dr. Anandarup Goswami', 'Chemistry', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9474455055', '', 4),
  ('251FG31005', 'SATTAM MANDAL', 'Dr. Shubhalakshmi Sengupta', 'Chemistry', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9749294379', '', 4),
  ('251FG31006', 'Mr. Sk. Sardar jani', 'Dr. Shaik Anwar', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-10-17', '2028-10-16', '9390082210', '', 4),
  ('251FG31007', 'Sayyad Moulali', 'Dr. T. Bharat Kumar', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9133827656', '', 4),
  ('251FG31008', 'Mr. P. Kishore', 'Dr. Y. S. L. V. Narayana', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7386304278', '', 4),
  ('251FG31201', 'Saipushpithachandana', 'Dr. Tejaswini', 'Chemistry', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '8106912929', '', 4),
  ('251FG31202', 'K Jayanthi', 'Dr. Sudip Mandal', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9701101078', '', 4),
  ('251FG31203', 'G . Yagna', 'Dr. Krishna Devi', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '6301207784', '', 4),
  ('251FG31204', 'P. Ajay Kumar', 'Dr. Kishore', 'Chemistry', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '8897021806', '', 4),
  ('251FG32001', 'A. Naga Durga', 'Dr. P. Sudam Sekhar', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '8978214089', '', 4),
  ('251FG32002', 'S. Triveni', 'Dr. Sumanjit Sarkar', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '8142521646', '', 4),
  ('251FG32003', 'V. Govinda Priya', 'Dr. Yookesh T. L', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-10-31', '2028-10-30', '9885673397', '', 4),
  ('251FG32004', 'B. Sri Satya Rajani', 'Dr. Sumanjit Sarkar', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-11-01', '2028-10-31', '8074605674', '', 4),
  ('251FG32201', 'P. Arif Jahan', 'Dr. M.V. Subba Rao', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7989882212', '', 4),
  ('251FG32202', 'N. Jayadeepika', 'Dr. S. Hanumanth Rao', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9052450138', '', 4),
  ('251FG32203', 'Pulivarthi VSN Lakshmi', 'Dr.Yokesh T. L', 'Maths', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7386390237', '', 4),
  ('251FG33001', 'G. Shilpa', 'Dr. U. Sri ranganath', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-05-01', '2028-04-30', '9182183951', '', 4),
  ('251FG33002', 'V.Lydia Vedam', 'Dr. Rahamat Shaik', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-05-05', '2028-05-04', '9492709729', '', 4),
  ('251FG33201', 'Nidhi. V. Gummadi', 'Dr. Reema Chakrabharti', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '8095443819', '', 4),
  ('251FG36001', 'Othuri S. V. Surya', 'Dr. M. Pratap', 'Pharmacy', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-07', '2028-04-06', '9381002176', '', 4),
  ('251FG36002', 'VISSARAPU NAGA LAKSHMI', 'Research Supervisor', 'Pharmacy', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-11', '2028-04-10', '', '', 4),
  ('251FG36004', 'SRAVAN KUMAR VAKA', 'Research Supervisor', 'Pharmacy', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-04-21', '2028-04-20', '', '', 4),
  ('251FG36005', 'Mr.Kuna Praveen', 'Research Supervisor', 'Pharmacy', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-09-16', '2028-09-15', '', '', 4),
  ('251FG36006', 'Varagani Srinivasa Rao', 'Dr. M. Sabareesh', 'Pharmacy', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9948399412', '', 4),
  ('251FG36007', 'Boyina Bhagyasri', 'Dr. S. Subramanyam', 'Pharmacy', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '7288050673', '', 4),
  ('251FG36201', 'G. Phani sekhar Reddy', 'Dr.S. K Abdul Rahaman', 'Phramaceutical Sciences', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2025-08-01', '2028-07-31', '9948678837', '', 4),
  ('251FG37001', 'PRATTI SRINIVASA RAO', 'Research Supervisor', 'AI&ML', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2025-05-24', '2028-05-23', '', '', 4),
  ('261FG01001', 'Y.Surya Prakash', 'Dr.Naravula Jalaja', 'Bio-Tech', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2026-08-01', '2029-07-31', '7305458283', '', 4),
  ('261FG12001', 'Ch. Sravani', 'Dr. P Lakshmi Narayanamma', 'MBA', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2026-08-01', '2029-07-31', '9010421069', '', 4),
  ('SCH_VSRAVANI', 'V.Sravani', 'Dr. P. Ashok Kumar', 'Chemical', 'ERA', '', 'State Bank of India', 'SBIN0001234', '2026-09-08', '2029-09-08', '8121602530', '', 4),
  ('VU24P1ENG-009', 'Ms. Runa Aktar Banu', 'Research Supervisor', 'English', 'TRA', '', 'State Bank of India', 'SBIN0001234', '2024-09-20', '2027-09-19', '', '', 4);

CREATE TABLE IF NOT EXISTS `user_email_otps` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `emp_id` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NULL,
  `mobile` VARCHAR(25) NULL,
  `portal` VARCHAR(50) NOT NULL,
  `otp_code` VARCHAR(10) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_emp_email_portal (`emp_id`, `email`, `portal`),
  INDEX idx_emp_mobile_portal (`emp_id`, `mobile`, `portal`),
  INDEX idx_expires (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- PhD Part-Time Scholar Progress Tracking Tables
-- ============================================================================

-- 1. Master Part-Time Scholar Profiles
CREATE TABLE IF NOT EXISTS `part_time_scholar_profiles` (
  `reg_no` VARCHAR(50) PRIMARY KEY,
  `scholar_name` VARCHAR(150) NOT NULL,
  `guide_name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(150) NOT NULL,
  `ra_type` VARCHAR(50) DEFAULT 'Part Time',
  `bank_account_no` VARCHAR(50) DEFAULT '',
  `bank_name` VARCHAR(150) DEFAULT 'State Bank of India',
  `ifsc_code` VARCHAR(50) DEFAULT 'SBIN0001234',
  `date_of_joining` DATE NULL,
  `end_of_ra` DATE NULL,
  `scholar_contact` VARCHAR(30) DEFAULT '',
  `supervisor_contact` VARCHAR(30) DEFAULT '',
  `courses_completed` INT DEFAULT 4,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Part-Time Monthly Tracking Submissions
CREATE TABLE IF NOT EXISTS `part_time_monthly_submissions` (
  `id` VARCHAR(60) PRIMARY KEY,
  `reg_no` VARCHAR(50) NOT NULL,
  `scholar_name` VARCHAR(150) NOT NULL,
  `guide_name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(150) NOT NULL,
  `ra_type` VARCHAR(50) DEFAULT 'Part Time',
  `bank_account_no` VARCHAR(50) DEFAULT '',
  `bank_name` VARCHAR(150) DEFAULT 'State Bank of India',
  `ifsc_code` VARCHAR(50) DEFAULT 'SBIN0001234',
  `date_of_joining` DATE NULL,
  `end_of_ra` DATE NULL,
  `scholar_contact` VARCHAR(30) DEFAULT '',
  `supervisor_contact` VARCHAR(30) DEFAULT '',
  `current_month` VARCHAR(10) NOT NULL,
  `forget_thumbs` INT DEFAULT 0,
  `courses_completed` INT DEFAULT 0,
  `leaves_taken` INT DEFAULT 0,
  `avg_spent_stayed` VARCHAR(100) NOT NULL,
  `academic_load` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_pt_scholar_month` (`reg_no`, `current_month`),
  FOREIGN KEY (`reg_no`) REFERENCES `part_time_scholar_profiles`(`reg_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Part-Time Journal Papers
CREATE TABLE IF NOT EXISTS `part_time_journal_papers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `title` VARCHAR(300),
  `journal_name` VARCHAR(250) NOT NULL,
  `status` ENUM('Communicated', 'Received', 'Accepted', 'Under Review') DEFAULT 'Communicated',
  `status_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `part_time_monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Part-Time Conference Papers
CREATE TABLE IF NOT EXISTS `part_time_conference_papers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `title` VARCHAR(300),
  `conference_name` VARCHAR(250) NOT NULL,
  `status` ENUM('Communicated', 'Received', 'Accepted') DEFAULT 'Communicated',
  `status_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `part_time_monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Part-Time Faculty Development Programs (FDPs)
CREATE TABLE IF NOT EXISTS `part_time_fdps_attended` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `name` VARCHAR(250) NOT NULL,
  `organizer` VARCHAR(200),
  `category` VARCHAR(100) DEFAULT 'Workshop',
  `event_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `part_time_monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Part-Time Courses Completed Details
CREATE TABLE IF NOT EXISTS `part_time_courses_completed_details` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `course_code` VARCHAR(50),
  `course_name` VARCHAR(250) NOT NULL,
  `course_type` VARCHAR(50) DEFAULT 'Internal',
  `credits` VARCHAR(20) DEFAULT '',
  `formative_marks` VARCHAR(20) DEFAULT '',
  `summative_marks` VARCHAR(20) DEFAULT '',
  `grade` VARCHAR(50) DEFAULT 'Completed',
  `cgpa` VARCHAR(20) DEFAULT '',
  `result` VARCHAR(20) DEFAULT '',
  `completion_date` DATE NULL,
  FOREIGN KEY (`submission_id`) REFERENCES `part_time_monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Part-Time DC Meetings Attended
CREATE TABLE IF NOT EXISTS `part_time_dc_meetings_attended` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `submission_id` VARCHAR(60) NOT NULL,
  `scholar_id` VARCHAR(50) NOT NULL,
  `dc_name` VARCHAR(150) NOT NULL,
  `last_dc_date` DATE NULL,
  `comments` TEXT,
  `regulation` VARCHAR(20) NOT NULL DEFAULT 'R22',
  `rating` VARCHAR(50) NOT NULL,
  `recommendations` VARCHAR(100) DEFAULT 'Pre-synopsis',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (`submission_id`),
  INDEX (`scholar_id`),
  FOREIGN KEY (`submission_id`) REFERENCES `part_time_monthly_submissions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- Demo Data for Part-Time PhD Scholars Tracking
-- ----------------------------------------------------------------------------
INSERT INTO `part_time_scholar_profiles` (`reg_no`, `scholar_name`, `guide_name`, `department`, `ra_type`, `bank_account_no`, `bank_name`, `ifsc_code`, `date_of_joining`, `end_of_ra`, `scholar_contact`, `supervisor_contact`, `courses_completed`) VALUES
('251PT01001', 'Dr. / Mr. V. Ramesh Kumar', 'Dr. K. Phani Kumar', 'CSE', 'Industry', '50100438921102', 'State Bank of India', 'SBIN0001234', '2024-07-31', '2027-07-30', '9848012345', '9440154321', 4),
('241PT04005', 'Ms. K. Srilatha', 'Dr. Jyosthna Devi Bodapati', 'ACSE', 'Academic', '620458912345', 'State Bank of India', 'SBIN0001234', '2024-09-04', '2027-09-03', '9876543210', '9849123456', 3),
('231PT06012', 'Mr. P. Srinivasa Rao', 'Dr. N. Usha Rani', 'ECE', 'Industry', '301204589210', 'Union Bank of India', 'UBIN0530123', '2023-08-15', '2026-08-14', '9988776655', '9440234567', 4),
('251PT08003', 'Mr. M. Venkat Reddy', 'Dr. Sanjay Kumar Gupta', 'Mechanical', 'Industry', '401204981234', 'State Bank of India', 'SBIN0001234', '2025-07-10', '2028-07-09', '9177994914', '9876543210', 2),
('241PT12002', 'Ms. Ch. Hymavathi Devi', 'Dr. K. Kalpana', 'MBA', 'Academic', '501234567890', 'State Bank of India', 'SBIN0001234', '2024-08-01', '2027-07-31', '9652794187', '9988112233', 4),
('251PT36001', 'Mr. B. Koteswara Rao', 'Dr. M. Sabareesh', 'Pharmacy', 'Industry', '50100438921105', 'State Bank of India', 'SBIN0001234', '2025-04-07', '2028-04-06', '9948399412', '9876501234', 3),
('231PT01004', 'Mrs. T. Lakshmi Prasanna', 'Dr. S. Anil Kumar', 'Bio-Tech', 'Academic', '30100438921109', 'State Bank of India', 'SBIN0001234', '2023-07-08', '2026-07-07', '9846342281', '9440556677', 4),
('241PT03001', 'Mr. G. Ravindra Babu', 'Dr. P. Sundara Kumar', 'Civil', 'Industry', '50100438921111', 'State Bank of India', 'SBIN0001234', '2024-08-01', '2027-07-31', '9346299591', '9848554433', 4)
ON DUPLICATE KEY UPDATE `scholar_name`=VALUES(`scholar_name`), `scholar_contact`=VALUES(`scholar_contact`);

INSERT INTO `part_time_monthly_submissions` (`id`, `reg_no`, `scholar_name`, `guide_name`, `department`, `ra_type`, `bank_account_no`, `bank_name`, `ifsc_code`, `date_of_joining`, `end_of_ra`, `scholar_contact`, `supervisor_contact`, `current_month`, `forget_thumbs`, `courses_completed`, `leaves_taken`, `avg_spent_stayed`, `academic_load`, `created_at`) VALUES
('pt_sub_251PT01001_2026_08', '251PT01001', 'Dr. / Mr. V. Ramesh Kumar', 'Dr. K. Phani Kumar', 'CSE', 'Industry', '50100438921102', 'State Bank of India', 'SBIN0001234', '2024-07-31', '2027-07-30', '9848012345', '9440154321', '2026-08', 0, 2, 0, '84 hrs (Part-time scheduled lab hours)', 'Research formulation, dataset collection & Literature Review on Graph Neural Networks', '2026-08-31 16:30:00'),
('pt_sub_241PT04005_2026_08', '241PT04005', 'Ms. K. Srilatha', 'Dr. Jyosthna Devi Bodapati', 'ACSE', 'Academic', '620458912345', 'State Bank of India', 'SBIN0001234', '2024-09-04', '2027-09-03', '9876543210', '9849123456', '2026-08', 0, 2, 1, '90 hrs', 'Algorithmic optimization and comparative model evaluation for multimodal transformer models', '2026-08-30 14:15:00'),
('pt_sub_231PT06012_2026_08', '231PT06012', 'Mr. P. Srinivasa Rao', 'Dr. N. Usha Rani', 'ECE', 'Industry', '301204589210', 'Union Bank of India', 'UBIN0530123', '2023-08-15', '2026-08-14', '9988776655', '9440234567', '2026-08', 0, 1, 0, '95 hrs', 'Drafting final synopsis, journal proofs submission and pre-thesis presentation preparation', '2026-08-28 11:00:00'),
('pt_sub_251PT08003_2026_07', '251PT08003', 'Mr. M. Venkat Reddy', 'Dr. Sanjay Kumar Gupta', 'Mechanical', 'Industry', '401204981234', 'State Bank of India', 'SBIN0001234', '2025-07-10', '2028-07-09', '9177994914', '9876543210', '2026-07', 1, 1, 0, '78 hrs', 'Finite Element Analysis on composite materials and specimen preparation in CAD/CAM laboratory', '2026-07-31 17:45:00'),
('pt_sub_241PT12002_2026_08', '241PT12002', 'Ms. Ch. Hymavathi Devi', 'Dr. K. Kalpana', 'MBA', 'Academic', '501234567890', 'State Bank of India', 'SBIN0001234', '2024-08-01', '2027-07-31', '9652794187', '9988112233', '2026-08', 0, 1, 0, '88 hrs', 'Empirical survey analysis of strategic organizational leadership in manufacturing MSMEs', '2026-08-29 15:20:00')
ON DUPLICATE KEY UPDATE `scholar_name`=VALUES(`scholar_name`);

INSERT INTO `part_time_courses_completed_details` (`submission_id`, `course_code`, `course_name`, `course_type`, `credits`, `formative_marks`, `summative_marks`, `grade`, `cgpa`, `result`, `completion_date`) VALUES
('pt_sub_251PT01001_2026_08', '22CS501', 'Research Methodology & IPR', 'Internal', '4', '38', '44', '82 (Pass)', '82', 'Pass', '2025-06-15'),
('pt_sub_251PT01001_2026_08', 'NOC25CS12', 'Deep Learning for Computer Vision', 'NPTEL', '3', '28', '42', '70 (Pass)', '70', 'Pass', '2026-05-20'),
('pt_sub_241PT04005_2026_08', '22CS502', 'Advanced Machine Learning', 'Internal', '4', '36', '46', '82 (Pass)', '82', 'Pass', '2025-05-18'),
('pt_sub_241PT04005_2026_08', 'NOC25CS44', 'Python for Data Science', 'NPTEL', '3', '26', '40', '66 (Pass)', '66', 'Pass', '2026-04-10'),
('pt_sub_231PT06012_2026_08', '22EC601', 'VLSI Signal Processing', 'Internal', '4', '37', '48', '85 (Pass)', '85', 'Pass', '2024-06-20'),
('pt_sub_251PT08003_2026_07', '25ME501', 'Advanced Finite Element Methods', 'Internal', '4', '34', '41', '75 (Pass)', '75', 'Pass', '2026-06-10'),
('pt_sub_241PT12002_2026_08', '24MB501', 'Quantitative Research Techniques in Management', 'Internal', '4', '35', '45', '80 (Pass)', '80', 'Pass', '2025-07-15');

INSERT INTO `part_time_journal_papers` (`submission_id`, `title`, `journal_name`, `status`, `status_date`) VALUES
('pt_sub_251PT01001_2026_08', 'A Comprehensive Survey on Edge AI in Smart Healthcare', 'IEEE Access', 'Accepted', '2026-08-15'),
('pt_sub_241PT04005_2026_08', 'Hybrid Transformer Architectures for Multimodal Fusion', 'Elsevier Knowledge-Based Systems', 'Under Review', '2026-08-05'),
('pt_sub_231PT06012_2026_08', 'Low Power High-Speed VLSI Architectures for DSP Applications', 'Springer Circuits, Systems, and Signal Processing', 'Accepted', '2026-07-25'),
('pt_sub_251PT08003_2026_07', 'Structural Analysis and Characterization of Hybrid Bio-composites', 'Springer Mechanics of Advanced Materials', 'Communicated', '2026-07-15');

INSERT INTO `part_time_conference_papers` (`submission_id`, `title`, `conference_name`, `status`, `status_date`) VALUES
('pt_sub_251PT01001_2026_08', 'Distributed Graph Representation Learning in Constrained Environments', 'IEEE INDICON 2026', 'Accepted', '2026-08-10'),
('pt_sub_231PT06012_2026_08', 'FPGA Prototyping of Reconfigurable Signal Processors', 'IEEE VLSI-DCS 2026', 'Accepted', '2026-06-15'),
('pt_sub_241PT12002_2026_08', 'Impact of Digital Transformation on Supply Chain Leadership', 'AIM International Conference 2026', 'Accepted', '2026-08-12');

INSERT INTO `part_time_fdps_attended` (`submission_id`, `name`, `organizer`, `category`, `event_date`) VALUES
('pt_sub_251PT01001_2026_08', 'Hands-on Workshop on Generative AI and Large Language Models', 'IIT Madras', 'Workshop', '2026-08-12'),
('pt_sub_241PT04005_2026_08', 'Advanced Deep Learning Seminar', 'NIT Warangal', 'Seminar', '2026-08-14'),
('pt_sub_251PT08003_2026_07', 'Composite Fabrication and Testing Symposium', 'VFSTR Mech Dept', 'Workshop', '2026-07-08'),
('pt_sub_241PT12002_2026_08', 'National Workshop on Qualitative Research & Structural Equation Modeling', 'IIM Bangalore', 'Workshop', '2026-08-05');

INSERT INTO `part_time_dc_meetings_attended` (`submission_id`, `scholar_id`, `dc_name`, `last_dc_date`, `comments`, `regulation`, `rating`, `recommendations`) VALUES
('pt_sub_251PT01001_2026_08', '251PT01001', '1', '2026-08-20', 'Coursework completed successfully. Research framework approved to proceed with experimental benchmarking.', 'R22', '10', 'In Progress'),
('pt_sub_241PT04005_2026_08', '241PT04005', '2', '2026-08-18', 'Significant experimental progress noted. Recommended to begin drafting pre-synopsis documentation.', 'R22', '11', 'Pre-synopsis'),
('pt_sub_231PT06012_2026_08', '231PT06012', '3', '2026-08-14', 'Doctoral Committee completed final review. Granted clearance for formal submission of synopsis.', 'R22', '12', 'Synopsis'),
('pt_sub_251PT08003_2026_07', '251PT08003', '1', '2026-07-22', 'Recommended adding tensile and impact test analysis before next review meeting.', 'R25', '9', 'In Progress'),
('pt_sub_241PT12002_2026_08', '241PT12002', '2', '2026-08-25', 'Statistical validation and hypothesis testing framework approved.', 'R22', '10', 'Pre-thesis colloquium');

SET FOREIGN_KEY_CHECKS = 1;




