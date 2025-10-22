package com.doran.community

import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.DataResponse
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/community")
class CommunityController(
    val communityService: CommunityService
) {
    @PostMapping("/post")
    fun createPost(@Valid @RequestBody req: CreatePostRequest): ResponseEntity<DataResponse<CreatePostResponse>> {
        val newPost = communityService.createPost(req)
        println(newPost.id)
        val responseDto = CreatePostResponse(postId = newPost.id, postedAt = newPost.createdAt)
        return ApiResponse.success(responseDto)
    }

    @PatchMapping("/{postId}/edit")
    fun editPost(@PathVariable postId: UUID, @Valid @RequestBody req: EditPostRequest): ResponseEntity<DataResponse<PatchResponse>> {
        // editPart 검증
        val editPartFilter = listOf("both", "title", "content")
        if (!editPartFilter.contains(req.editPart)) {
            throw CustomException(ErrorCode.WRONG_EDIT_PART)
        }

        // 수정
        val editResult = communityService.editPost(postId, req)
        return ApiResponse.success(PatchResponse(updatedAt = editResult.updatedAt))
    }

    @PatchMapping("/{postId}/like")
    fun likePost(@PathVariable postId: UUID, @RequestBody req: PostLikeRequest): ResponseEntity<DataResponse<PatchResponse>> {
        val likeResult = communityService.likePost(postId, req.userId)
        return ApiResponse.success(PatchResponse(updatedAt = likeResult.updatedAt))
    }

    @DeleteMapping("/{postId}/like")
    fun unlikePost(@PathVariable postId: UUID, @RequestBody req: PostLikeRequest): ResponseEntity<DataResponse<PatchResponse>> {
        val unlikeResult = communityService.unlikePost(postId, req.userId)
        return ApiResponse.success(PatchResponse(updatedAt = unlikeResult.updatedAt))
    }
}

/* Data Class */
data class CreatePostRequest (
    @field:NotBlank(message = "제목은 필수입니다.")
    val title: String,
    @field:NotBlank(message = "내용은 필수입니다.")
    val content: String,
    // TODO: Spring Security 적용 시 삭제
    val authorId: UUID
)

data class CreatePostResponse (
    val postId: UUID,
    val postedAt: LocalDateTime
)

data class EditPostRequest (
    @field:NotBlank(message = "수정 파트를 지정해주세요")
    val editPart: String,
    val newTitle: String?,
    val newContent: String?
)

// TODO: Spring Security 구현시 삭제
data class PostLikeRequest (
    val userId: UUID
)

data class PatchResponse (
    val updatedAt: LocalDateTime
)
