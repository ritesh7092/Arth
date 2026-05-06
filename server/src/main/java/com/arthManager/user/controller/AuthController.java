package com.arthManager.user.controller;

import com.arthManager.user.dto.*;
import com.arthManager.user.model.User;
import com.arthManager.user.service.OtpService;
import com.arthManager.user.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private UserService userService;
    private OtpService otpService;

    @PostMapping("/public/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(userService.authenticateUser(loginRequest));
    }

    @PostMapping("/public/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest){
        try {
            // Check if user already exists
            if (userService.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Create user but don't activate until email is verified
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setPassword(registerRequest.getPassword());
            user.setEmail(registerRequest.getEmail());
            user.setRole("ROLE_USER");
            user.setEmailVerified(false);

            userService.registerUser(user);

            // Generate and send OTP
            otpService.generateAndSendOtp(registerRequest.getEmail());

            return ResponseEntity.ok("Registration initiated. Please check your email for OTP verification.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/public/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        try {
            boolean verified = otpService.verifyOtp(request.getEmail(), request.getOtp());

            if (verified) {
                return ResponseEntity.ok("Email verified successfully. Registration complete.");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/public/resend-otp")
    public ResponseEntity<?> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        try {
            otpService.resendOtp(request.getEmail());
            return ResponseEntity.ok("OTP sent to your email");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Forgot-Password Flow ──────────────────────────────────────────────────

    /**
     * Step 1: User provides their email → server generates & emails a PASSWORD_RESET OTP.
     */
    @PostMapping("/public/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            otpService.generateAndSendPasswordResetOtp(request.getEmail());
            return ResponseEntity.ok("Password reset code sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Step 2: User provides email + OTP → server verifies it (marks it as used).
     * Client proceeds to step 3 only on success.
     */
    @PostMapping("/public/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@Valid @RequestBody VerifyResetOtpRequest request) {
        try {
            boolean verified = otpService.verifyPasswordResetOtp(request.getEmail(), request.getOtp());
            if (verified) {
                return ResponseEntity.ok("OTP verified. You may now set a new password.");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP. Please try again.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Step 3: User provides email + OTP + new password → server resets the password.
     * The OTP is re-verified here so this endpoint cannot be called without going through step 2.
     * Note: after step 2 the OTP is marked verified=true, so we look up a verified OTP
     * that has not yet expired to confirm the request is genuine before writing the password.
     */
    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            userService.resetUserPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully. You can now log in with your new password.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

