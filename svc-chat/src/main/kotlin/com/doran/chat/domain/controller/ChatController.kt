package com.doran.chat.domain.controller

import com.doran.chat.domain.repository.ChatRoomRepository
import com.doran.chat.domain.service.ChatBotService
import com.doran.chat.domain.service.ChatService
import org.springframework.beans.factory.annotation.Value
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import java.time.LocalDateTime
import java.util.*

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

            val userJwt = headerAccessor.sessionAttributes?.get("user_jwt") as? String

            if (userJwt == null) {
                val errorMsg = chatService.saveMessage(
                    message.chatRoomId,
                    CHATBOT_USER_ID,
                    "오류: 사용자 인증 정보를 찾을 수 없어 봇 기능을 실행할 수 없습니다.",
                    LocalDateTime.now()
                )
                messagingTemplate.convertAndSend("/topic/chat/room/${message.chatRoomId}", errorMsg)
                return
            }

            val botResponseContent = chatBotService.getChatbotResponse(userId, message.content, userJwt)

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