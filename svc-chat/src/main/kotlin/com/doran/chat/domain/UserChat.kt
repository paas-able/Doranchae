package com.doran.chat.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "user_chat")
data class UserChat(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = 0,

        val chatRoomId: Long,
        val senderId: Long,
        val content: String,
        val sentAt: LocalDateTime = LocalDateTime.now()
)