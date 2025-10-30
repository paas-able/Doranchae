package com.doran.chat.domain.controller

import com.doran.chat.domain.repository.ChatRoomRepository
import com.doran.chat.domain.service.ChatBotService
import com.doran.chat.domain.service.ChatService
import org.springframework.beans.factory.annotation.Value
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Controller
import java.time.LocalDateTime
import java.util.*
import kotlin.jvm.optionals.getOrNull

@Controller
class ChatController(
    private val chatService: ChatService,
    private val messagingTemplate: SimpMessagingTemplate,
    private val chatBotService: ChatBotService,
    private val chatRoomRepository: ChatRoomRepository,
    @Value("\${chatbot.user-id}") chatbotUserId: String
) {

    private val CHATBOT_USER_ID: UUID = UUID.fromString(chatbotUserId)

    @MessageMapping("/chat/send")
    fun sendMessage(
        @Payload message: ChatMessagesRequest,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val userId = headerAccessor.sessionAttributes?.get("userId") as UUID

        val saved = chatService.saveMessage(
            message.chatRoomId,
            userId,
            message.content,
            LocalDateTime.now()
        )

        messagingTemplate.convertAndSend("/topic/chat/room/${message.chatRoomId}", saved)

        val chatRoom = chatRoomRepository.findById(message.chatRoomId).orElse(null)
        if (chatRoom != null && CHATBOT_USER_ID in chatRoom.participantIds) {
            val botResponseContent = chatBotService.getChatbotResponse(userId, message.content)

            val savedBotMessage = chatService.saveMessage(
                message.chatRoomId,
                CHATBOT_USER_ID,
                botResponseContent,
                LocalDateTime.now()
            )

            messagingTemplate.convertAndSend("/topic/chat/room/${message.chatRoomId}", savedBotMessage)
        }
    }

    data class ChatMessagesRequest(
        val chatRoomId: UUID,
        val content: String
    )
}