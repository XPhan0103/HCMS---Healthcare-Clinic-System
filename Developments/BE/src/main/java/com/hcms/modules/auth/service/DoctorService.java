package com.hcms.modules.auth.service;

import com.hcms.modules.auth.dto.DoctorResponse;
import com.hcms.modules.booking.dto.AvailableSlot;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface DoctorService {

    List<DoctorResponse> listActiveDoctors();

    List<AvailableSlot> getDoctorAvailableSlots(UUID doctorId, LocalDate fromDate);
}
