package com.doran.penpal

import com.doran.penpal.entity.PenpalMessage
import com.doran.penpal.feign.dto.UserInfoDetail
import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.BaseResponse
import com.doran.penpal.global.DataResponse
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.UUID
import org.springframework.security.core.annotation.AuthenticationPrincipal
import com.doran.penpal.global.jwt.CustomUserDetails

@RestController
@RequestMapping("/api/penpal")
class PenpalController(
    private val penpalService: PenpalService,
) {
    @PostMapping("/send")
    fun sendController(@Valid @RequestBody req: SendToRequest, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<SendToResponse>> {
        val newPenpalMessage: PenpalMessage = penpalService.createMessage(req, sendFrom = UUID.fromString(userDetails.userId))
        val responseDto = SendToResponse(messageId = newPenpalMessage.id, sentAt = newPenpalMessage.createdAt)
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/list")
    fun retrievePenpals(@AuthenticationPrincipal userDetails: CustomUserDetails, pageable: Pageable): ResponseEntity<DataResponse<PenpalListResponse>>{
        val userId = UUID.fromString(userDetails.userId)
        val result = penpalService.retrievePenpals(userId = userId, pageable = pageable)
        val pageInfo = createPageInfo(result)

        val penpals: List<PenpalInfo> = if (!result.isEmpty) {
            result.content.map { item ->
                val opponentId = item.participantIds.first { it != userId }
                val opponentInfo = penpalService.retrieveUserInfo(opponentId)
                PenpalInfo(id = item.id, opponentInfo = opponentInfo)
            }
        } else {
            emptyList()
        }

        val responseDto = PenpalListResponse(penpals = penpals, page = pageInfo)
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/{penpalId}/messages")
    fun retrieveMessages(@AuthenticationPrincipal userDetails: CustomUserDetails, @PathVariable penpalId: UUID, pageable: Pageable): ResponseEntity<DataResponse<RetrieveMessageResponse>> {
        val userId = UUID.fromString(userDetails.userId)
        val result = penpalService.retrieveMessages(userId = UUID.fromString(userDetails.userId), penpalId = penpalId, pageable = pageable)
        val pageInfo = createPageInfo(result)

        val messages: List<PenpalMesssageInfo> = if (!result.isEmpty) {
            result.content
                .map { it ->
                PenpalMesssageInfo(id = it.id, content = it.content, sentAt = it.createdAt, status = it.status.getName(), isFromUser = (it.sendFrom == userId))
            }
        } else {
            emptyList()
        }

        val responseDto = RetrieveMessageResponse(messages = messages, page = pageInfo)
        return ApiResponse.success(responseDto)
    }

    @PatchMapping("/{penpalId}/switch")
    fun switchController(@AuthenticationPrincipal userDetails: CustomUserDetails, @PathVariable penpalId: UUID): ResponseEntity<BaseResponse>{
        val switchResult = penpalService.inactivePenpal(userId = UUID.fromString(userDetails.userId), penpalId = penpalId)
        if (!switchResult.isActive) {
            return ApiResponse.successWithNoData()
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }

    @DeleteMapping("/{penpalId}/close")
    fun closeController(@AuthenticationPrincipal userDetails: CustomUserDetails, @PathVariable penpalId: UUID): ResponseEntity<BaseResponse>{
        val switchResult = penpalService.closePenpal(userId = UUID.fromString(userDetails.userId), penpalId = penpalId)
        if (switchResult) {
            return ApiResponse.successWithNoData()
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }
}

/*Data Class*/
data class SendToRequest(
    var sendTo: UUID?,
    @field:NotBlank(message = "내용은 필수입니다.")
    val content: String
)

data class SendToResponse (
    val messageId: UUID,
    val sentAt: LocalDateTime
)

data class PenpalListResponse (
    val penpals: List<PenpalInfo>,
    val page: PageInfo
)

data class PenpalInfo (
    val id: UUID,
    val opponentInfo: UserInfoDetail?
)

data class PageInfo (
    var isFirst: Boolean,
    var isLast: Boolean,
    var currentPage: Int,
    var totalPages: Int
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
