package com.doran.chat.controller

import com.doran.chat.domain.UserChat
import com.doran.chat.service.ChatService
import com.doran.chat.global.ApiResponse
import com.doran.chat.global.DataResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/chat")
class ChatRestController(
    private val chatService: ChatService
) {
    @PostMapping("/room")
    fun createChatRoom(@RequestBody request: CreateChatRoomRequest): ResponseEntity<DataResponse<Long>> {
        val result = chatService.createChatRoom(request.userId1, request.userId2)
        return ApiResponse.success(result);
    }

    @GetMapping("/room/messages")
    fun getMessages(@RequestBody request: GetMessagesRequest): ResponseEntity<DataResponse<List<UserChat>>> {
        return ApiResponse.success(chatService.getMessages(request.chatRoomId));
    }

//    @PostMapping("/room/{roomId}/end")
//    fun deleteChatRoom(@PathVariable roomId: Long) =
//        chatService.endChatRoom(roomId)
}

data class CreateChatRoomRequest(
    val userId1: Long,
    val userId2: Long
)

data class GetMessagesRequest(
    val chatRoomId: Long
)

