package com.doran.chat.repository

import com.doran.chat.domain.ChatRoom
import org.springframework.data.jpa.repository.JpaRepository

interface ChatRoomRepository : JpaRepository<ChatRoom, Long> {
    fun findByParticipantIdsContains(userId: Long): List<ChatRoom>
    fun findByParticipantIds(userIds: List<Long>): ChatRoom?
}