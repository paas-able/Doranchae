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

        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(
                name = "chat_room_participants",
                joinColumns = [JoinColumn(name = "chat_room_id")]
        )
        @Column(name = "participant_id", nullable = false)
        val participantIds: Set<Long> = emptySet(),

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