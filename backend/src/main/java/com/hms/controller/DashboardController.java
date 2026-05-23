package com.hms.controller;

import com.hms.dto.DashboardDto;
import com.hms.entity.Appointment;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardDto> getStats() {
        try {
            BigDecimal revenue = billRepository.getTotalRevenue();
            BigDecimal pending = billRepository.getTotalPending();
            return ResponseEntity.ok(DashboardDto.builder()
                    .totalPatients(patientRepository.count())
                    .totalDoctors(doctorRepository.countByActiveTrue())
                    .todayAppointments(appointmentRepository.countByAppointmentDate(LocalDate.now()))
                    .pendingAppointments(appointmentRepository.countByStatus(Appointment.Status.SCHEDULED))
                    .completedAppointments(appointmentRepository.countByStatus(Appointment.Status.COMPLETED))
                    .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                    .pendingBills(pending != null ? pending : BigDecimal.ZERO)
                    .totalBills(billRepository.count())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(DashboardDto.builder()
                    .totalPatients(0).totalDoctors(0).todayAppointments(0)
                    .pendingAppointments(0).completedAppointments(0)
                    .totalRevenue(BigDecimal.ZERO).pendingBills(BigDecimal.ZERO)
                    .totalBills(0).build());
        }
    }
}
