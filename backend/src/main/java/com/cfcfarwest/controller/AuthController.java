package com.cfcfarwest.controller;

import com.cfcfarwest.entity.Admin;
import com.cfcfarwest.repository.AdminRepository;
import com.cfcfarwest.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AdminRepository adminRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        return adminRepository.findByUsername(username)
            .filter(admin -> passwordEncoder.matches(password, admin.getPassword()))
            .map(admin -> {
                String token = jwtUtil.generateToken(admin.getUsername());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", admin.getUsername(),
                    "fullName", admin.getFullName()
                ));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    // One-time setup endpoint to create first admin (disable after use)
    @PostMapping("/setup")
    public ResponseEntity<?> setup(@RequestBody Map<String, String> body) {
        if (adminRepository.count() > 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Admin already exists"));
        }
        Admin admin = Admin.builder()
            .username(body.get("username"))
            .password(passwordEncoder.encode(body.get("password")))
            .fullName(body.get("fullName"))
            .email(body.get("email"))
            .build();
        adminRepository.save(admin);
        return ResponseEntity.ok(Map.of("message", "Admin created successfully"));
    }
}
