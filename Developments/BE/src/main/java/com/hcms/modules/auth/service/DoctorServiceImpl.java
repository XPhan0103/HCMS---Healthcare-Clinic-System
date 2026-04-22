package com.hcms.modules.auth.service;

import com.hcms.common.exception.ResourceNotFoundException;
import com.hcms.modules.auth.dto.DoctorResponse;
import com.hcms.modules.auth.entity.User;
import com.hcms.modules.auth.mapper.DoctorMapper;
import com.hcms.modules.auth.repository.UserRepository;
import com.hcms.modules.booking.dto.AvailableSlot;
import com.hcms.modules.booking.entity.Appointment;
import com.hcms.modules.booking.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final UserRepository userRepository;
    private final DoctorMapper doctorMapper;
    private final AppointmentRepository appointmentRepository;

    @Override
    public List<DoctorResponse> listActiveDoctors() {
        return userRepository.findAllByRoleAndStatus(User.Role.DOCTOR, User.UserStatus.ACTIVE)
                .stream()
                .map(doctorMapper::toDoctorResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<AvailableSlot> getDoctorAvailableSlots(UUID doctorId, LocalDate fromDate) {
        log.info("Fetching available slots for doctor: {} on date: {}", doctorId, fromDate);

        // Verify doctor exists
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId.toString()));

        if (doctor.getRole() != User.Role.DOCTOR) {
            throw new IllegalArgumentException("User is not a doctor");
        }

        // Fetch all non-cancelled appointments for this date
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateAndStatusNot(
                doctorId, fromDate, Appointment.AppointmentStatus.CANCELLED);

        // Create a list of booked times to exclusion
        List<String> bookedTimes = bookedAppointments.stream()
                .map(Appointment::getTimeSlot)
                .collect(Collectors.toList());

        List<AvailableSlot> availableSlots = new ArrayList<>();
        
        // Hardcoded standard clinic hours: 08:00 to 17:00, 30-min slots
        String[] allPossibleSlots = {
            "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
        };

        for (String slot : allPossibleSlots) {
            if (!bookedTimes.contains(slot)) {
                availableSlots.add(AvailableSlot.builder()
                        .date(fromDate)
                        .timeSlot(slot)
                        .build());
            }
        }

        return availableSlots;
    }
}
