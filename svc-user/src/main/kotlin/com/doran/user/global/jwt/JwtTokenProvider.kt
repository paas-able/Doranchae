package com.doran.user.global.jwt

import com.doran.user.domain.UserService
import com.doran.user.global.auth.CustomUserDetails
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${JWT_SECRET:\${jwt.secret}}") private val secret: String,
    @Value("\${jwt.expiration-ms}") private val expirationTime: Long,
    private val userService: UserService 
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret))

    // 1. 토큰 생성
    fun generateToken(authentication: Authentication): String {
        val principal = authentication.principal as CustomUserDetails
        val now = Date()
        val expiryDate = Date(now.time + expirationTime)

        return Jwts.builder()
            .setSubject(principal.username)
            .claim("userId", principal.getUserId())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact()
    }

    // 2. 토큰에서 인증(Authentication) 정보 조회 (DB 조회 방식)
    fun getAuthentication(token: String): Authentication {
        val claims: Claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body

        val loginId = claims.subject
        val principal = userService.loadUserByUsername(loginId)
        return UsernamePasswordAuthenticationToken(principal, token, principal.authorities)
    }

    // 3. 토큰 유효성 검사
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