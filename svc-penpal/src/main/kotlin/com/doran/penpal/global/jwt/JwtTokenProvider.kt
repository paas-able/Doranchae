package com.doran.penpal.global.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${JWT_SECRET:\${jwt.secret}}") private val secret: String,
    @Value("\${jwt.expiration-ms}") private val expirationTime: Long,
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret))

    // 토큰에서 인증(Authentication) 정보 조회
    fun getAuthentication(token: String): Authentication {
        val claims: Claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body

        val loginId = claims.subject
        val userId = claims["userId"].toString()

        val principal: UserDetails = CustomUserDetails(
            userId = userId,
            username = loginId
        )

        return UsernamePasswordAuthenticationToken(principal, token, principal.authorities)
    }

    // 토큰 유효성 검사
    fun validateToken(token: String): Boolean {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token)
            return true
        } catch (ex: Exception) {
            // Log.error("Token validation failed: ${ex.message}")
            // (MalformedJwtException, ExpiredJwtException, UnsupportedJwtException, IllegalArgumentException 등)
            return false
        }
    }
}