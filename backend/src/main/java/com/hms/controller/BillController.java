package com.hms.controller;

import com.hms.dto.BillDto;
import com.hms.entity.Bill;
import com.hms.entity.Patient;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.BillRepository;
import com.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<List<BillDto>> getAll() {
        return ResponseEntity.ok(
            billRepository.findAll().stream().map(this::toDto).collect(Collectors.toList())
        );
    }

    @PostMapping
    public ResponseEntity<BillDto> create(@RequestBody BillDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", dto.getPatientId()));
        Bill bill = new Bill();
        bill.setBillId(String.format("HMS-B-%04d", billRepository.count() + 1));
        bill.setPatient(patient);
        bill.setConsultationFee(dto.getConsultationFee());
        bill.setMedicineCost(dto.getMedicineCost());
        bill.setTestCost(dto.getTestCost());
        bill.setOtherCharges(dto.getOtherCharges());
        bill.setDiscount(dto.getDiscount());
        bill.setPaymentStatus(Bill.PaymentStatus.PENDING);
        bill.setNotes(dto.getNotes());
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(billRepository.save(bill)));
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<BillDto> updatePayment(@PathVariable Long id, @RequestBody BillDto dto) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill", "id", id));
        bill.setPaymentStatus(dto.getPaymentStatus());
        bill.setPaymentMethod(dto.getPaymentMethod());
        return ResponseEntity.ok(toDto(billRepository.save(bill)));
    }

    private BillDto toDto(Bill b) {
        BillDto dto = new BillDto();
        dto.setId(b.getId());
        dto.setBillId(b.getBillId());
        dto.setPatientId(b.getPatient().getId());
        dto.setPatientName(b.getPatient().getFirstName() + " " + b.getPatient().getLastName());
        dto.setConsultationFee(b.getConsultationFee());
        dto.setMedicineCost(b.getMedicineCost());
        dto.setTestCost(b.getTestCost());
        dto.setOtherCharges(b.getOtherCharges());
        dto.setDiscount(b.getDiscount());
        dto.setTotalAmount(b.getTotalAmount());
        dto.setPaymentStatus(b.getPaymentStatus());
        dto.setPaymentMethod(b.getPaymentMethod());
        dto.setNotes(b.getNotes());
        dto.setCreatedAt(b.getCreatedAt() != null ? b.getCreatedAt().toString() : null);
        return dto;
    }
}