package com.hms.service.impl;

import com.hms.dto.PatientDto;
import com.hms.entity.Patient;
import com.hms.exception.*;
import com.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl {

    private final PatientRepository patientRepository;

    public PatientDto createPatient(PatientDto dto) {
        if (dto.getEmail() != null && patientRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Patient with email already exists: " + dto.getEmail());
        }
        Patient patient = mapToEntity(dto);
        patient.setPatientId(generatePatientId());
        return mapToDto(patientRepository.save(patient));
    }

    public PatientDto getPatientById(Long id) {
        return mapToDto(patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id)));
    }

    public PatientDto getPatientByPatientId(String patientId) {
        return mapToDto(patientRepository.findByPatientId(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "patientId", patientId)));
    }

    public Page<PatientDto> getAllPatients(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Patient> patients = (search != null && !search.isBlank())
                ? patientRepository.searchPatients(search, pageable)
                : patientRepository.findAll(pageable);
        return patients.map(this::mapToDto);
    }

    public PatientDto updatePatient(Long id, PatientDto dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setGender(dto.getGender());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setEmergencyPhone(dto.getEmergencyPhone());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setAllergies(dto.getAllergies());
        return mapToDto(patientRepository.save(patient));
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient", "id", id);
        }
        patientRepository.deleteById(id);
    }

    public long countPatients() {
        return patientRepository.count();
    }

    private String generatePatientId() {
        long count = patientRepository.count() + 1;
        return String.format("HMS-P-%04d", count);
    }

    private PatientDto mapToDto(Patient p) {
        return PatientDto.builder()
                .id(p.getId())
                .patientId(p.getPatientId())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .dateOfBirth(p.getDateOfBirth())
                .gender(p.getGender())
                .bloodGroup(p.getBloodGroup())
                .phone(p.getPhone())
                .email(p.getEmail())
                .address(p.getAddress())
                .emergencyContact(p.getEmergencyContact())
                .emergencyPhone(p.getEmergencyPhone())
                .medicalHistory(p.getMedicalHistory())
                .allergies(p.getAllergies())
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null)
                .build();
    }

    private Patient mapToEntity(PatientDto dto) {
        return Patient.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .bloodGroup(dto.getBloodGroup())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .emergencyContact(dto.getEmergencyContact())
                .emergencyPhone(dto.getEmergencyPhone())
                .medicalHistory(dto.getMedicalHistory())
                .allergies(dto.getAllergies())
                .build();
    }
}
