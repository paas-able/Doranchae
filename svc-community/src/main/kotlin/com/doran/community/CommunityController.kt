package com.doran.community

import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.DataResponse
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
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
        val responseDto = CreatePostResponse(postId = newPost.id, postedAt = newPost.createdAt)
        return ApiResponse.success(responseDto)
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
