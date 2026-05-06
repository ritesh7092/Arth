package com.arthManager.user.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "email_otp")
public class EmailOtp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean verified = false;

    /**
     * Discriminates between OTP purposes:
     * REGISTRATION  – used during sign-up email verification
     * PASSWORD_RESET – used during the forgot-password flow
     */
    @Column(nullable = false, length = 20)
    private String purpose = "REGISTRATION";

    // Constructor for registration OTPs (backward-compatible)
    public EmailOtp(String email, String otp) {
        this.email = email;
        this.otp = otp;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusMinutes(10); // 10 minutes expiry
        this.purpose = "REGISTRATION";
    }

    // Constructor for password-reset OTPs
    public EmailOtp(String email, String otp, String purpose) {
        this.email = email;
        this.otp = otp;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = LocalDateTime.now().plusMinutes(10); // 10 minutes expiry
        this.purpose = purpose;
    }

    public EmailOtp() {}
}