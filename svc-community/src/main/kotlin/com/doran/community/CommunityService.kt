package com.doran.community

import com.doran.community.entities.Post
import com.doran.community.repositories.PostRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommunityService(
    val postRepository: PostRepository
) {
    @Transactional
    fun createPost(req: CreatePostRequest): Post {
        // TODO: userId 검증 로직 추가
        val newPost = Post(title = req.title, content = req.content, authorId = req.authorId)
        return postRepository.save(newPost)
    }
}