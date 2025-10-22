package com.doran.chat.repository

import com.doran.chat.domain.UserChat
import org.springframework.data.jpa.repository.JpaRepository

interface UserChatRepository : JpaRepository<UserChat, Long> {
    fun findByChatRoomIdOrderBySentAtAsc(chatRoomId: Long): List<UserChat>
}