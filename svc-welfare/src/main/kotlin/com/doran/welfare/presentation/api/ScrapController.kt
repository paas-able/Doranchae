package com.doran.welfare.presentation.api

import com.doran.welfare.application.AddScrapUseCase
import com.doran.welfare.application.RemoveScrapUseCase
import com.doran.welfare.presentation.api.dto.ScrapResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/welfare")
class ScrapController(
    private val addScrap: AddScrapUseCase,
    private val removeScrap: RemoveScrapUseCase
) {
    private fun resolveUserId(xUserId: String?): Long =
        xUserId?.toLongOrNull() ?: 1L

    @PostMapping("/posts/{postId}/scraps")
    fun scrap(
        @PathVariable postId: Long,
        @RequestHeader(name = "X-User-Id", required = false) xUserId: String?
    ): ResponseEntity<ScrapResponse> {
        val result = addScrap.execute(postId, resolveUserId(xUserId))
        return ResponseEntity.ok(ScrapResponse(scrapped = result.scrapped, count = result.count))
    }

    @DeleteMapping("/posts/{postId}/scraps")
    fun unScrap(
        @PathVariable postId: Long,
        @RequestHeader(name = "X-User-Id", required = false) xUserId: String?
    ): ResponseEntity<ScrapResponse> {
        val result = removeScrap.execute(postId, resolveUserId(xUserId))
        return ResponseEntity.ok(ScrapResponse(scrapped = result.scrapped, count = result.count))
    }
}
