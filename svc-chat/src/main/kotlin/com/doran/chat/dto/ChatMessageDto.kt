package com.doran.chat.dto

data class ChatMessageDTO(
    val chatRoomId: Long,
    val senderId: Long,
    val content: String
)
