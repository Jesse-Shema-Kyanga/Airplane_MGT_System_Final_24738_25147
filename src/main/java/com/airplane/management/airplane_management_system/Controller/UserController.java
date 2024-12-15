package com.airplane.management.airplane_management_system.Controller;

import com.airplane.management.airplane_management_system.Model.User;
import com.airplane.management.airplane_management_system.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        String result = userService.registerUser(user);
        if ("user exists".equalsIgnoreCase(result)) {
            return new ResponseEntity<>("{\"message\": \"User exists\"}", HttpStatus.CONFLICT);
        } else {
            return new ResponseEntity<>("{\"message\": \"User saved successfully\"}", HttpStatus.OK);
        }
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User loginUser) {
        User authenticatedUser = userService.authenticateUser(loginUser.getEmail(), loginUser.getPassword());
        if (authenticatedUser != null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("role", authenticatedUser.getRole().toString());
            response.put("token", "generated-jwt-token"); // Replace with actual token generation logic
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Authentication failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String result = userService.initiatePasswordReset(email);

        Map<String, String> response = new HashMap<>();
        response.put("message", result);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");

        String result = userService.resetPassword(token, newPassword);

        Map<String, String> response = new HashMap<>();
        response.put("message", result);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<Map<String, String>> verifyTwoFactorCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        Map<String, String> result = userService.verifyTwoFactorCode(email, code);

        if (result != null) {
            return ResponseEntity.ok(result);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid or expired 2FA code");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


}
