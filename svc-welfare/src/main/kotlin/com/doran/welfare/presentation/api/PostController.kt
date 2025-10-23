package com.doran.welfare.presentation.api

import com.doran.welfare.application.GetPostsUseCase
import com.doran.welfare.presentation.api.dto.PostSummaryDto
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/welfare")
class PostController(
    private val getPostsUseCase: GetPostsUseCase
) {
    @GetMapping("/posts")
    fun list(): List<PostSummaryDto> =
        getPostsUseCase.getAll().map {
            PostSummaryDto(
                id = it.id,
                title = it.title,
                content = it.content,
                category = it.category
            )
        }
}
