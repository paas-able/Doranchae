package com.doran.chat.repository

import com.doran.chat.domain.ChatRoom
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*
import kotlin.reflect.jvm.internal.impl.name.StandardClassIds

interface ChatRoomRepository : JpaRepository<ChatRoom, Long> {
    @Query("""
        SELECT cr FROM ChatRoom cr JOIN cr.participantIds p
        WHERE p IN :participantIds
        GROUP BY cr.id
        HAVING COUNT(p) = :participantCount
    """)
    fun findChatRoomByParticipantIds(
        @Param("participantIds") participantIds: Set<Long>,
        @Param("participantCount") participantCount: Int
    ): Optional<ChatRoom>

    fun findByParticipantIdsContainingAndStatus(
        targetId: Long,
        status: ChatRoom.ChatStatus
    ): List<ChatRoom>
}