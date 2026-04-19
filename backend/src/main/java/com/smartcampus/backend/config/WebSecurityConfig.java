package com.smartcampus.backend.config;

import com.smartcampus.backend.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final UserService userService;

    public WebSecurityConfig(UserService userService) {
        this.userService = userService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) 
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                // 1. මේ ලිපින ඕනෑම කෙනෙකුට විවෘතයි
                .requestMatchers("/", "/login**", "/error**", "/oauth2/**", "/api/auth/**", "/api/users/by-email", "/api/resources/**" , "/api/bookings/**").permitAll() 
                
                // 2. පරිශීලකයාට තමන්ගේ තොරතුරු බැලීමට
                .requestMatchers("/api/users/me").authenticated()
                
                // 3. Admin ලට පමණක් විවෘත ලිපින
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasRole("ADMIN") 
                
                .anyRequest().authenticated() 
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/api/auth/login")
                .successHandler((request, response, authentication) -> {
                    response.setStatus(200);
                })
                .failureHandler((request, response, exception) -> {
                    response.setStatus(401);
                })
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler((request, response, authentication) -> {
                    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                    String email = oAuth2User.getAttribute("email");
                    String name = oAuth2User.getAttribute("name");
                    String picture = oAuth2User.getAttribute("picture");
                    String providerId = oAuth2User.getAttribute("sub");

                    userService.processOAuthPostLogin(email, name, picture, providerId);
                    response.sendRedirect("http://localhost:5173/");
                })
            )
            .logout(logout -> logout
                .logoutUrl("/api/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(200);
                })
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
                .deleteCookies("remember-me")
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true); 
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}