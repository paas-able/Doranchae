package com.doran.penpal

import com.doran.penpal.entity.Penpal
import com.doran.penpal.entity.PenpalMessage
import com.doran.penpal.feign.UserIdData
import com.doran.penpal.feign.UserServiceFeignClient
import com.doran.penpal.global.DataResponse
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import com.doran.penpal.repository.PenpalMessageRepository
import com.doran.penpal.repository.PenpalRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class PenpalService(
    private val penpalMessageRepository: PenpalMessageRepository,
    private val penpalRepository: PenpalRepository,
    private val userServiceClient: UserServiceFeignClient
) {
    @Transactional
    fun createMessage(req: SendToRequest, sendFrom: UUID) : PenpalMessage {
        // TODO: req.sendTo를 ID로 갖는 사용자의 존재 여부 확인 필요
        // 새 메세지 선언
        val newPenpalMessage: PenpalMessage

        newPenpalMessage = if (req.sendTo != null) { // 1. 수신인 지정 펜팔
            sendPrivate(sendFrom = sendFrom, sendTo = req.sendTo!!, content = req.content)

        } else { // 2. 랜덤 펜팔
            sendRandom(sendFrom = sendFrom, content = req.content)
        }

        return newPenpalMessage
    }

    private fun sendPrivate(sendFrom: UUID, sendTo: UUID, content: String): PenpalMessage {
        // 1. 해당 펜팔 유무 확인
        val exPenpal = findExistingPenpal(sendFrom = sendFrom, sendTo = sendTo)

        return if (exPenpal != null) { // 2-1. 존재 O -> 메세지만 추가
            createNewMessage(sendFrom = sendFrom, sendTo = sendTo, content = content, penpal = exPenpal)

        } else { // 2-2. 존재 X -> 새로운 펜팔 생성 후 메세지 추가
            val newPenpal = createNewPenpal(sendFrom = sendFrom, sendTo = sendTo)
            createNewMessage(sendFrom = sendFrom, sendTo = sendTo, content = content, penpal = newPenpal)
        }
    }

    private fun sendRandom(sendFrom: UUID, content: String): PenpalMessage {
        // 1. 참여 중인 펜팔 상대방 조회
        val excludeIdList: MutableList<String> = retrievePenpalFriendList(userId = sendFrom)
        excludeIdList.add(sendFrom.toString())

        // 2. svc-user에서 랜덤 유저 조회
        val randomUserId = findRandomUser(excludeIds = excludeIdList)

        // 3. 새로운 펜팔 생성
        val newPenpal = createNewPenpal(sendFrom = sendFrom, sendTo = randomUserId)

        // 4. 새로운 펜팔 메세지 생성
        return createNewMessage(sendFrom = sendFrom, sendTo = randomUserId, content = content, penpal = newPenpal)
    }

    private fun retrievePenpalFriendList(userId: UUID): MutableList<String> {
        return penpalRepository.findExistingFriendIds(userId)
    }

    private fun findRandomUser(excludeIds: MutableList<String>): UUID {
        val response: DataResponse<UserIdData> = userServiceClient.getRandomFriend(excludeIds = excludeIds)
        return response.data!!.userId
    }

    private fun findExistingPenpal(sendFrom: UUID, sendTo: UUID): Penpal? {
        val participants = setOf(sendFrom, sendTo)
        return penpalRepository.findPenpalByParticipants(participants, 2L).orElse(null)
    }

    private fun createNewMessage(sendFrom: UUID, sendTo: UUID, content: String, penpal: Penpal): PenpalMessage {
        val initialStatus = MessageStatus(status = Status.SENT)
        val newMessage = PenpalMessage(sendFrom = sendFrom, sendTo = sendTo, content = content, status = initialStatus, penpal = penpal)
        return penpalMessageRepository.save(newMessage)
    }
    private fun createNewPenpal(sendFrom: UUID, sendTo: UUID): Penpal {
        val participants = setOf(sendFrom, sendTo)
        val newPenpal = Penpal(participantIds = participants)
        return penpalRepository.save(newPenpal)
    }

    @Transactional
    fun retrievePenpals(userId: UUID, pageable: Pageable): Page<Penpal> {
        return penpalRepository.findPenpalByParticipantIdsContaining(userId, pageable)
    }

    @Transactional
    fun retrieveMessages(penpalId:UUID, pageable: Pageable): Page<PenpalMessage> {
        val penpal = penpalRepository.findById(penpalId).orElseThrow { CustomException(ErrorCode.PENPAL_NOT_FOUND) } // TODO: 요청한 유저의 펜팔인지 확인
        val messages = penpalMessageRepository.findAllByPenpal(penpal, pageable)

        if (messages.last().status == MessageStatus(status = Status.SENT)) {
            messages.last().updateStatus(MessageStatus(status = Status.READ))
        }

        return messages
    }

    @Transactional
    fun inactivePenpal(penpalId: UUID): Penpal {
        val penpal = penpalRepository.findById(penpalId).orElseThrow { CustomException(ErrorCode.PENPAL_NOT_FOUND) } // TODO: 요청한 유저의 펜팔인지 확인
        return penpal.beFriend()
    }

    @Transactional
    fun closePenpal(penpalId: UUID): Boolean {
        val penpal = penpalRepository.findById(penpalId).orElseThrow { CustomException(ErrorCode.PENPAL_NOT_FOUND) } // TODO: 요청한 유저의 펜팔인지 확인

        val messageDeleteResult = penpalMessageRepository.deleteAllByPenpal(penpal)
        val penpalDeleteResult = penpalRepository.deleteById(penpalId)

        if (messageDeleteResult == Unit && penpalDeleteResult == Unit) {
            return true
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }
}