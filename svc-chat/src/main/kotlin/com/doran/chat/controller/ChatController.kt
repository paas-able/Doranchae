package com.doran.chat.controller

import com.doran.chat.dto.ChatMessageDTO
import com.doran.chat.service.ChatService
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller

@Controller
class ChatController(
    private val chatService: ChatService,
    private val messagingTemplate: SimpMessagingTemplate
) {
    // WebSocket 메시지 처리
    @MessageMapping("/chat/send")
    fun sendMessage(@Payload message: ChatMessageDTO) {
        val saved = chatService.saveMessage(message)
        messagingTemplate.convertAndSend("/topic/chat/room/${message.chatRoomId}", saved)
    }
}