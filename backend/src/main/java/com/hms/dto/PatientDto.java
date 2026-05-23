package com.hms.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientDto {

    private Long id;
    private String patientId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;

    @NotBlank(message = "Phone is required")
    private String phone;

    @Email(message = "Invalid email")
    private String email;

    private String address;
    private String emergencyContact;
    private String emergencyPhone;
    private String medicalHistory;
    private String allergies;
    private String createdAt;

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
