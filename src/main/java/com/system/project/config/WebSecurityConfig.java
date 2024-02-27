package com.system.project.config;

import com.system.project.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {


    private final AuthenticationProvider daoAuthenticationProvider;
    private final JwtAuthenticationFilter jwtAuthFilter;


    //Private routes/resources. If the user is not authenticated it can access the routes from the requestMatchers
    //other routes are not accessible. csrf is disabled.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable().authorizeHttpRequests().requestMatchers("/user/**", "/bot/chat").permitAll().anyRequest()
                .authenticated().and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and().
                authenticationProvider(daoAuthenticationProvider).
                addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class).exceptionHandling().
                authenticationEntryPoint((request, response, authException) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"));
        return http.build();
    }




}
