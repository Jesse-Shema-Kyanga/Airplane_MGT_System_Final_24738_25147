package com.airplane.management.airplane_management_system.Service;

import com.airplane.management.airplane_management_system.Model.User;
import com.airplane.management.airplane_management_system.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int CODE_EXPIRY_MINUTES = 10;
    private Map<String, PasswordResetToken> passwordResetTokens = new HashMap<>();

    private static class PasswordResetToken {
        String token;
        LocalDateTime expiryDate;
        String userEmail;

        PasswordResetToken(String token, String userEmail) {
            this.token = token;
            this.userEmail = userEmail;
            this.expiryDate = LocalDateTime.now().plusHours(1); // Token valid for 1 hour
        }

        boolean isValid() {
            return LocalDateTime.now().isBefore(expiryDate);
        }
    }

    public String registerUser(User user) {
        System.out.println("Checking if user exists: " + user.getEmail());
        Optional<User> checkUser = userRepository.findByEmail(user.getEmail());
        if (checkUser.isPresent()) {
            System.out.println("User exists: " + user.getEmail());
            return "user exists";
        } else {
            userRepository.save(user);
            System.out.println("User saved successfully: " + user.getEmail());
            return "user saved successfully";
        }
    }

    public User authenticateUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            String twoFactorCode = generateTwoFactorCode();
            user.setTwoFactorCode(twoFactorCode);
            user.setTwoFactorCodeExpiry(LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES));
            userRepository.save(user);
            emailService.sendTwoFactorCodeEmail(user.getEmail(), twoFactorCode);
            return user;
        }
        return null;
    }

    private String generateTwoFactorCode() {
        int code = secureRandom.nextInt(900000) + 100000; // Generate a 6-digit code
        return String.valueOf(code);
    }

    public Map<String, String> verifyTwoFactorCode(String email, String code) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getTwoFactorCode().equals(code) && LocalDateTime.now().isBefore(user.getTwoFactorCodeExpiry())) {
                user.setTwoFactorCode(null); // Invalidate the code
                user.setTwoFactorCodeExpiry(null);
                userRepository.save(user);

                Map<String, String> response = new HashMap<>();
                response.put("message", "2FA verification successful!");
                response.put("role", user.getRole().toString()); // Return the user's role
                response.put("token", "generated-jwt-token"); // Replace with actual token generation logic
                return response;
            }
        }
        return null;
    }



    public String initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            String token = UUID.randomUUID().toString();
            passwordResetTokens.put(token, new PasswordResetToken(token, email));
            emailService.sendPasswordResetEmail(email, token);
            return "Password reset email sent";
        }
        return "Email not found";
    }

    public String resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokens.get(token);
        if (resetToken != null && resetToken.isValid()) {
            Optional<User> userOpt = userRepository.findByEmail(resetToken.userEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                user.setPassword(newPassword);
                userRepository.save(user);
                passwordResetTokens.remove(token);
                return "Password reset successful";
            }
        }
        return "Invalid or expired token";
    }
}
