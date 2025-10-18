package com.doran.penpal

import com.doran.penpal.entity.PenpalMessage
import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.DataResponse
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/penpal")
class PenpalController(private val penpalService: PenpalService) {
    @PostMapping("/send/to")
    fun sendController(@Valid @RequestBody req: SendToRequest): ResponseEntity<DataResponse<SendToResponse>> {
        val newPenpalMessage: PenpalMessage = penpalService.createMessage(req)
        val responseDto = SendToResponse(messageId = newPenpalMessage.id, sentAt = newPenpalMessage.createdAt)
        return ApiResponse.success(responseDto)
    }
}

data class SendToRequest(
    @field:NotNull(message = "보내는 사람의 ID를 지정해주세요.")
    val sendFrom: UUID,
    @field:NotNull(message = "받는 사람의 ID를 지정해주세요.")
    val sendTo: UUID,
    @field:NotBlank(message = "내용은 필수입니다.")
    val content: String
)

data class SendToResponse (
    val messageId: UUID,
    val sentAt: LocalDateTime
)
