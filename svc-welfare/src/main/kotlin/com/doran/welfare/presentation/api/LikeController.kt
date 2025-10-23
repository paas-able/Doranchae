package com.doran.welfare.presentation.api

import com.doran.welfare.application.AddLikeUseCase
import com.doran.welfare.application.RemoveLikeUseCase
import com.doran.welfare.presentation.api.dto.LikeResponse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/welfare")
class LikeController(
    private val addLike: AddLikeUseCase,
    private val removeLike: RemoveLikeUseCase
) {
    // 임시로 사용자 ID를 헤더로 받자. (나중에 인증 연동)
    private fun resolveUserId(xUserId: String?): Long =
        xUserId?.toLongOrNull() ?: 1L // 임시 기본값 1

    @PostMapping("/posts/{postId}/likes")
    fun like(
        @PathVariable postId: Long,
        @RequestHeader(name = "X-User-Id", required = false) xUserId: String?
    ): ResponseEntity<LikeResponse> {
        val result = addLike.execute(postId, resolveUserId(xUserId))
        return ResponseEntity.ok(LikeResponse(liked = result.liked, count = result.count))
    }

    @DeleteMapping("/posts/{postId}/likes")
    fun unlike(
        @PathVariable postId: Long,
        @RequestHeader(name = "X-User-Id", required = false) xUserId: String?
    ): ResponseEntity<LikeResponse> {
        val result = removeLike.execute(postId, resolveUserId(xUserId))
        return ResponseEntity.ok(LikeResponse(liked = result.liked, count = result.count))
    }
}
