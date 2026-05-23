package com.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "doctors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String doctorId; // e.g., HMS-D-0001

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String specialization;
    private String qualification;
    private String phone;
    private String email;
    private Integer experienceYears;
    private String consultationFee;
    private String availableDays; // e.g., "MON,TUE,WED,THU,FRI"
    private String availableTime; // e.g., "09:00-17:00"
    private boolean active = true;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
