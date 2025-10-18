package com.doran.penpal

import com.doran.penpal.entity.Penpal
import com.doran.penpal.entity.PenpalMessage
import com.doran.penpal.repository.PenpalMessageRepository
import com.doran.penpal.repository.PenpalRepository
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

        // 새 메세지 생성
        val newPenpalMessage = createNewMessage(req = req)

        // 해당 펜팔의 유무 확인
        val exPenpal = findExistingPenpal(sendFrom = req.sendFrom, sendTo = req.sendTo)
        if (exPenpal != null) {
            exPenpal.addMessage(newPenpalMessage)

        } else {
            createNewPenpal(req = req, message = newPenpalMessage)
        }

        return newPenpalMessage
    }

    // 왜 private엔 @Transactional이 못 붙을까?
    private fun findExistingPenpal(sendFrom: UUID, sendTo: UUID): Penpal? {
        val participants = setOf(sendFrom, sendTo)
        return penpalRepository.findPenpalByParticipants(participants, 2L).orElse(null)
    }

    private fun createNewMessage(req: SendToRequest): PenpalMessage {
        val initialStatus = MessageStatus(status = Status.SENT)
        val newMessage = PenpalMessage(sendFrom = req.sendFrom, sendTo = req.sendTo, content = req.content, status = initialStatus)
        return penpalMessageRepository.save(newMessage)
    }
    private fun createNewPenpal(req: SendToRequest, message: PenpalMessage): Penpal {
        val participants = setOf(req.sendFrom, req.sendTo)
        val newMessageList = listOf(message.id)
        val newPenpal = Penpal(participantIds = participants, messages = newMessageList)
        return penpalRepository.save(newPenpal)
    }
}