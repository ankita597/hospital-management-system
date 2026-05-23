package com.hms.service.impl;

import com.hms.dto.AppointmentDto;
import com.hms.entity.*;
import com.hms.exception.*;
import com.hms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentDto createAppointment(AppointmentDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", dto.getPatientId()));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", dto.getDoctorId()));

        Appointment appointment = Appointment.builder()
                .appointmentId(generateAppointmentId())
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .appointmentTime(dto.getAppointmentTime())
                .status(Appointment.Status.SCHEDULED)
                .reason(dto.getReason())
                .notes(dto.getNotes())
                .build();

        return mapToDto(appointmentRepository.save(appointment));
    }

    public AppointmentDto getById(Long id) {
        return mapToDto(appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id)));
    }

    public List<AppointmentDto> getTodayAppointments() {
        return appointmentRepository.findByAppointmentDate(LocalDate.now())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public Page<AppointmentDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return appointmentRepository.findAll(pageable).map(this::mapToDto);
    }

    public AppointmentDto updateStatus(Long id, Appointment.Status status, String notes, String prescription, String diagnosis) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        appointment.setStatus(status);
        if (notes != null) appointment.setNotes(notes);
        if (prescription != null) appointment.setPrescription(prescription);
        if (diagnosis != null) appointment.setDiagnosis(diagnosis);
        return mapToDto(appointmentRepository.save(appointment));
    }

    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public long countByStatus(Appointment.Status status) {
        return appointmentRepository.countByStatus(status);
    }

    public long countToday() {
        return appointmentRepository.countByAppointmentDate(LocalDate.now());
    }

    private String generateAppointmentId() {
        long count = appointmentRepository.count() + 1;
        return String.format("HMS-A-%04d", count);
    }

    private AppointmentDto mapToDto(Appointment a) {
        return AppointmentDto.builder()
                .id(a.getId())
                .appointmentId(a.getAppointmentId())
                .patientId(a.getPatient().getId())
                .doctorId(a.getDoctor().getId())
                .patientName(a.getPatient().getFirstName() + " " + a.getPatient().getLastName())
                .doctorName("Dr. " + a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName())
                .specialization(a.getDoctor().getSpecialization())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .status(a.getStatus())
                .reason(a.getReason())
                .notes(a.getNotes())
                .prescription(a.getPrescription())
                .diagnosis(a.getDiagnosis())
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
                .build();
    }
}
