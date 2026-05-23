package com.hms.repository;

import com.hms.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorId(String doctorId);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByActiveTrue();
    long countByActiveTrue();

    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.firstName) LIKE LOWER(CONCAT('%',:s,'%')) OR " +
           "LOWER(d.lastName)  LIKE LOWER(CONCAT('%',:s,'%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%',:s,'%'))")
    Page<Doctor> searchDoctors(@Param("s") String search, Pageable pageable);
}
