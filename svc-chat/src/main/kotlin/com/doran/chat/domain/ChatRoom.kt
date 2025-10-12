package com.doran.chat.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "chat_room")
data class ChatRoom(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = 0,

        @ElementCollection
        @CollectionTable(name = "chat_room_participants", joinColumns = [JoinColumn(name = "chat_room_id")])
        @Column(name = "participant_id")
        val participantIds: List<Long> = listOf(),

        @Enumerated(EnumType.STRING)
        var status: ChatStatus = ChatStatus.ACTIVE,

        var lastMessageAt: LocalDateTime? = null
) {
        fun endChatRoom(): LocalDateTime {
                status = ChatStatus.INACTIVE
                return LocalDateTime.now()
        }

        fun updateLastMessageTime() {
                lastMessageAt = LocalDateTime.now()
        }
}