package com.doran.chat.dto

import java.time.LocalDateTime
import java.util.*

class ChatDto {

    data class CreateChatRoomRequest(
        val opponentId: UUID
    )

    data class GetMessagesRequest(
        val chatRoomId: UUID,
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
}