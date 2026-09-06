package com.myanatomy.sandboxpro.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.myanatomy.sandboxpro.model.User;
import com.myanatomy.sandboxpro.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            String token = authHeader.substring(7);

            String email = jwtService.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                User user = userRepository.findByEmail(email)
                        .orElse(null);

                if (user != null &&
                        user.isEnabled() &&
                        jwtService.isTokenValid(token, user)) {

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    "ROLE_" + user.getRole().name()
                            );

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user.getEmail(),
                                    null,
                                    List.of(authority)
                            );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
            }

        } catch (Exception e) {

            System.out.println("========== JWT ERROR ==========");
            System.out.println(
                    "REQUEST = " +
                    request.getMethod() +
                    " " +
                    request.getRequestURI()
            );
            System.out.println(
                    "ERROR = " +
                    e.getClass().getName()
            );
            System.out.println(
                    "MESSAGE = " +
                    e.getMessage()
            );
            e.printStackTrace();
            System.out.println("================================");
        }

        filterChain.doFilter(request, response);
    }
}