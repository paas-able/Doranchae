package com.doran.welfare.presentation

import com.doran.welfare.application.WelfareService
import com.doran.welfare.domain.Welfare
import com.doran.welfare.global.ApiResponse
import com.doran.welfare.global.DataResponse
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

data class WelfareResponse(
    val servId: String,
    val title: String,
    val content: String?,
    val organization: String?,
    val region: String?,
    val localUploadDate: String?,
    val provider: String?,
    val sourceUrl: String?
)

data class WelfareListResponse(
    val welfares: List<WelfareResponse>
)

data class WelfareResponseDto(
    val servId: String,
    val title: String,
    val content: String,
    val organization: String,
    val region: String,
    val localUploadDate: String,
    val provider: String,
    val sourceUrl: String,
    val likeCount: Long,
    val scrapCount: Long
)

@RestController
@RequestMapping("/api/welfare")
class WelfareController(
    private val welfareService: WelfareService
) {

    @GetMapping
    fun getAllWelfares(): ResponseEntity<List<WelfareResponseDto>> {
        val welfares = welfareService.getAllWelfares()
        val response = welfares.map { welfare ->
            WelfareResponseDto(
                servId = welfare.servId ?: "",
                title = welfare.title ?: "",
                content = welfare.content ?: "",
                organization = welfare.organization ?: "",
                region = welfare.region ?: "",
                localUploadDate = welfare.localUploadDate?.toString() ?: "",
                provider = welfare.provider ?: "",
                sourceUrl = welfare.sourceUrl ?: "",
                likeCount = welfareService.getLikeCount(welfare.servId) ?: 0L,
                scrapCount = welfareService.getScrapCount(welfare.servId) ?: 0L
            )
        }
        return ResponseEntity.ok(response)
    }

    // ==================== USER 관련 (경로 순서 중요) ====================
    @GetMapping("/user/me/likes")
    fun getUserLikes(): ResponseEntity<DataResponse<WelfareListResponse>> {
        val userId = getCurrentUserId()
        val likes = welfareService.getMyLikes(userId)
        val response = WelfareListResponse(likes.map { it.toResponse() })
        return ApiResponse.success(response)
    }

    @GetMapping("/user/me/likes/check")
    fun checkUserLikes(): ResponseEntity<DataResponse<Map<String, Boolean>>> {
        val userId = getCurrentUserId()
        val likes = welfareService.getMyLikes(userId)
        val likeMap = likes.associate { it.servId to true }
        return ApiResponse.success(likeMap)
    }

    @GetMapping("/user/me/scraps")
    fun getUserScraps(): ResponseEntity<DataResponse<WelfareListResponse>> {
        val userId = getCurrentUserId()
        val scraps = welfareService.getScrapsByUser(userId)
        val response = WelfareListResponse(scraps.map { it.toResponse() })
        return ApiResponse.success(response)
    }

    @GetMapping("/user/me/scraps/check")
    fun checkUserScraps(): ResponseEntity<DataResponse<Map<String, Boolean>>> {
        val userId = getCurrentUserId()
        val scraps = welfareService.getScrapsByUser(userId)
        val scrapMap = scraps.associate { it.servId to true }
        return ApiResponse.success(scrapMap)
    }

    // ==================== 상세 조회 ====================
    @GetMapping("/{servId}")
    fun getWelfareById(@PathVariable servId: String): ResponseEntity<DataResponse<WelfareResponse>> {
        val welfare = welfareService.getWelfareById(servId)
        return ApiResponse.success(welfare.toResponse())
    }

    // ==================== LIKE ====================
    @PostMapping("/{servId}/like")
    fun addLike(@PathVariable servId: String): ResponseEntity<DataResponse<String>> {
        val userId = getCurrentUserId()
        welfareService.addLike(servId, userId)
        return ApiResponse.success("좋아요 추가됨")
    }

    @DeleteMapping("/{servId}/like")
    fun removeLike(@PathVariable servId: String): ResponseEntity<DataResponse<String>> {
        val userId = getCurrentUserId()
        welfareService.removeLike(servId, userId)
        return ApiResponse.success("좋아요 취소됨")
    }

    @GetMapping("/{servId}/like-count")
    fun getLikeCount(@PathVariable servId: String): ResponseEntity<DataResponse<Long>> {
        return ApiResponse.success(welfareService.getLikeCount(servId))
    }

    // ==================== SCRAP ====================
    @PostMapping("/{servId}/scrap")
    fun addScrap(@PathVariable servId: String): ResponseEntity<DataResponse<String>> {
        val userId = getCurrentUserId()
        welfareService.addScrap(servId, userId)
        return ApiResponse.success("스크랩 추가됨")
    }

    @DeleteMapping("/{servId}/scrap")
    fun removeScrap(@PathVariable servId: String): ResponseEntity<DataResponse<String>> {
        val userId = getCurrentUserId()
        welfareService.removeScrap(servId, userId)
        return ApiResponse.success("스크랩 취소됨")
    }

    @GetMapping("/{servId}/scrap-count")
    fun getScrapCount(@PathVariable servId: String): ResponseEntity<DataResponse<Long>> {
        return ApiResponse.success(welfareService.getScrapCount(servId))
    }

    // ==================== UTIL ====================
    private fun getCurrentUserId(): String {
        val authentication = SecurityContextHolder.getContext().authentication
        return authentication.principal.toString()
    }

    private fun Welfare.toResponse(): WelfareResponse {
        return WelfareResponse(
            servId = servId,
            title = title,
            content = content,
            organization = organization,
            region = region,
            localUploadDate = localUploadDate?.toString(),
            provider = provider,
            sourceUrl = sourceUrl
        )
    }
}
