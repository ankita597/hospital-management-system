package com.hms.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardDto {
    private long totalPatients;
    private long totalDoctors;
    private long todayAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private BigDecimal totalRevenue;
    private BigDecimal pendingBills;
    private long totalBills;
}
