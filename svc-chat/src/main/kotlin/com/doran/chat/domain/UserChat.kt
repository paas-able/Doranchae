package com.doran.chat.domain

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "userChat")
class UserChat (
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long? = null,


        @ManyToOne
        @JoinColumn(name = "chatRoom_id")
        val chatRoom: ChatRoom,

        @Column(nullable = false)
        val senderId: Long = 0L,

        @Column(nullable = false, columnDefinition = "TEXT")
        val content: String,

        @Column(nullable = false)
        val sentAt: LocalDateTime
)