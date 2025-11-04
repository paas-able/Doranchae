package com.doran.community

import com.doran.community.global.jwt.CustomUserDetails
import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.BaseResponse
import com.doran.penpal.global.DataResponse
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/community")
class CommunityController(
    val communityService: CommunityService
) {
    @PostMapping("/posts")
    fun createPost(@Valid @RequestBody req: CreatePostRequest, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<CreatePostResponse>> {
        val newPost = communityService.createPost(req = req, userId = UUID.fromString(userDetails.userId))
        val responseDto = CreatePostResponse(postId = newPost.id, createdAt = newPost.createdAt)
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/posts")
    fun retrievePosts(@AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<RetrievePostsResponse>>{
        val postList = communityService.retrievePosts()

        val responseDto = if (postList.isEmpty()) {
            RetrievePostsResponse(posts = emptyList())
        } else {
            val formattedList = postList.map {
                val commentCount = communityService.retrieveCommentsCount(it.id)

                val contentPreview: String = if (it.content.length > 20) {
                    it.content.substring(0,20)
                } else {
                    it.content
                }

                FormattedPost(id = it.id, title = it.title, contentPreview = contentPreview, createdAt = it.createdAt, likeCount = it.likes, commentCount = commentCount)
            }
            RetrievePostsResponse(posts = formattedList)
        }

        return ApiResponse.success(responseDto)
    }

    @PatchMapping("/posts/{postId}")
    fun editPost(@PathVariable postId: UUID, @Valid @RequestBody req: EditPostRequest, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<PatchResponse>> {
        // editPart 검증
        val editPartFilter = listOf("both", "title", "content")
        if (!editPartFilter.contains(req.editPart)) {
            throw CustomException(ErrorCode.WRONG_EDIT_PART)
        }

        // 수정
        val editResult = communityService.editPost(postId = postId, req = req, userId = UUID.fromString(userDetails.userId))
        return ApiResponse.success(PatchResponse(updatedAt = editResult.updatedAt))
    }

    @PostMapping("/posts/{postId}/like")
    fun likePost(@PathVariable postId: UUID, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<PatchResponse>> {
        val likeResult = communityService.likePost(postId = postId, userId = UUID.fromString(userDetails.userId))
        return ApiResponse.success(PatchResponse(updatedAt = likeResult.updatedAt))
    }

    @DeleteMapping("/posts/{postId}/like")
    fun unlikePost(@PathVariable postId: UUID, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<PatchResponse>> {
        val unlikeResult = communityService.unlikePost(postId = postId, userId = UUID.fromString(userDetails.userId))
        return ApiResponse.success(PatchResponse(updatedAt = unlikeResult.updatedAt))
    }

    @GetMapping("/posts/{postId}")
    fun retrievePost(@PathVariable postId: UUID, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<RetrievePostResponse>> {
        val post = communityService.retrievePost(postId)
        val isLike = communityService.retrievePostLike(postId = postId, userId = UUID.fromString(userDetails.userId))
        val authorInfo = communityService.retrieveUserInfo(post.authorId)

        val postDto = PostInfo(postId = post.id, title = post.title, content = post.content, likes = post.likes, createdAt = post.createdAt, isEdited = post.isEdited)

        val authorIdStr = authorInfo.userId.toString()
        val userId = userDetails.userId
        val authorDto = AuthorInfo(userId = authorInfo.userId, name = authorInfo.nickname, isMe = authorIdStr == userId)

        val responseDto = RetrievePostResponse(post = postDto, author = authorDto, isLiked = isLike)
        return ApiResponse.success(responseDto)
    }

    @PostMapping("/comments/{postId}")
    fun createComment(@PathVariable postId: UUID, @RequestBody req: CreateCommentRequest, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<CreateCommentResponse>> {
        val newComment = communityService.createComment(postId = postId, req = req, userId = UUID.fromString(userDetails.userId))
        val responseDto = CreateCommentResponse(commentId = newComment.id, createdAt = newComment.createdAt)
        return ApiResponse.success(responseDto)
    }

    @DeleteMapping("/comments/{commentId}")
    fun deleteComment(@PathVariable commentId: UUID, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<BaseResponse> {
        val deleteResult = communityService.deleteComment(commentId, UUID.fromString(userDetails.userId))
        if (deleteResult) {
            return ApiResponse.successWithNoData()
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }

    @GetMapping("/comments/{postId}/list")
    fun retrieveComments(@PathVariable postId: UUID, @AuthenticationPrincipal userDetails: CustomUserDetails): ResponseEntity<DataResponse<RetrieveCommentsResponse>>{
        val commentList = communityService.retrieveComments(postId)

        val responseDto: RetrieveCommentsResponse = if (commentList.isEmpty()) {
            RetrieveCommentsResponse(comments = emptyList())
        } else {
            val formattedList = commentList.map {
                val author = communityService.retrieveUserInfo(it.authorId)
                val authorIdStr = author.userId.toString()
                val userId = userDetails.userId
                val authorInfo = AuthorInfo(userId = author.userId, name = author.nickname, isMe = authorIdStr == userId)
                FormattedComment(id = it.id, parentId = it.parentId, author = authorInfo, content = it.content, createdAt = it.createdAt, isAuthor = (it.authorId == UUID.fromString(userDetails.userId)))
            }
            RetrieveCommentsResponse(comments = formattedList)
        }

        return ApiResponse.success(responseDto)
    }

    @DeleteMapping("/post/{postId}")
    fun deletePost(@AuthenticationPrincipal userDetails: CustomUserDetails, @PathVariable postId: UUID): ResponseEntity<BaseResponse> {
        val deleteResult = communityService.deletePost(postId = postId, userId = UUID.fromString(userDetails.userId))
        if (deleteResult) {
            return ApiResponse.successWithNoData()
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }

    @GetMapping("/post/recent")
    fun recentPost(@AuthenticationPrincipal userDetails: CustomUserDetails):  ResponseEntity<DataResponse<RecentPostResponse>>{
        val post = communityService.retrieveRecentPost()

        val commentCount = communityService.retrieveCommentsCount(post.id)
        val contentPreview: String = if (post.content.length > 20) {
            post.content.substring(0,20)
        } else {
            post.content
        }

        val responseDto = RecentPostResponse(id = post.id, title = post.title, contentPreview = contentPreview, commentCount = commentCount)
        return ApiResponse.success(responseDto)
    }
}

/* Data Class */
data class CreatePostRequest (
    @field:NotBlank(message = "제목은 필수입니다.")
    val title: String,
    @field:NotBlank(message = "내용은 필수입니다.")
    val content: String
)

data class CreatePostResponse (
    val postId: UUID,
    val createdAt: LocalDateTime
)

data class EditPostRequest (
    @field:NotBlank(message = "수정 파트를 지정해주세요")
    val editPart: String,
    val newTitle: String?,
    val newContent: String?
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
    val name: String,
    val isMe: Boolean
)

data class CreateCommentRequest (
    @field:NotBlank(message = "내용은 필수입니다.")
    val content: String,
    val parentId: UUID?,
)

data class CreateCommentResponse (
    val commentId: UUID,
    val createdAt: LocalDateTime
)

data class RetrieveCommentsResponse (
    val comments: List<FormattedComment?>
)

data class FormattedComment (
    val id: UUID,
    val parentId: UUID?,
    val content: String,
    val createdAt: LocalDateTime,
    val author: AuthorInfo,
    val isAuthor: Boolean
)

data class RetrievePostsResponse (
    val posts: List<FormattedPost>
)

data class FormattedPost (
    val id: UUID,
    val title: String,
    val contentPreview: String,
    val createdAt: LocalDateTime,
    val likeCount: Int,
    val commentCount: Int
)

data class RecentPostResponse (
    val id: UUID,
    val title: String,
    val contentPreview: String,
    val commentCount: Int
)