package com.hms.controller;

import com.hms.dto.PatientDto;
import com.hms.service.impl.PatientServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientServiceImpl patientService;

    @PostMapping
    public ResponseEntity<PatientDto> create(@Valid @RequestBody PatientDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/pid/{patientId}")
    public ResponseEntity<PatientDto> getByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(patientService.getPatientByPatientId(patientId));
    }

    @GetMapping
    public ResponseEntity<Page<PatientDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(patientService.getAllPatients(page, size, search));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientDto> update(@PathVariable Long id, @Valid @RequestBody PatientDto dto) {
        return ResponseEntity.ok(patientService.updatePatient(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }
}
