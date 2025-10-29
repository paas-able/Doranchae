package com.doran.user.global.config

import com.doran.user.global.jwt.JwtAuthenticationFilter // JwtAuthenticationFilter 임포트
import com.doran.user.global.jwt.JwtTokenProvider // JwtTokenProvider 임포트
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig (
    private val jwtTokenProvider: JwtTokenProvider
) {
   @Bean
   fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
       http.csrf { it.disable() }
           .httpBasic { it.disable() }
           .cors { it.configurationSource(corsConfigurationSource()) }
           .formLogin { it.disable() }
           .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
           .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/user/join", "/api/user/login").permitAll() 
                    .anyRequest().authenticated() 
            }
            .addFilterBefore(
                JwtAuthenticationFilter(jwtTokenProvider),
                UsernamePasswordAuthenticationFilter::class.java
            )
       return http.build()
   }

   @Bean
   fun corsConfigurationSource(): CorsConfigurationSource {
       val configuration = CorsConfiguration()
       configuration.allowedOrigins = listOf("http://localhost:3000", "http://133.186.217.70/")
       configuration.allowedMethods = listOf("POST", "GET", "DELETE", "PUT")
       configuration.allowedHeaders = listOf("*")
       val source = UrlBasedCorsConfigurationSource()
       source.registerCorsConfiguration("/**", configuration)
       return source
   }

   @Bean
    fun authenticationManager(authenticationConfiguration: AuthenticationConfiguration): AuthenticationManager {
        return authenticationConfiguration.authenticationManager
    }
}