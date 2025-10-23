package com.doran.welfare.infrastructure.persistence.jpa.adapter

import com.doran.welfare.domain.LikeRepository
import com.doran.welfare.infrastructure.persistence.jpa.entity.WelfareLikeJpaEntity
import com.doran.welfare.infrastructure.persistence.jpa.springdata.SpringDataLikeJpa
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Repository
class LikeRepositoryAdapter(
    private val likeJpa: SpringDataLikeJpa
) : LikeRepository {

    @Transactional
    override fun add(postId: Long, userId: Long): Boolean {
        if (likeJpa.existsByPostIdAndUserId(postId, userId)) return false
        likeJpa.save(WelfareLikeJpaEntity(postId = postId, userId = userId))
        return true
    }

    @Transactional
    override fun remove(postId: Long, userId: Long): Boolean {
        val deleted = likeJpa.deleteByPostIdAndUserId(postId, userId)
        return deleted > 0
    }

    override fun exists(postId: Long, userId: Long): Boolean =
        likeJpa.existsByPostIdAndUserId(postId, userId)

    override fun count(postId: Long): Long =
        likeJpa.countByPostId(postId)
}
