package com.doran.community.repositories

import com.doran.community.entities.Comment
import com.doran.community.entities.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface CommentRepository: JpaRepository<Comment, UUID> {
    fun deleteAllByParentId(parentId: UUID)
    fun findAllByPostOrderByCreatedAtDesc(post: Post): List<Comment>
    fun deleteAllByPost(post: Post)
    fun findAllByPost(post: Post): List<Comment>
}