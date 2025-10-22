package com.doran.community.repositories

import com.doran.community.entities.Comment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface CommentRepository: JpaRepository<Comment, UUID> {
}