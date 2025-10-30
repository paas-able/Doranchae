package com.doran.chat.domain.service

import com.doran.chat.domain.entity.ChatRoom
import com.doran.chat.domain.entity.UserChat
import com.doran.chat.domain.repository.ChatRoomRepository
import com.doran.chat.domain.repository.UserChatRepository
import com.doran.chat.global.ErrorCode
import com.doran.chat.dto.ChatDto.*
import com.doran.chat.global.exception.CustomException
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class ChatService(
    private val chatRoomRepository: ChatRoomRepository,
    private val userChatRepository: UserChatRepository,
    @Value("\${chatbot.user-id}") chatbotUserId: String
) {
    private val CHATBOT_USER_ID: UUID = UUID.fromString(chatbotUserId)

    fun createChatRoom(userId1: UUID, userId2: UUID): UUID {

        val participantIds: Set<UUID> = setOf(userId1, userId2)
        val existingRoom = chatRoomRepository.findChatRoomByParticipantIds(participantIds, participantIds.size)
        if (existingRoom.isPresent)
            throw CustomException(ErrorCode.CHAT_DUPLICATE_ROOM)

        val chatRoom = ChatRoom(
            participantIds = setOf(userId1, userId2)
        )

        val savedChatRoom = chatRoomRepository.save(chatRoom)
        return savedChatRoom.id
    }

    fun saveMessage(chatRoomId: UUID, senderId: UUID, content: String, sentAt: LocalDateTime): UserChat {
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

    fun getChatRoomList(userId: UUID, pageable: Pageable): ChatRoomListResponse {
        val chatRoomPage: Page<ChatRoom> = chatRoomRepository.findByParticipantIdsContainingAndStatus(
            userId,
            ChatRoom.ChatStatus.ACTIVATE,
            pageable
        )

        val pageInfo = createPageInfo(chatRoomPage)

        val chatRoomInfos: List<ChatRoomInfo> = chatRoomPage.content.map { chatRoom ->
            val opponentId = chatRoom.participantIds.firstOrNull { it != userId }

            ChatRoomInfo(
                id = chatRoom.id,
                opponentId = opponentId
            )
        }

        return ChatRoomListResponse(chatRooms = chatRoomInfos, page = pageInfo)
    }


    fun getMessages(chatRoomId: UUID, userId: UUID, pageable: Pageable): MessageListResponse {
        val chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow { CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND) }

        if (chatRoom.status == ChatRoom.ChatStatus.INACVTIVATE)
            throw CustomException(ErrorCode.CHAT_ROOM_INACTIVATED)

        val messagePage: Page<UserChat> = userChatRepository.findByChatRoomId(chatRoomId, pageable)

        val pageInfo = createPageInfo(messagePage)

        val messageInfos: List<MessageInfo> = messagePage.content.map { chat ->
            MessageInfo(
                id = chat.id,
                content = chat.content,
                sentAt = chat.sentAt,
                isFromUser = (chat.senderId == userId)
            )
        }

        return MessageListResponse(messages = messageInfos, page = pageInfo)
    }

    fun endChatRoom(chatRoomId: UUID): ChatRoom {
        val chatRoom = chatRoomRepository.findById(chatRoomId)
            .orElseThrow { (CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND)) }
        chatRoom.status = ChatRoom.ChatStatus.INACVTIVATE
        return chatRoomRepository.save(chatRoom)
    }

    fun getChatBotRoom(userId: UUID): UUID {
        val participantIds: Set<UUID> = setOf(CHATBOT_USER_ID, userId)
        val existingRoom = chatRoomRepository.findChatRoomByParticipantIds(participantIds, participantIds.size)
            .orElseThrow { (CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND)) }
        return existingRoom.id;
    }

    fun <T> createPageInfo(info: Page<T>): PageInfo {
        return PageInfo(
            isFirst = info.isFirst,
            isLast = info.isLast,
            currentPage = info.number,
            totalPages = info.totalPages
        )
    }
}
