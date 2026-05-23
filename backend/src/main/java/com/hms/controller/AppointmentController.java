package com.hms.controller;

import com.hms.dto.AppointmentDto;
import com.hms.entity.Appointment;
import com.hms.service.impl.AppointmentServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentServiceImpl appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentDto> create(@Valid @RequestBody AppointmentDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createAppointment(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getById(id));
    }

    @GetMapping
    public ResponseEntity<Page<AppointmentDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(appointmentService.getAll(page, size));
    }

    @GetMapping("/today")
    public ResponseEntity<List<AppointmentDto>> getToday() {
        return ResponseEntity.ok(appointmentService.getTodayAppointments());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Appointment.Status status = Appointment.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(appointmentService.updateStatus(
                id, status, body.get("notes"), body.get("prescription"), body.get("diagnosis")));
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<String> cancel(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok("Appointment cancelled");
    }
}
