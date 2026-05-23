package com.hms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String billId; // e.g., HMS-B-0001

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    private BigDecimal consultationFee = BigDecimal.ZERO;
    private BigDecimal medicineCost = BigDecimal.ZERO;
    private BigDecimal testCost = BigDecimal.ZERO;
    private BigDecimal otherCharges = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String paymentMethod; // CASH, CARD, UPI, INSURANCE

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime paidAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        calculateTotal();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateTotal();
        if (paymentStatus == PaymentStatus.PAID && paidAt == null) {
            paidAt = LocalDateTime.now();
        }
    }

    private void calculateTotal() {
        totalAmount = consultationFee
                .add(medicineCost)
                .add(testCost)
                .add(otherCharges)
                .subtract(discount);
    }

    public enum PaymentStatus {
        PENDING, PAID, PARTIALLY_PAID, CANCELLED
    }
}
