package com.doran.chat.service

import com.doran.chat.domain.ChatRoom
import com.doran.chat.domain.UserChat
import com.doran.chat.repository.ChatRoomRepository
import com.doran.chat.repository.UserChatRepository
import com.doran.chat.global.ErrorCode
import com.doran.chat.global.exception.CustomException
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class ChatService(
    private val chatRoomRepository: ChatRoomRepository,
    private val userChatRepository: UserChatRepository
) {

    fun createChatRoom(user1Id: Long, user2Id: Long): Long {
        val existingRoom = chatRoomRepository.findChatRoomByUser1IdAndUser2Id(user1Id, user2Id)
        if (existingRoom != null) {
            throw CustomException(ErrorCode.CHAT_DUPLICATE_ROOM)
        }
        val chatRoom = ChatRoom(
            // user1Id와 user2Id 중 작은 값이 항상 user1Id로 가도록 해서 중복 방지
            user1Id = minOf(user1Id, user2Id),
            user2Id = maxOf(user1Id, user2Id)
        )

        val savedChatRoom = chatRoomRepository.save(chatRoom)
        return savedChatRoom.id
    }

    fun saveMessage(chatRoomId: Long, senderId: Long, content: String, sentAt: LocalDateTime): UserChat {
        val chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow { CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND) }
        chatRoom.lastMessageAt = sentAt

        val chat = UserChat(
            chatRoom = chatRoom,
            senderId = senderId,
            content = content,
            sentAt = sentAt
        )
        chatRoomRepository.save(chatRoom)
        return userChatRepository.save(chat)
    }

    fun getMessages(chatRoomId: Long): List<UserChat> {
        chatRoomRepository.findById(chatRoomId)
            .orElseThrow { CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND) }
        return userChatRepository.findByChatRoomIdOrderBySentAtAsc(chatRoomId)
    }

//    fun endChatRoom(chatRoomId: Long): Long {
//        chatRoomRepository.findById(chatRoomId)?:throw IllegalArgumentException("없다네")
//        chatRoom.endChatRoom()
//        chatRoomRepository.save(chatRoom)
//    }
}
