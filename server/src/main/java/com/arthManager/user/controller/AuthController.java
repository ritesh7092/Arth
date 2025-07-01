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
}
