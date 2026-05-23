package com.hms.repository;

import com.hms.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientId(String patientId);
    Optional<Patient> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.lastName)  LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.patientId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.phone)     LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Patient> searchPatients(@Param("search") String search, Pageable pageable);

    long countByGender(String gender);
}
