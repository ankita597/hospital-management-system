package com.hms.dto;

import com.hms.entity.User;
import jakarta.validation.constraints.*;
import lombok.*;

// ---- Auth DTOs ----
public class AuthDto {

    @Getter @Setter
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Getter @Setter @Builder
    public static class LoginResponse {
        private String token;
        private String username;
        private String fullName;
        private String role;
    }

    @Getter @Setter
    public static class RegisterRequest {
        @NotBlank private String username;
        @NotBlank @Size(min = 6) private String password;
        @NotBlank @Email private String email;
        @NotBlank private String fullName;
        private User.Role role;
    }
}
