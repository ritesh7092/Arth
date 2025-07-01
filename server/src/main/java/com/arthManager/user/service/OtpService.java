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

    private EmailOtpRepository emailOtpRepository;
    private UserRepository userRepository;
    private EmailService emailService;

    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    @Transactional
    public void generateAndSendOtp(String email) {
        // Check if user already exists
//        if (userRepository.findByEmail(email).isPresent()) {
//            throw new RuntimeException("Email already registered");
//        }

        String otp = generateOtp();
        EmailOtp emailOtp = new EmailOtp(email, otp);

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
}