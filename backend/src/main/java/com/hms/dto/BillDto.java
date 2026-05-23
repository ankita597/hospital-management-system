package com.hms.dto;

import com.hms.entity.Bill;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BillDto {
    private Long id;
    private String billId;
    private Long patientId;
    private String patientName;
    private Long appointmentId;
    private String appointmentRef;
    private BigDecimal consultationFee;
    private BigDecimal medicineCost;
    private BigDecimal testCost;
    private BigDecimal otherCharges;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private Bill.PaymentStatus paymentStatus;
    private String paymentMethod;
    private String notes;
    private String createdAt;
    private String paidAt;
}
