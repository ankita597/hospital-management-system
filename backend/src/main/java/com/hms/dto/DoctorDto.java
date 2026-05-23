package com.hms.dto;

import com.hms.entity.Appointment;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorDto {
    private Long id;
    private String doctorId;
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank private String specialization;
    private String qualification;
    private String phone;
    @Email private String email;
    private Integer experienceYears;
    private String consultationFee;
    private String availableDays;
    private String availableTime;
    private boolean active;

    public String getFullName() {
        return "Dr. " + firstName + " " + lastName;
    }
}
