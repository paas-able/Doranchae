package com.doran.chat.domain

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "chatRoom")
class ChatRoom(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = 0L,

        @Column(nullable = false)
        val user1Id: Long,

        @Column(nullable = false)
        val user2Id: Long

){

        var lastMessageAt: LocalDateTime? = null

        @Column
        @Enumerated(EnumType.STRING)
        var status: ChatStatus = ChatStatus.ACTIVATE

        enum class ChatStatus(
                val status: String
        ){
                ACTIVATE("활성"),
                INACVTIVATE("비활성")
        }
}