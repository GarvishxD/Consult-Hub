package consultation_manager.service;

import consultation_manager.dto.AuthResponse;
import consultation_manager.dto.LoginRequest;
import consultation_manager.dto.SignupRequest;
import consultation_manager.entity.Role;
import consultation_manager.entity.User;
import consultation_manager.exception.ResourceNotFoundException;
import consultation_manager.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);

        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (request.isAdminLogin() && user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("You do not have admin access");
        }

        return buildResponse(user);
    }

    public AuthResponse getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        return new AuthResponse(
                jwtService.generateToken(user.getId(), user.getEmail(), user.getRole()),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
