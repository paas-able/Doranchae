package com.doran.chat.repository

import com.doran.chat.domain.ChatRoom
import org.springframework.data.jpa.repository.JpaRepository

interface ChatRoomRepository : JpaRepository<ChatRoom, Long> {
    fun findChatRoomByUser1IdAndUser2Id(user1Id: Long, user2Id: Long): ChatRoom ?
}