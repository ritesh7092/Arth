package com.arthManager.user.repository;

import com.arthManager.user.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findByEmailAndOtpAndVerifiedFalseAndExpiresAtAfter(
            String email, String otp, LocalDateTime now);

    Optional<EmailOtp> findTopByEmailAndVerifiedFalseOrderByCreatedAtDesc(String email);

    void deleteByEmailAndVerifiedTrue(String email);

    void deleteByExpiresAtBefore(LocalDateTime now);
}