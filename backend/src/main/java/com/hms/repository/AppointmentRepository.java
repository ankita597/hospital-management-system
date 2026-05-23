package com.hms.repository;

import com.hms.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Optional<Appointment> findByAppointmentId(String appointmentId);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByAppointmentDate(LocalDate date);
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
    long countByStatus(Appointment.Status status);
    long countByAppointmentDate(LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end")
    List<Appointment> findByDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);
}
