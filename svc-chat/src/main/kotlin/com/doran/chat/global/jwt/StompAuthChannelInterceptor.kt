package com.doran.chat.global.jwt

import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.messaging.support.MessageHeaderAccessor
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class StompAuthChannelInterceptor(
    private val jwtTokenProvider: JwtTokenProvider
) : ChannelInterceptor {

    override fun preSend(message: Message<*>, channel: MessageChannel): Message<*>? {
        val accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor::class.java)
        if (accessor != null && StompCommand.CONNECT == accessor.command) {

            val authHeader = accessor.getFirstNativeHeader("Authorization")
            val token = jwtTokenProvider.resolveToken(authHeader)

            if (token != null) {
                try {
                    val authentication = jwtTokenProvider.getAuthentication(token)
                    val userId = authentication.principal as UUID

                    accessor.sessionAttributes?.put("userId", userId)
                    accessor.sessionAttributes?.put("user_jwt", token)

                    accessor.user = authentication

                } catch (e: Exception) {
                }
            }
        }
        return message
    }
}