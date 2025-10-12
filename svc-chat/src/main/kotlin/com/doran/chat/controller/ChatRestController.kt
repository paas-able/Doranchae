package com.doran.chat.controller

import com.doran.chat.service.ChatService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/chat")
class ChatRestController(
    private val chatService: ChatService
) {
    @PostMapping("/room")
    fun createChatRoom(@RequestParam userId1: Long, @RequestParam userId2: Long) =
        chatService.createChatRoom(userId1, userId2)

    @GetMapping("/room/{roomId}/messages")
    fun getMessages(@PathVariable roomId: Long) =
        chatService.getMessages(roomId)

    @PostMapping("/room/{roomId}/end")
    fun endChatRoom(@PathVariable roomId: Long) =
        chatService.endChatRoom(roomId)
}