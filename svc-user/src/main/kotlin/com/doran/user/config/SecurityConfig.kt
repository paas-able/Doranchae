//package com.doran.user.config
//
//import org.springframework.context.annotation.Bean
//import org.springframework.context.annotation.Configuration
//import org.springframework.security.config.annotation.web.builders.HttpSecurity
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
//import org.springframework.security.config.http.SessionCreationPolicy
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
//import org.springframework.security.crypto.password.PasswordEncoder
//import org.springframework.security.web.SecurityFilterChain
//import org.springframework.web.cors.CorsConfiguration
//import org.springframework.web.cors.CorsConfigurationSource
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource
//
//@Configuration
//@EnableWebSecurity
//class SecurityConfig {
//    @Bean
//    fun passwordEncoder(): PasswordEncoder {
//        return BCryptPasswordEncoder()
//    }
//    @Bean
//    fun filterChain(http: HttpSecurity): SecurityFilterChain {
//        println(http.toString())
//        http.csrf { it.disable() }
//            .httpBasic { it.disable() }
//            .cors { it.configurationSource(corsConfigurationSource()) }
//            .authorizeHttpRequests {
//                it.requestMatchers("/**").permitAll()
//                it.anyRequest().permitAll()
//            }
//            .sessionManagement{}
//            .sessionManagement{SessionCreationPolicy.STATELESS}
//        return http.build()
//    }
//
//    @Bean
//    fun corsConfigurationSource(): CorsConfigurationSource {
//        val configuration = CorsConfiguration()
//        configuration.allowedOrigins = listOf("http://localhost:8080")
//        configuration.allowedMethods = listOf("POST", "GET", "DELETE", "PUT")
//        configuration.allowedHeaders = listOf("*")
//        val source = UrlBasedCorsConfigurationSource()
//        source.registerCorsConfiguration("/**", configuration)
//        return source
//    }
//}