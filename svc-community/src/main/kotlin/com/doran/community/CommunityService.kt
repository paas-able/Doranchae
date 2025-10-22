package com.doran.community

import com.doran.community.entities.Post
import com.doran.community.repositories.PostRepository
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

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

    @Transactional
    fun editPost(postId: UUID, req: EditPostRequest): Post {
        // TODO: 요청한 사람이 해당 post의 author인지 확인하는 로직 추가
        val exPost = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
        if (exPost.isEdited) {
            throw CustomException(ErrorCode.POST_ALREADY_EDITED)
        }

        when (req.editPart) {
            "both" -> {
                exPost.updatePost(editPart = req.editPart, newTitle = req.newTitle, newContent = req.newContent)
            }
            "title" -> {
                exPost.updatePost(editPart = req.editPart, newTitle = req.newTitle, newContent = null)
            }
            "content" -> {
                exPost.updatePost(editPart = req.editPart, newTitle = null, newContent = req.newContent)
            }
        }

        return postRepository.save(exPost)
    }
}