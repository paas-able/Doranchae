package com.doran.chat.global.jwt

import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor
import java.util.*

class JwtHandshakeInterceptor(
    private val jwtTokenProvider: JwtTokenProvider
) : HandshakeInterceptor {

    //채팅 웹소켓 연결 시 핸드쉐이크에만 jwt 확인
    override fun beforeHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        attributes: MutableMap<String, Any>
    ): Boolean {
        val httpServletRequest = (request as? org.springframework.http.server.ServletServerHttpRequest)?.servletRequest
        val token = jwtTokenProvider.resolveToken(httpServletRequest?.getHeader("Authorization"))

        if (token != null) {
            val auth = jwtTokenProvider.getAuthentication(token)
            val userId = auth.principal as UUID
            attributes["userId"] = userId
            return true
        }
        return false
    }

    override fun afterHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        exception: Exception?
    ) {}
}
