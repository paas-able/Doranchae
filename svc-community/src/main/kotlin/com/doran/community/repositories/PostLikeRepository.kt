package com.doran.community.repositories

import com.doran.community.entities.Post
import com.doran.community.entities.PostLike
import com.doran.community.entities.PostLikeId
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PostLikeRepository: JpaRepository<PostLike, PostLikeId> {
    fun deleteAllByPost(post: Post)
}