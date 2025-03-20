package com.arthManager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.arthManager.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;

    // Constructor to inject UserService, which will be used for loading user details
    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }

    // SecurityFilterChain bean
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        // allow access to static resources
                        .requestMatchers("/css/**").permitAll()
                        .requestMatchers("/js/**", "/images/**").permitAll()
                        // allow access to register, login, terms and index without logging in
                        .requestMatchers("/register").permitAll()
                        .requestMatchers("/","/login","/terms", "/custom-error").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/")
                        // Redirects the user to the login page
                        .failureUrl("/login?error")
                        .permitAll()
                )
                .logout(logout -> logout.permitAll());

        return http.build();
    }


    // PasswordEncoder bean to encode passwords
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configure the AuthenticationManager to use our UserService and password encoder
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder());
        return auth.build();
    }
}
