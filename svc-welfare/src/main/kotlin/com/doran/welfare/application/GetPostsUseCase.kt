package com.doran.welfare.application

import com.doran.welfare.domain.Post
import com.doran.welfare.domain.PostRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class GetPostsUseCase(
    private val postRepository: PostRepository
) {
    @Transactional(readOnly = true)
    fun getAll(): List<Post> = postRepository.findAll()
}
