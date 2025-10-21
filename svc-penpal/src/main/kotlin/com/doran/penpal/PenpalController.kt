package com.doran.penpal

import com.doran.penpal.entity.Penpal
import com.doran.penpal.entity.PenpalMessage
import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.DataResponse
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
        val searchResult = penpalService.retrievePenpals(req.userId, pageable)
        println(searchResult.totalElements)
        val pageInfo = createPenpalPageInfo(searchResult)

        val conversations: List<PenpalInfo> = if (!searchResult.isEmpty) {
            searchResult.content.map { item ->
                val opponentId = item.participantIds.firstOrNull { it != req.userId }
                PenpalInfo(id = item.id, opponentId = opponentId)
            }
        } else {
            emptyList()
        }

        println(conversations)
        val responseDto = PenpalListResponse(penpals = conversations, page = pageInfo)
        return ApiResponse.success(responseDto)
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

/*Function*/
fun createPenpalPageInfo(info: Page<Penpal>): PageInfo{
    return PageInfo(isFirst = info.isFirst, isLast = info.isLast, currentPage = info.number, totalPages = info.totalPages)
}