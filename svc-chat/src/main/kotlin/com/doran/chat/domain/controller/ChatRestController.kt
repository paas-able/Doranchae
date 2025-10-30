package com.doran.chat.domain.controller

import com.doran.chat.domain.service.ChatService
import com.doran.chat.global.ApiResponse
import com.doran.chat.global.BaseResponse
import com.doran.chat.global.DataResponse
import com.doran.chat.dto.ChatDto.*
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.web.PageableDefault
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/chat")
class ChatRestController(
    private val chatService: ChatService
) {
    @PostMapping("/room")
    fun createChatRoom(@AuthenticationPrincipal userId: UUID,
                       @RequestBody request: CreateChatRoomRequest): ResponseEntity<DataResponse<UUID>> {
        val result = chatService.createChatRoom(userId, request.opponentId)
        return ApiResponse.success(result);
    }

    @GetMapping("/room/messages")
    fun getMessages(
        @AuthenticationPrincipal userId: UUID,
        @RequestBody request: GetMessagesRequest,
        @PageableDefault(size = 20, sort = ["sentAt"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<DataResponse<MessageListResponse>> {

        val responseDto = chatService.getMessages(request.chatRoomId, userId, pageable)
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/list")
    fun getChatRoomList(@AuthenticationPrincipal userId: UUID,
                        @PageableDefault(size = 10, sort = ["lastMessageAt"], direction = Sort.Direction.DESC)
                        pageable: Pageable): ResponseEntity<DataResponse<ChatRoomListResponse>> {
        val responseDto = chatService.getChatRoomList(userId, pageable)
        return ApiResponse.success(responseDto)
    }

    @PostMapping("/end")
    fun deleteChatRoom(@RequestBody request: GetMessagesRequest): ResponseEntity<BaseResponse> {
        chatService.endChatRoom(request.chatRoomId)
        return ApiResponse.successWithNoData()
    }

    @GetMapping("/bot")
    fun getChatBotRoom(@AuthenticationPrincipal userId: UUID ): ResponseEntity<DataResponse<UUID>> {
        val result = chatService.getChatBotRoom(userId)
        return ApiResponse.success(result);
    }
}