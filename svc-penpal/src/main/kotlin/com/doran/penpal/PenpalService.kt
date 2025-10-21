package com.doran.penpal

import com.doran.penpal.entity.Penpal
import com.doran.penpal.entity.PenpalMessage
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
    private val penpalRepository: PenpalRepository
) {
    @Transactional
    fun createMessage(req: SendToRequest) : PenpalMessage {

        // TODO: req.sendTo를 ID로 갖는 사용자의 존재 여부 확인 필요

        // 새 메세지 선언
        val newPenpalMessage: PenpalMessage

        // 해당 펜팔의 유무 확인
        val exPenpal = findExistingPenpal(sendFrom = req.sendFrom, sendTo = req.sendTo)

        newPenpalMessage = if (exPenpal != null) {
            createNewMessage(req = req, exPenpal)

        } else {
            val newPenpal = createNewPenpal(req = req)
            createNewMessage(req = req, newPenpal)
        }

        return newPenpalMessage
    }

    // 왜 private엔 @Transactional이 못 붙을까?
    private fun findExistingPenpal(sendFrom: UUID, sendTo: UUID): Penpal? {
        val participants = setOf(sendFrom, sendTo)
        return penpalRepository.findPenpalByParticipants(participants, 2L).orElse(null)
    }

    private fun createNewMessage(req: SendToRequest, penpal: Penpal): PenpalMessage {
        val initialStatus = MessageStatus(status = Status.SENT)
        val newMessage = PenpalMessage(sendFrom = req.sendFrom, sendTo = req.sendTo, content = req.content, status = initialStatus, penpal = penpal)
        return penpalMessageRepository.save(newMessage)
    }
    private fun createNewPenpal(req: SendToRequest): Penpal {
        val participants = setOf(req.sendFrom, req.sendTo)
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
}