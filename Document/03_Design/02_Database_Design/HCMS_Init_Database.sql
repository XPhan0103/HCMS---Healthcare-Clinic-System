-- -----------------------------------------------------
-- Database schema for HCMS (Healthcare Clinic Management System)
-- DBMS: MySQL 8.0+
-- Storage Engine: InnoDB
-- Charset: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- -----------------------------------------------------

-- Create database if it doesn't exist and use it
CREATE DATABASE IF NOT EXISTS `hcms_db` 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `hcms_db`;

-- Set foreign key checks to 0 for initial setup to allow dropping/recreation in any order if needed
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Drop tables if they exist (for clean run)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `billings`;
DROP TABLE IF EXISTS `prescriptions`;
DROP TABLE IF EXISTS `visits`;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `patients`;

-- -----------------------------------------------------
-- Table: patients
-- -----------------------------------------------------
CREATE TABLE `patients` (
    `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `full_name`       VARCHAR(100) NOT NULL,
    `dob`             DATE NOT NULL,
    `parent_contact`  VARCHAR(100) NOT NULL,
    `address`         VARCHAR(500) NULL,
    `medical_history` TEXT NULL,
    
    `created_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`      TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table: appointments
-- -----------------------------------------------------
CREATE TABLE `appointments` (
    `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `patient_id`       BIGINT UNSIGNED NOT NULL,
    `doctor_id`        BIGINT UNSIGNED NOT NULL,
    `appointment_date` DATE NOT NULL,
    `time_slot`        VARCHAR(100) NOT NULL,
    `status`           ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    
    `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`       TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_appointments_patients` 
        FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_appointments_patient_id` ON `appointments`(`patient_id`);
CREATE INDEX `idx_appointments_appointment_date` ON `appointments`(`appointment_date`);
CREATE INDEX `idx_appointments_status` ON `appointments`(`status`);


-- -----------------------------------------------------
-- Table: visits
-- -----------------------------------------------------
CREATE TABLE `visits` (
    `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `patient_id`       BIGINT UNSIGNED NOT NULL,
    `appointment_id`   BIGINT UNSIGNED NULL, -- NULL allows for walk-ins
    `visit_date`       DATETIME NOT NULL,
    `symptoms`         VARCHAR(500) NOT NULL,
    `diagnosis`        TEXT NULL,
    `clinical_notes`   TEXT NULL,
    `status`           ENUM('IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS',
    
    `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`       TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_visits_patients` 
        FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_visits_appointments` 
        FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_visits_patient_id` ON `visits`(`patient_id`);
CREATE INDEX `idx_visits_appointment_id` ON `visits`(`appointment_id`);


-- -----------------------------------------------------
-- Table: prescriptions
-- -----------------------------------------------------
CREATE TABLE `prescriptions` (
    `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `visit_id`           BIGINT UNSIGNED NOT NULL,
    `medicine_name`      VARCHAR(100) NOT NULL,
    `dosage_instruction` VARCHAR(500) NOT NULL,
    `duration`           VARCHAR(100) NOT NULL,
    
    `created_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`         TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_prescriptions_visits` 
        FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_prescriptions_visit_id` ON `prescriptions`(`visit_id`);


-- -----------------------------------------------------
-- Table: billings
-- -----------------------------------------------------
CREATE TABLE `billings` (
    `id`               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `visit_id`         BIGINT UNSIGNED NOT NULL,
    `consultation_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_amount`     DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `payment_status`   ENUM('UNPAID', 'PAID') NOT NULL DEFAULT 'UNPAID',
    `billing_date`     DATETIME NOT NULL,
    
    `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at`       TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_billings_visit_id` (`visit_id`), -- Strictly Enforces 1-to-1 relationship
    CONSTRAINT `fk_billings_visits`
        FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) 
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_billings_visit_id` ON `billings`(`visit_id`);
CREATE INDEX `idx_billings_payment_status` ON `billings`(`payment_status`);

-- -----------------------------------------------------
-- Insert SAMPLE DATA
-- -----------------------------------------------------
-- Re-enable foreign key checks for transaction data safety
SET FOREIGN_KEY_CHECKS = 1;

START TRANSACTION;

-- 1. Insert Patient
INSERT INTO `patients` (`id`, `full_name`, `dob`, `parent_contact`, `medical_history`) 
VALUES (1, 'Be Nguyen C', '2020-05-15', '0912345678', 'Allergic to Lactose');

-- 2. Insert Appointments
INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `time_slot`, `status`) 
VALUES (1, 1, 99, '2026-06-15', '08:30', 'COMPLETED');

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `time_slot`, `status`) 
VALUES (2, 1, 99, '2026-06-14', '15:00', 'CANCELLED');

-- 3. Insert Visit
INSERT INTO `visits` (`id`, `patient_id`, `appointment_id`, `visit_date`, `symptoms`, `diagnosis`, `status`) 
VALUES (1, 1, 1, '2026-06-15 08:35:00', 'Stomach ache', 'Mild acute gastroenteritis', 'COMPLETED');

-- 4. Insert Prescriptions
INSERT INTO `prescriptions` (`visit_id`, `medicine_name`, `dosage_instruction`, `duration`) 
VALUES (1, 'Oresol 27.9g', 'Mix with 1L water', 'Use within 1 day');

INSERT INTO `prescriptions` (`visit_id`, `medicine_name`, `dosage_instruction`, `duration`) 
VALUES (1, 'Hapacol 150mg', '1 pack when temp > 38.5C', '3 days');

-- 5. Insert Billings
INSERT INTO `billings` (`visit_id`, `consultation_fee`, `total_amount`, `payment_status`, `billing_date`)
VALUES (1, 150000.00, 200000.00, 'UNPAID', '2026-06-15 08:50:00');

COMMIT;
