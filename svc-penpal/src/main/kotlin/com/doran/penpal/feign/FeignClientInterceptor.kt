package com.doran.penpal.feign

import feign.RequestInterceptor
import feign.RequestTemplate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.core.context.SecurityContextHolder


@Configuration
class SecurityContextTransferConfig {

    companion object {
        private const val AUTHORIZATION_HEADER = "Authorization"
        private const val BEARER_TOKEN_TYPE = "Bearer"
    }

    @Bean
    fun feignRequestInterceptor(): RequestInterceptor {
        return RequestInterceptor { template: RequestTemplate ->
            val authentication = SecurityContextHolder.getContext().authentication
            if (authentication != null && authentication.credentials is String) {
                val token = authentication.credentials as String
                template.header(AUTHORIZATION_HEADER, "$BEARER_TOKEN_TYPE $token")
            }
        }
    }
}