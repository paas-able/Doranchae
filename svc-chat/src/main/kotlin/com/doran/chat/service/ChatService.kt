package com.doran.chat.service

import com.doran.chat.domain.ChatRoom
import com.doran.chat.domain.UserChat
import com.doran.chat.dto.ChatMessageDTO
import com.doran.chat.repository.ChatRoomRepository
import com.doran.chat.repository.UserChatRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ChatService(
    private val chatRoomRepository: ChatRoomRepository,
    private val userChatRepository: UserChatRepository
) {

    fun createChatRoom(userId1: Long, userId2: Long): ChatRoom {
        // 이미 존재하는 1:1 방 있는지 확인
        val existingRoom = chatRoomRepository.findAll()
            .find { it.participantIds.containsAll(listOf(userId1, userId2)) }

        return existingRoom ?: chatRoomRepository.save(
            ChatRoom(participantIds = listOf(userId1, userId2))
        )
    }

    fun saveMessage(message: ChatMessageDTO): UserChat {
        val chat = UserChat(
            chatRoomId = message.chatRoomId,
            senderId = message.senderId,
            content = message.content,
            sentAt = LocalDateTime.now()
        )
        val saved = userChatRepository.save(chat)

        val chatRoom = chatRoomRepository.findById(message.chatRoomId).orElseThrow()
        chatRoom.updateLastMessageTime()
        chatRoomRepository.save(chatRoom)

        return saved
    }

    fun getMessages(chatRoomId: Long): List<UserChat> {
        return userChatRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId)
    }

    fun endChatRoom(chatRoomId: Long) {
        val chatRoom = chatRoomRepository.findById(chatRoomId).orElseThrow()
        chatRoom.endChatRoom()
        chatRoomRepository.save(chatRoom)
    }
}
