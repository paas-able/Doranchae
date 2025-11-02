package com.doran.chat.domain.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "user_chat")
class UserChat (
    @Id
        @Column(columnDefinition = "binary(16)")
        val id: UUID = UUID.randomUUID(),

    @ManyToOne
        @JoinColumn(name = "chat_room_id")
        val chatRoom: ChatRoom,

    @Column(nullable = false)
        val senderId: UUID,

    @Column(nullable = false, columnDefinition = "TEXT")
        val content: String,

    @Column(nullable = false)
        val sentAt: LocalDateTime
)