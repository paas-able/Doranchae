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

    @PostMapping("/{postId}/like")
    fun likePost(@PathVariable postId: UUID, @RequestBody req: TempUserIdRequest): ResponseEntity<DataResponse<PatchResponse>> {
        val likeResult = communityService.likePost(postId, req.userId)
        return ApiResponse.success(PatchResponse(updatedAt = likeResult.updatedAt))
    }

    @DeleteMapping("/{postId}/like")
    fun unlikePost(@PathVariable postId: UUID, @RequestBody req: TempUserIdRequest): ResponseEntity<DataResponse<PatchResponse>> {
        val unlikeResult = communityService.unlikePost(postId, req.userId)
        return ApiResponse.success(PatchResponse(updatedAt = unlikeResult.updatedAt))
    }

    @GetMapping("/{postId}")
    fun retrievePost(@PathVariable postId: UUID, @RequestBody req: TempUserIdRequest): ResponseEntity<DataResponse<RetrievePostResponse>> {
        val post = communityService.retrievePost(postId)
        val isLike = communityService.retrievePostLike(postId, req.userId)
        // TODO: 작성자 정보 조회 로직 구현

        val postDto = PostInfo(postId = post.id, title = post.title, content = post.content, likes = post.likes, createdAt = post.createdAt, isEdited = post.isEdited)
        val authorDto = AuthorInfo(userId = post.authorId, name = "temp")
        val responseDto = RetrievePostResponse(post = postDto, author = authorDto, isLiked = isLike)
        return ApiResponse.success(responseDto)
    }

    /*@PostMapping("/{postId}/comment")
    fun createComment(@PathVariable postId: UUID, @RequestBody req: CreateComment) {

    }*/
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
data class TempUserIdRequest (
    val userId: UUID
)

data class PatchResponse (
    val updatedAt: LocalDateTime
)

data class RetrievePostResponse (
    val post: PostInfo,
    val author: AuthorInfo,
    val isLiked: Boolean
)

data class PostInfo (
    val postId: UUID,
    val title: String,
    val content: String,
    val likes: Int,
    val createdAt: LocalDateTime,
    val isEdited: Boolean
)

data class AuthorInfo (
    val userId: UUID,
    val name: String
)

data class CreateComment (
    val content: String,
    val parentId: UUID?,
    val authorId: UUID
)
