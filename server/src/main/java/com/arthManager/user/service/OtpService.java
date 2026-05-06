package com.arthManager.user.service;

import com.arthManager.user.model.EmailOtp;
import com.arthManager.user.model.User;
import com.arthManager.user.repository.EmailOtpRepository;
import com.arthManager.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.arthManager.email.service.EmailService;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@AllArgsConstructor
public class OtpService {

    private static final String PURPOSE_REGISTRATION   = "REGISTRATION";
    private static final String PURPOSE_PASSWORD_RESET = "PASSWORD_RESET";

    private EmailOtpRepository emailOtpRepository;
    private UserRepository userRepository;
    private EmailService emailService;

    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    // ── Registration OTP ─────────────────────────────────────────────────────

    @Transactional
    public void generateAndSendOtp(String email) {
        String otp = generateOtp();
        EmailOtp emailOtp = new EmailOtp(email, otp, PURPOSE_REGISTRATION);

        emailOtpRepository.save(emailOtp);
        emailService.sendOtpEmail(email, otp);
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<EmailOtp> emailOtpOpt = emailOtpRepository
                .findByEmailAndOtpAndVerifiedFalseAndExpiresAtAfter(email, otp, LocalDateTime.now());

        if (emailOtpOpt.isPresent()) {
            EmailOtp emailOtp = emailOtpOpt.get();
            emailOtp.setVerified(true);
            emailOtpRepository.save(emailOtp);

            // Update user email verification status
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setEmailVerified(true);
                userRepository.save(user);
            }

            return true;
        }

        return false;
    }

    @Transactional
    public void resendOtp(String email) {
        // Check if there's a recent unverified OTP
        Optional<EmailOtp> recentOtpOpt = emailOtpRepository
                .findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(email);

        if (recentOtpOpt.isPresent()) {
            EmailOtp recentOtp = recentOtpOpt.get();
            if (recentOtp.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(1))) {
                throw new RuntimeException("Please wait before requesting a new OTP");
            }
        }

        generateAndSendOtp(email);
    }

    // ── Password-Reset OTP ───────────────────────────────────────────────────

    /**
     * Generates a PASSWORD_RESET OTP and sends it to the user's email.
     * Throws if the email is not registered.
     */
    @Transactional
    public void generateAndSendPasswordResetOtp(String email) {
        // Verify that the account actually exists before sending anything
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with that email address."));

        String otp = generateOtp();
        EmailOtp emailOtp = new EmailOtp(email, otp, PURPOSE_PASSWORD_RESET);

        emailOtpRepository.save(emailOtp);
        emailService.sendPasswordResetOtpEmail(email, otp);
    }

    /**
     * Verifies a PASSWORD_RESET OTP.
     * Returns true if valid, false otherwise.
     * Does NOT touch emailVerified — that flag is only for registration.
     */
    @Transactional
    public boolean verifyPasswordResetOtp(String email, String otp) {
        Optional<EmailOtp> emailOtpOpt = emailOtpRepository
                .findByEmailAndOtpAndPurposeAndVerifiedFalseAndExpiresAtAfter(
                        email, otp, PURPOSE_PASSWORD_RESET, LocalDateTime.now());

        if (emailOtpOpt.isPresent()) {
            EmailOtp emailOtp = emailOtpOpt.get();
            emailOtp.setVerified(true);
            emailOtpRepository.save(emailOtp);
            return true;
        }

        return false;
    }

    /**
     * Rate-limited resend of a PASSWORD_RESET OTP.
     */
    @Transactional
    public void resendPasswordResetOtp(String email) {
        Optional<EmailOtp> recentOtpOpt = emailOtpRepository
                .findTopByEmailAndPurposeAndVerifiedFalseOrderByCreatedAtDesc(email, PURPOSE_PASSWORD_RESET);

        if (recentOtpOpt.isPresent()) {
            EmailOtp recentOtp = recentOtpOpt.get();
            if (recentOtp.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(1))) {
                throw new RuntimeException("Please wait before requesting a new OTP");
            }
        }

        generateAndSendPasswordResetOtp(email);
    }
}