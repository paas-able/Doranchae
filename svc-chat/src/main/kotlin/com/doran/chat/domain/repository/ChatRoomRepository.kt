package com.doran.chat.domain.repository

import com.doran.chat.domain.entity.ChatRoom
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

interface ChatRoomRepository : JpaRepository<ChatRoom, UUID> {
    @Query("""
        SELECT cr FROM ChatRoom cr JOIN cr.participantIds p
        WHERE p IN :participantIds
        GROUP BY cr.id
        HAVING COUNT(p) = :participantCount
    """)
    fun findChatRoomByParticipantIds(
        @Param("participantIds") participantIds: Set<UUID>,
        @Param("participantCount") participantCount: Int
    ): Optional<ChatRoom>

    fun findByParticipantIdsContainingAndStatus(
        targetId: UUID,
        status: ChatRoom.ChatStatus,
        pageable: Pageable
    ): Page<ChatRoom>

    fun findByParticipantIdsContainingAndParticipantIdsNotContainingAndStatus(
        userId: UUID,
        chatbotId: UUID,
        status: ChatRoom.ChatStatus,
        pageable: Pageable
    ): Page<ChatRoom>
}