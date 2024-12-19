package com.example.jeeproject.sec;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.jeeproject.sec.filters.JwtAuthenticationFilter;
import com.example.jeeproject.sec.filters.JwtAuthorisationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final String SECRET_KEY = "mysecrter123"; // Utilisez la même clé secrète

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(authenticationManager);
        jwtAuthenticationFilter.setFilterProcessesUrl("/login");

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/oauth2/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/user").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/userupdate").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**","/email").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

                            Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);

                            // Créer l'access token
                            String jwtAccessToken = JWT.create()
                                    .withSubject(oauth2User.getAttribute("email"))
                                    .withExpiresAt(new Date(System.currentTimeMillis() + 3*24*60*60*1000))
                                    .withIssuer(request.getRequestURL().toString())
                                    .withClaim("roles", List.of("USER"))
                                    .sign(algorithm);

                            // Créer le refresh token
                            String jwtRefreshToken = JWT.create()
                                    .withSubject(oauth2User.getAttribute("email"))
                                    .withExpiresAt(new Date(System.currentTimeMillis() + 15*60*1000))
                                    .withIssuer(request.getRequestURL().toString())
                                    .sign(algorithm);

                            // Créer l'URL de redirection avec les tokens et informations utilisateur
                            String frontendUrl = "http://localhost:3000/bonjour"; // Changez selon votre URL frontend
                            String redirectUrl = String.format("%s?access_token=%s&refresh_token=%s&email=%s&name=%s&picture=%s",
                                    frontendUrl,
                                    URLEncoder.encode(jwtAccessToken, StandardCharsets.UTF_8),
                                    URLEncoder.encode(jwtRefreshToken, StandardCharsets.UTF_8),
                                    URLEncoder.encode(oauth2User.getAttribute("email"), StandardCharsets.UTF_8),
                                    URLEncoder.encode(oauth2User.getAttribute("name"), StandardCharsets.UTF_8),
                                    URLEncoder.encode(oauth2User.getAttribute("picture"), StandardCharsets.UTF_8)
                            );

                            // Rediriger vers le frontend
                            response.sendRedirect(redirectUrl);
                        })
                        .failureHandler((request, response, exception) -> {
                            // Rediriger vers la page de login en cas d'échec avec un message d'erreur
                            String frontendLoginUrl = "http://localhost:3000/login?error=authentication_failed";
                            response.sendRedirect(frontendLoginUrl);
                        })
                )
                .addFilter(jwtAuthenticationFilter)
                .addFilterBefore(new JwtAuthorisationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // Frontend React
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Méthodes autorisées
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With")); // En-têtes autorisés
        configuration.setAllowCredentials(true); // Si vous avez besoin de gérer les cookies
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Appliquer à toutes les URL
        return source;
    }
}