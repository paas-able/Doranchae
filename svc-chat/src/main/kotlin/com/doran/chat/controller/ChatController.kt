package com.doran.chat.controller

import com.doran.chat.repository.ChatRoomRepository
import com.doran.chat.service.ChatBotService
import com.doran.chat.service.ChatService
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrNull

@Controller
class ChatController(
    private val chatService: ChatService,
    private val messagingTemplate: SimpMessagingTemplate,
    private val chatBotService: ChatBotService,
    private val chatRoomRepository: ChatRoomRepository
) {

    private val CHATBOT_USER_ID = 0L
    @MessageMapping("/chat/send")
    fun sendMessage(@Payload message: ChatMessagesRequest) {
        val saved = chatService.saveMessage(message.chatRoomId, message.senderId, message.content, message.sendAt)
        messagingTemplate.convertAndSend("/topic/chat/room/${message.chatRoomId}", saved)

        val chatRoom = chatRoomRepository.findById(message.chatRoomId).getOrNull()

        if (chatRoom != null && CHATBOT_USER_ID in chatRoom.participantIds) {
            val botResponseContent = chatBotService.getChatbotResponse(message.content)
            val savedBotMessage = chatService.saveMessage(message.chatRoomId, CHATBOT_USER_ID, botResponseContent, LocalDateTime.now())
            messagingTemplate.convertAndSend("/topic/chat/room/${message.chatRoomId}", savedBotMessage)
        }
    }

    data class ChatMessagesRequest(
        val chatRoomId: Long,
        val senderId: Long,
        val content: String,
        val sendAt: LocalDateTime
    )

}