package com.doran.community

import com.doran.community.entities.Comment
import com.doran.community.entities.Post
import com.doran.community.entities.PostLike
import com.doran.community.entities.PostLikeId
import com.doran.community.repositories.CommentRepository
import com.doran.community.repositories.PostLikeRepository
import com.doran.community.repositories.PostRepository
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class CommunityService(
    val postRepository: PostRepository,
    val postLikeRepository: PostLikeRepository,
    val commentRepository: CommentRepository
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

    @Transactional
    fun likePost(postId: UUID, userId: UUID): Post {
        val exPost = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
        val exLike = exPost.likes

        // 게시글 좋아요 갱신(+1)
        exPost.updateLikes(true)

        if (exLike + 1 == exPost.likes) {
            // PostLike 테이블 갱신
            val postLikeId = PostLikeId(postId = postId, userId = userId)
            val newPostLike = PostLike(id = postLikeId, exPost)
            postLikeRepository.save(newPostLike)
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }

        // DB 반영
        return postRepository.save(exPost)
    }

    @Transactional
    fun unlikePost(postId: UUID, userId: UUID): Post {
        val exPost = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
        val exLike = exPost.likes

        // 게시글 좋아요 갱신(-1)
        exPost.updateLikes(false)

        if (exLike - 1 == exPost.likes) {
            // PostLike 테이블 갱신
            val postLikeId = PostLikeId(postId = postId, userId = userId)
            postLikeRepository.deleteById(postLikeId)
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }

        // DB 반영
        return postRepository.save(exPost)
    }

    @Transactional
    fun retrievePost(postId: UUID): Post {
        return postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
    }

    @Transactional
    fun retrievePostLike(postId: UUID, userId: UUID): Boolean {
        val postLikeId = PostLikeId(postId = postId, userId = userId)
        return postLikeRepository.findById(postLikeId).isEmpty
    }

    @Transactional
    fun createComment(postId: UUID, req: CreateCommentRequest): Comment {
        val post = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}

        if (req.parentId != null) {
            commentRepository.findById(req.parentId).orElseThrow{throw CustomException(ErrorCode.COMMENT_NOT_FOUND)}
        }

        val newComment = Comment(parentId = req.parentId, authorId = req.authorId, content = req.content, post = post)
        return commentRepository.save(newComment)
    }

    @Transactional
    fun deleteComment(commentId: UUID, userId: UUID) : Boolean{
        val comment = commentRepository.findById(commentId).orElseThrow{throw CustomException(ErrorCode.COMMENT_NOT_FOUND)}

        if (comment.authorId != userId) {
            throw CustomException(ErrorCode.NOT_YOUR_COMMENT)
        }

        val deleteChildrenResult = commentRepository.deleteAllByParentId(commentId)
        val deleteResult = commentRepository.delete(comment)
        if (deleteChildrenResult == Unit && deleteResult == Unit) {
            return true
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }
}