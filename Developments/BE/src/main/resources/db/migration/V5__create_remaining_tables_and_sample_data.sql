-- -----------------------------------------------------------------------------
-- V5: Create Remaining Tables (Appointments, Visits, Prescriptions, Billings)
-- Includes sample data for development and testing.
-- -----------------------------------------------------------------------------

-- =============================================================================
-- TABLE DEFINITIONS
-- =============================================================================

-- 1. Table: appointments
CREATE TABLE `appointments` (
    `id`               VARCHAR(36) NOT NULL,
    `patient_id`       VARCHAR(36) NOT NULL,
    `doctor_id`        VARCHAR(36) NOT NULL, -- Logical reference to users.id
    `appointment_date` DATE NOT NULL,
    `time_slot`        VARCHAR(100) NOT NULL,
    `status`           ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    
    -- Audit Columns
    `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by`       VARCHAR(100) NULL,
    `updated_by`       VARCHAR(100) NULL,
    `is_deleted`       BOOLEAN NOT NULL DEFAULT FALSE,
    `deleted_at`       TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_appointments_patients` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_appointments_users_doc` FOREIGN KEY (`doctor_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_appointments_patient_id` ON `appointments`(`patient_id`);
CREATE INDEX `idx_appointments_doctor_id` ON `appointments`(`doctor_id`);
CREATE INDEX `idx_appointments_date` ON `appointments`(`appointment_date`);
CREATE INDEX `idx_appointments_status` ON `appointments`(`status`);

-- 2. Table: visits
CREATE TABLE `visits` (
    `id`               VARCHAR(36) NOT NULL,
    `patient_id`       VARCHAR(36) NOT NULL,
    `appointment_id`   VARCHAR(36) NULL, -- Can be NULL for Walk-in bypassing appointment
    `visit_date`       DATETIME NOT NULL,
    `symptoms`         VARCHAR(500) NOT NULL,
    `diagnosis`        TEXT NULL,
    `clinical_notes`   TEXT NULL,
    `status`           ENUM('IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'IN_PROGRESS',
    
    -- Audit Columns
    `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by`       VARCHAR(100) NULL,
    `updated_by`       VARCHAR(100) NULL,
    `is_deleted`       BOOLEAN NOT NULL DEFAULT FALSE,
    `deleted_at`       TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_visits_patients` FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_visits_appointments` FOREIGN KEY (`appointment_id`) REFERENCES `appointments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_visits_patient_id` ON `visits`(`patient_id`);
CREATE INDEX `idx_visits_appointment_id` ON `visits`(`appointment_id`);

-- 3. Table: prescriptions
CREATE TABLE `prescriptions` (
    `id`                 VARCHAR(36) NOT NULL,
    `visit_id`           VARCHAR(36) NOT NULL,
    `medicine_name`      VARCHAR(100) NOT NULL,
    `dosage_instruction` VARCHAR(500) NOT NULL,
    `duration`           VARCHAR(100) NOT NULL,
    
    -- Audit Columns
    `created_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by`         VARCHAR(100) NULL,
    `updated_by`         VARCHAR(100) NULL,
    `is_deleted`         BOOLEAN NOT NULL DEFAULT FALSE,
    `deleted_at`         TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_prescriptions_visits` FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_prescriptions_visit_id` ON `prescriptions`(`visit_id`);

-- 4. Table: billings
CREATE TABLE `billings` (
    `id`               VARCHAR(36) NOT NULL,
    `visit_id`         VARCHAR(36) NOT NULL,
    `consultation_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `total_amount`     DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `payment_status`   ENUM('UNPAID', 'PAID') NOT NULL DEFAULT 'UNPAID',
    `billing_date`     DATETIME NOT NULL,
    
    -- Audit Columns
    `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_by`       VARCHAR(100) NULL,
    `updated_by`       VARCHAR(100) NULL,
    `is_deleted`       BOOLEAN NOT NULL DEFAULT FALSE,
    `deleted_at`       TIMESTAMP NULL DEFAULT NULL,
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_billings_visit_id` (`visit_id`), -- Strictly Enforces 1-to-1 relationship
    CONSTRAINT `fk_billings_visits` FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX `idx_billings_payment_status` ON `billings`(`payment_status`);


-- =============================================================================
-- SAMPLE DATA INSERTION (Seeding)
-- Note: password_hash uses '$2a$10$wYVW/L563/a5R70w7534UOkU5u2A9E5pL7L.5815R..1.6qE5qA1G' 
-- which is 'password123' hashed with BCrypt.
-- =============================================================================

-- Seed Users
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `role`, `status`) VALUES
('u1111111-1111-1111-1111-111111111111', 'admin', 'admin@hcms.clinic', '$2a$10$wYVW/L563/a5R70w7534UOkU5u2A9E5pL7L.5815R..1.6qE5qA1G', 'System Administrator', 'ADMIN', 'ACTIVE'),
('u2222222-2222-2222-2222-222222222222', 'dr.minh', 'minh.doctor@hcms.clinic', '$2a$10$wYVW/L563/a5R70w7534UOkU5u2A9E5pL7L.5815R..1.6qE5qA1G', 'BS. Minh', 'DOCTOR', 'ACTIVE'),
('u3333333-3333-3333-3333-333333333333', 'recep.lan', 'lan.rec@hcms.clinic', '$2a$10$wYVW/L563/a5R70w7534UOkU5u2A9E5pL7L.5815R..1.6qE5qA1G', 'Receptionist Lan', 'RECEPTIONIST', 'ACTIVE');

-- Seed Patients
INSERT INTO `patients` (`id`, `full_name`, `date_of_birth`, `gender`, `parent_phone_number`, `parent_email`, `address`, `height_cm`, `weight_kg`, `blood_type`, `allergies`, `chronic_conditions`, `vaccination_notes`) VALUES
('p1111111-1111-1111-1111-111111111111', 'Nguyen Bao An', '2019-05-12', 'MALE', '0909123456', 'parent1@gmail.com', '123 Le Loi, D1, HCMC', 110.5, 18.2, 'O', 'Penicillin', 'None', 'Completed 5-in-1'),
('p2222222-2222-2222-2222-222222222222', 'Tran Thi Binh', '2021-08-20', 'FEMALE', '0988765432', 'parent2@gmail.com', '456 Hai Ba Trung, D3, HCMC', 95.0, 14.5, 'A', 'None', 'Asthma', 'Pending Booster');

-- Seed Appointments
-- Pending Appointment (Future)
INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `time_slot`, `status`) VALUES
('a1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', '2026-06-01', '09:00', 'PENDING');

-- Completed Appointment (Past)
INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `appointment_date`, `time_slot`, `status`) VALUES
('a2222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', 'u2222222-2222-2222-2222-222222222222', '2026-04-20', '10:30', 'COMPLETED');

-- Seed Visits (Linked to the Completed Appointment)
INSERT INTO `visits` (`id`, `patient_id`, `appointment_id`, `visit_date`, `symptoms`, `diagnosis`, `clinical_notes`, `status`) VALUES
('v1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', '2026-04-20 10:35:00', 'High fever 39C, coughing', 'Acute Bronchitis', 'Patient looks tired, throat is red. Advised rest.', 'COMPLETED');

-- Seed Prescriptions
INSERT INTO `prescriptions` (`id`, `visit_id`, `medicine_name`, `dosage_instruction`, `duration`) VALUES
('pr111111-1111-1111-1111-111111111111', 'v1111111-1111-1111-1111-111111111111', 'Amoxicillin 250mg', '1 tablet after meal', '5 days'),
('pr222222-2222-2222-2222-222222222222', 'v1111111-1111-1111-1111-111111111111', 'Paracetamol 150mg', '1 sachet every 6h if fever > 38.5', '3 days');

-- Seed Billings (Unpaid)
INSERT INTO `billings` (`id`, `visit_id`, `consultation_fee`, `total_amount`, `payment_status`, `billing_date`) VALUES
('b1111111-1111-1111-1111-111111111111', 'v1111111-1111-1111-1111-111111111111', 150000.00, 225000.00, 'UNPAID', '2026-04-20 11:00:00');
