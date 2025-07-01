package com.arthManager.email.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Arth - Email Verification Code");
        message.setText(
                "Your email verification code is: " + otp + "\n\n" +
                        "This code will expire in 10 minutes.\n\n" +
                        "If you didn't request this code, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Arth Team"
        );

        mailSender.send(message);
    }
}
