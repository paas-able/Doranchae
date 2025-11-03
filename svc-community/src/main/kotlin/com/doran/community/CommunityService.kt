package com.doran.community

import com.doran.community.entities.Comment
import com.doran.community.entities.Post
import com.doran.community.entities.PostLike
import com.doran.community.entities.PostLikeId
import com.doran.community.feign.UserInfoDetail
import com.doran.community.feign.UserServiceFeignClient
import com.doran.community.repositories.CommentRepository
import com.doran.community.repositories.PostLikeRepository
import com.doran.community.repositories.PostRepository
import com.doran.penpal.global.DataResponse
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class CommunityService(
    val postRepository: PostRepository,
    val postLikeRepository: PostLikeRepository,
    val commentRepository: CommentRepository,
    val userServiceClient: UserServiceFeignClient,
) {
    @Transactional
    fun createPost(req: CreatePostRequest, userId: UUID): Post {
        // TODO: userId 검증 로직 추가
        val newPost = Post(title = req.title, content = req.content, authorId = userId)
        return postRepository.save(newPost)
    }

    @Transactional
    fun retrievePosts(): List<Post> {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
    }

    @Transactional
    fun editPost(postId: UUID, req: EditPostRequest, userId: UUID): Post {
        val exPost = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
        if (exPost.isEdited) {
            throw CustomException(ErrorCode.POST_ALREADY_EDITED)
        }
        if (exPost.authorId !== userId) {
            throw CustomException(ErrorCode.NOT_YOUR_POST)
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
    fun createComment(postId: UUID, req: CreateCommentRequest, userId: UUID): Comment {
        val post = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}

        if (req.parentId != null) {
            commentRepository.findById(req.parentId).orElseThrow{throw CustomException(ErrorCode.COMMENT_NOT_FOUND)}
        }

        val newComment = Comment(parentId = req.parentId, authorId = userId, content = req.content, post = post)
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

    @Transactional
    fun retrieveComments(postId: UUID): List<Comment>{
        val post = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
        return commentRepository.findAllByPostOrderByCreatedAtDesc(post)
    }

    @Transactional
    fun retrieveCommentsCount(postId: UUID): Int{
        val post = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
        return commentRepository.findAllByPost(post).size
    }

    @Transactional
    fun deletePost(postId: UUID, userId: UUID): Boolean {
        val post = postRepository.findById(postId).orElseThrow{throw CustomException(ErrorCode.POST_NOT_FOUND)}
        if (post.authorId != userId) {
            throw CustomException(ErrorCode.NOT_YOUR_POST)
        }

        val deleteCommentsResult = commentRepository.deleteAllByPost(post)
        val deletePostLikeResult = postLikeRepository.deleteAllByPost(post)
        val deletePostResult = postRepository.delete(post)
        if (deleteCommentsResult == Unit && deletePostLikeResult == Unit && deletePostResult == Unit) {
            return true
        } else {
            throw CustomException(ErrorCode.COMMON_INTERNAL_ERROR)
        }
    }

    @Transactional
    fun retrieveUserInfo(userId: UUID): UserInfoDetail {
        val response: DataResponse<UserInfoDetail> = userServiceClient.getUserInfo(userId)
        return response.data!!
    }
}