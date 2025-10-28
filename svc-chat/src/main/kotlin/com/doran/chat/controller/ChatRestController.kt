package com.doran.chat.controller

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
import java.time.LocalDateTime
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
    fun getMessages(
        @RequestBody request: GetMessagesRequest,
        @PageableDefault(size = 20, sort = ["sentAt"], direction = Sort.Direction.DESC)
        pageable: Pageable
    ): ResponseEntity<DataResponse<MessageListResponse>> {

        val responseDto = chatService.getMessages(request.chatRoomId, request.userId, pageable)
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/list")
    fun getChatRoomList(@RequestBody request: GetUserChatRoomsRequest,
                        @PageableDefault(size = 10, sort = ["lastMessageAt"], direction = Sort.Direction.DESC)
                        pageable: Pageable): ResponseEntity<DataResponse<ChatRoomListResponse>> {
        val responseDto = chatService.getChatRoomList(request.userId, pageable)
        return ApiResponse.success(responseDto)
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
    val chatRoomId: UUID,
    val userId: UUID
)

data class GetUserChatRoomsRequest(
    val userId : UUID
)

data class PageInfo (
    var isFirst: Boolean,
    var isLast: Boolean,
    var currentPage: Int,
    var totalPages: Int
)

data class ChatRoomInfo (
    val id: UUID,
    val opponentId: UUID?
)

data class ChatRoomListResponse (
    val chatRooms: List<ChatRoomInfo>,
    val page: PageInfo
)

fun <T> createPageInfo(info: Page<T>): PageInfo {
    return PageInfo(isFirst = info.isFirst, isLast = info.isLast, currentPage = info.number, totalPages = info.totalPages)
}

data class MessageInfo (
    val id: UUID,
    val content: String,
    val sentAt: LocalDateTime,
    val isFromUser: Boolean
)

data class MessageListResponse (
    val messages: List<MessageInfo>,
    val page: PageInfo
)