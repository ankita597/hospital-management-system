package com.hms.repository;

import com.hms.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface BillRepository extends JpaRepository<Bill, Long> {
    Optional<Bill> findByBillId(String billId);
    List<Bill> findByPatientId(Long patientId);
    List<Bill> findByPaymentStatus(Bill.PaymentStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Bill b WHERE b.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Bill b WHERE b.paymentStatus = 'PENDING'")
    BigDecimal getTotalPending();
}
