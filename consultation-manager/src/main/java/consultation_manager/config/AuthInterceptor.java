package consultation_manager.config;

import consultation_manager.entity.Role;
import consultation_manager.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtService jwtService;

    public AuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();

        if (path.startsWith("/api/auth")) {
            return true;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"message\":\"Please login to continue\"}");
            return false;
        }

        String token = header.substring(7);

        if (!jwtService.isValid(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"message\":\"Session expired, please login again\"}");
            return false;
        }

        Claims claims = jwtService.parseToken(token);
        request.setAttribute("userEmail", claims.getSubject());
        request.setAttribute("userRole", claims.get("role", String.class));

        if (path.startsWith("/api/admin")
                && !Role.ADMIN.name().equals(claims.get("role", String.class))) {

            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"message\":\"Admin access required\"}");
            return false;
        }

        return true;
    }
}
