package com.hms.controller;

import com.hms.dto.DoctorDto;
import com.hms.entity.Doctor;
import com.hms.exception.ResourceNotFoundException;
import com.hms.repository.DoctorRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;

    @PostMapping
    public ResponseEntity<DoctorDto> create(@Valid @RequestBody DoctorDto dto) {
        Doctor doctor = new Doctor();
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setPhone(dto.getPhone());
        doctor.setEmail(dto.getEmail());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setAvailableDays(dto.getAvailableDays());
        doctor.setAvailableTime(dto.getAvailableTime());
        doctor.setActive(true);
        long count = doctorRepository.count() + 1;
        doctor.setDoctorId(String.format("HMS-D-%04d", count));
        Doctor saved = doctorRepository.save(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @GetMapping
    public ResponseEntity<Page<DoctorDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("firstName"));
        Page<Doctor> doctors = (search != null && !search.isBlank())
                ? doctorRepository.searchDoctors(search, pageable)
                : doctorRepository.findAll(pageable);
        return ResponseEntity.ok(doctors.map(this::toDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDto> getById(@PathVariable Long id) {
        Doctor d = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        return ResponseEntity.ok(toDto(d));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoctorDto> update(@PathVariable Long id, @RequestBody DoctorDto dto) {
        Doctor d = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        d.setFirstName(dto.getFirstName());
        d.setLastName(dto.getLastName());
        d.setSpecialization(dto.getSpecialization());
        d.setQualification(dto.getQualification());
        d.setPhone(dto.getPhone());
        d.setEmail(dto.getEmail());
        d.setExperienceYears(dto.getExperienceYears());
        d.setConsultationFee(dto.getConsultationFee());
        d.setAvailableDays(dto.getAvailableDays());
        d.setAvailableTime(dto.getAvailableTime());
        return ResponseEntity.ok(toDto(doctorRepository.save(d)));
    }

    private DoctorDto toDto(Doctor d) {
        DoctorDto dto = new DoctorDto();
        dto.setId(d.getId());
        dto.setDoctorId(d.getDoctorId());
        dto.setFirstName(d.getFirstName());
        dto.setLastName(d.getLastName());
        dto.setSpecialization(d.getSpecialization());
        dto.setQualification(d.getQualification());
        dto.setPhone(d.getPhone());
        dto.setEmail(d.getEmail());
        dto.setExperienceYears(d.getExperienceYears());
        dto.setConsultationFee(d.getConsultationFee());
        dto.setAvailableDays(d.getAvailableDays());
        dto.setAvailableTime(d.getAvailableTime());
        dto.setActive(d.isActive());
        return dto;
    }
}