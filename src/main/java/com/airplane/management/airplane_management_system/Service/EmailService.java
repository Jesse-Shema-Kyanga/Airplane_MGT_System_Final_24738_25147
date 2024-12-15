package com.airplane.management.airplane_management_system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("To reset your password, click the following link: "
                + "http://localhost:5173/reset-password?token=" + token);
        mailSender.send(message);
    }

    public void sendTwoFactorCodeEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your 2FA Code");
        message.setText("Your 2FA code is: " + code);
        mailSender.send(message);
    }
}
