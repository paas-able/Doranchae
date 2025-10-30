package com.doran.chat.global.jwt

import com.doran.chat.global.ErrorCode
import com.doran.chat.global.exception.CustomException
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value ("\${JWT_SECRET: \${jwt.secret}}") private val secret: String
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret))

    fun getAuthentication(token: String): Authentication {
        try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .body

            val userId = UUID.fromString(claims.subject)

            return UsernamePasswordAuthenticationToken(userId, null, emptyList())
        } catch (e: JwtException) {
            throw CustomException(ErrorCode.INVALID_TOKEN)
        } catch (e: IllegalArgumentException) {
            throw CustomException(ErrorCode.PARSE_ERROR)
        }
    }

    fun resolveToken(bearerToken: String?): String? {
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
        } else {
            null
        }
    }
}