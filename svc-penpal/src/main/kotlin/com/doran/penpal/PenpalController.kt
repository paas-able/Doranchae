package com.doran.penpal

import com.doran.penpal.entity.PenpalMessage
import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.BaseResponse
import com.doran.penpal.global.DataResponse
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
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

    @GetMapping("/list")
    fun retrievePenpals(@RequestBody req: PenpalListRequest, pageable: Pageable): ResponseEntity<DataResponse<PenpalListResponse>>{
        val result = penpalService.retrievePenpals(req.userId, pageable)
        val pageInfo = createPageInfo(result)

        val penpals: List<PenpalInfo> = if (!result.isEmpty) {
            result.content.map { item ->
                val opponentId = item.participantIds.firstOrNull { it != req.userId }
                PenpalInfo(id = item.id, opponentId = opponentId)
            }
        } else {
            emptyList()
        }

        val responseDto = PenpalListResponse(penpals = penpals, page = pageInfo)
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/messages")
    fun retrieveMessages(@Valid @RequestBody req: RetrieveMesssageRequest, pageable: Pageable): ResponseEntity<DataResponse<RetrieveMessageResponse>> {
        val result = penpalService.retrieveMessages(penpalId = req.penpalId, pageable = pageable)
        val pageInfo = createPageInfo(result)

        val messages: List<PenpalMesssageInfo> = if (!result.isEmpty) {
            result.content.map { it ->
                PenpalMesssageInfo(id = it.id, content = it.content, sentAt = it.createdAt, status = it.status.toString(), isFromUser = (it.sendFrom == req.userId))
            }
        } else {
            emptyList()
        }

        val responseDto = RetrieveMessageResponse(messages = messages, page = pageInfo)
        return ApiResponse.success(responseDto)
    }

    @PatchMapping("/{penpalId}/switch")
    fun switchController(@PathVariable penpalId: UUID): ResponseEntity<BaseResponse>{
        val switchResult = penpalService.inactivePenpal(penpalId = penpalId)
        if (!switchResult.isActive) {
            return ApiResponse.successWithNoData()
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }

    @DeleteMapping("/{penpalId}/close")
    fun closeController(@PathVariable penpalId: UUID): ResponseEntity<BaseResponse>{
        val switchResult = penpalService.closePenpal(penpalId = penpalId)
        if (switchResult) {
            return ApiResponse.successWithNoData()
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }
}

/*Data Class*/
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

data class PenpalListRequest ( // TODO: Spring Security 구현 시 삭제
    val userId: UUID
)

data class PenpalListResponse (
    val penpals: List<PenpalInfo>,
    val page: PageInfo
)

data class PenpalInfo (
    val id: UUID,
    val opponentId: UUID? // TODO: Auth Service와 연결 후 opponentInfo로 변경하기
)

data class PageInfo (
    var isFirst: Boolean,
    var isLast: Boolean,
    var currentPage: Int,
    var totalPages: Int
)

data class RetrieveMesssageRequest (
    @field:NotNull(message = "조회하고자 하는 펜팔의 ID를 지정해주세요.")
    val penpalId: UUID,
    val userId: UUID, // TODO: Spring Security 구현 시 삭제
)

data class RetrieveMessageResponse (
    val messages: List<PenpalMesssageInfo>,
    val page: PageInfo
)

data class PenpalMesssageInfo (
    val id: UUID,
    val content: String,
    val sentAt: LocalDateTime,
    val status: String,
    val isFromUser: Boolean, // 송수신 여부
)

/*Function*/
fun <T> createPageInfo(info: Page<T>): PageInfo{
    return PageInfo(isFirst = info.isFirst, isLast = info.isLast, currentPage = info.number, totalPages = info.totalPages)
}