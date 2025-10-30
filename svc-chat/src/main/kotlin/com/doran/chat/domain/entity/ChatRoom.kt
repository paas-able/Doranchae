package com.doran.chat.domain.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "chatRoom")
class ChatRoom(
        @Id
        @Column(columnDefinition = "binary(16)")
        val id: UUID = UUID.randomUUID(),

        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(
                name = "chat_room_participants",
                joinColumns = [JoinColumn(name = "chat_room_id")]
        )
        @Column(name = "participant_id", columnDefinition = "binary(16)")
        val participantIds: Set<UUID>

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