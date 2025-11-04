package com.doran.community.repositories

import com.doran.community.entities.Post
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PostRepository: JpaRepository<Post, UUID> {
    fun findTopByOrderByCreatedAtDesc(): Post
}