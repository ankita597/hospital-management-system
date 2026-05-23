package com.hms.dto;

import com.hms.entity.Appointment;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentDto {
    private Long id;
    private String appointmentId;

    @NotNull private Long patientId;
    @NotNull private Long doctorId;

    private String patientName;
    private String doctorName;
    private String specialization;

    @NotNull private LocalDate appointmentDate;
    @NotNull private LocalTime appointmentTime;

    private Appointment.Status status;
    private String reason;
    private String notes;
    private String prescription;
    private String diagnosis;
    private String createdAt;
}
