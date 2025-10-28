package com.doran.chat.repository

import com.doran.chat.domain.UserChat
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserChatRepository : JpaRepository<UserChat, Long> {
    fun findByChatRoomId(chatRoomId: UUID, pageable: Pageable): Page<UserChat>
}