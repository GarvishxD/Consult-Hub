package consultation_manager.controller;

import consultation_manager.dto.AuthResponse;
import consultation_manager.dto.LoginRequest;
import consultation_manager.dto.SignupRequest;
import consultation_manager.service.AuthService;
import consultation_manager.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public AuthResponse me(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        Claims claims = jwtService.parseToken(token);

        return authService.getProfile(claims.getSubject());
    }
}
