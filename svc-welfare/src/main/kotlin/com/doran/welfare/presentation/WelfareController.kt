package com.doran.welfare.presentation

import com.doran.welfare.application.WelfareService
import com.doran.welfare.domain.Welfare
import com.doran.welfare.global.ApiResponse
import com.doran.welfare.global.DataResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

data class WelfareResponse(
    val id: UUID,
    val title: String,
    val content: String,
    val organization: String,
    val region: String,
    val localUploadDate: String,
    val startDate: String,
    val endDate: String?,
    val provider: String,
    val sourceUrl: String
)

data class WelfareListResponse(
    val welfares: List<WelfareResponse>
)

@RestController
@RequestMapping("/api/welfare")
class WelfareController(
    private val welfareService: WelfareService
) {
    
    @GetMapping
    fun getAllWelfares(): ResponseEntity<DataResponse<WelfareListResponse>> {
        val welfares = welfareService.getAllWelfares()
        val response = WelfareListResponse(welfares.map { it.toResponse() })
        return ApiResponse.success(response)
    }
    
    @GetMapping("/search")
    fun searchWelfares(
        @RequestParam(required = false) theme: String?,
        @RequestParam(required = false) region: String?
    ): ResponseEntity<DataResponse<WelfareListResponse>> {
        val welfares = welfareService.searchWelfares(theme, region)
        val response = WelfareListResponse(welfares.map { it.toResponse() })
        return ApiResponse.success(response)
    }
    
    @GetMapping("/{id}")
    fun getWelfareById(@PathVariable id: UUID): ResponseEntity<DataResponse<WelfareResponse>> {
        val welfare = welfareService.getWelfareById(id)
        return ApiResponse.success(welfare.toResponse())
    }

    @PostMapping("/{id}/like")
    fun addLike(
        @PathVariable id: UUID,
        @RequestParam userId: String
    ): ResponseEntity<DataResponse<String>> {
        welfareService.addLike(id, userId)
        return ApiResponse.success("좋아요 추가됨")
    }

    @DeleteMapping("/{id}/like")
    fun removeLike(
        @PathVariable id: UUID,
        @RequestParam userId: String
    ): ResponseEntity<DataResponse<String>> {
        welfareService.removeLike(id, userId)
        return ApiResponse.success("좋아요 취소됨")
    }

    @GetMapping("/{id}/like-count")
    fun getLikeCount(@PathVariable id: UUID): ResponseEntity<DataResponse<Long>> {
        return ApiResponse.success(welfareService.getLikeCount(id))
    }

    @GetMapping("/user/{userId}/likes")
    fun getMyLikes(@PathVariable userId: String): ResponseEntity<DataResponse<WelfareListResponse>> {
        val welfares = welfareService.getMyLikes(userId)
        val response = WelfareListResponse(welfares.map { it.toResponse() })
        return ApiResponse.success(response)
    }

    @GetMapping("/user/{userId}/scraps")
    fun getMyScraps(@PathVariable userId: String): ResponseEntity<DataResponse<WelfareListResponse>> {
        val welfares = welfareService.getMyScraps(userId)
        val response = WelfareListResponse(welfares.map { it.toResponse() })
        return ApiResponse.success(response)
    }

    @PostMapping("/{id}/scrap")
    fun addScrap(
        @PathVariable id: UUID,
        @RequestParam userId: String
    ): ResponseEntity<DataResponse<String>> {
        welfareService.addScrap(id, userId)
        return ApiResponse.success("스크랩 추가됨")
    }

    @DeleteMapping("/{id}/scrap")
    fun removeScrap(
        @PathVariable id: UUID,
        @RequestParam userId: String
    ): ResponseEntity<DataResponse<String>> {
        welfareService.removeScrap(id, userId)
        return ApiResponse.success("스크랩 취소됨")
    }

    @GetMapping("/{id}/scrap-count")
    fun getScrapCount(@PathVariable id: UUID): ResponseEntity<DataResponse<Long>> {
        return ApiResponse.success(welfareService.getScrapCount(id))
    }
    
    private fun Welfare.toResponse(): WelfareResponse {
        return WelfareResponse(
            id = id,
            title = title,
            content = content,
            organization = organization,
            region = region,
            localUploadDate = localUploadDate.toString(),
            startDate = startDate.toString(),
            endDate = endDate?.toString(),
            provider = provider,
            sourceUrl = sourceUrl
        )
    }
}