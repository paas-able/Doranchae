package com.doran.chat.controller

import com.doran.chat.domain.ChatRoom
import com.doran.chat.domain.UserChat
import com.doran.chat.service.ChatService
import com.doran.chat.global.ApiResponse
import com.doran.chat.global.BaseResponse
import com.doran.chat.global.DataResponse
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/chat")
class ChatRestController(
    private val chatService: ChatService
) {
    @PostMapping("/room")
    fun createChatRoom(@RequestBody request: CreateChatRoomRequest): ResponseEntity<DataResponse<UUID>> {
        val result = chatService.createChatRoom(request.userId1, request.userId2)
        return ApiResponse.success(result);
    }

    @GetMapping("/room/messages")
    fun getMessages(@RequestBody request: GetMessagesRequest): ResponseEntity<DataResponse<List<UserChat>>> {
        return ApiResponse.success(chatService.getMessages(request.chatRoomId));
    }
    @GetMapping("/list")
    fun getChatRoomList(@RequestBody request: GetUserChatRoomsRequest,
                        @PageableDefault(size = 10, sort = ["lastMessageAt"], direction = Sort.Direction.DESC)
                        pageable: Pageable): ResponseEntity<DataResponse<Page<ChatRoom>>> {
        return ApiResponse.success(chatService.getChatRoomList(request.userId, pageable))
    }

    @PostMapping("/end")
    fun deleteChatRoom(@RequestBody request: GetMessagesRequest): ResponseEntity<BaseResponse> {
        chatService.endChatRoom(request.chatRoomId)
        return ApiResponse.successWithNoData()
    }

}

data class CreateChatRoomRequest(
    val userId1: UUID,
    val userId2: UUID
)

data class GetMessagesRequest(
    val chatRoomId: UUID
)

data class GetUserChatRoomsRequest(
    val userId : UUID
)