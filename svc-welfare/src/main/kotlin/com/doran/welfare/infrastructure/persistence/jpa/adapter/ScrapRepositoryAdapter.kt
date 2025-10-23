package com.doran.welfare.infrastructure.persistence.jpa.adapter

import com.doran.welfare.domain.ScrapRepository
import com.doran.welfare.infrastructure.persistence.jpa.entity.WelfareScrapJpaEntity
import com.doran.welfare.infrastructure.persistence.jpa.springdata.SpringDataScrapJpa
import org.springframework.stereotype.Repository
import java.time.Instant

@Repository
class ScrapRepositoryAdapter(
    private val scrapJpa: SpringDataScrapJpa
) : ScrapRepository {

    override fun add(postId: Long, userId: Long): Boolean {
        if (scrapJpa.existsByPostIdAndUserId(postId, userId)) return false
        scrapJpa.save(WelfareScrapJpaEntity(
            postId = postId,
            userId = userId,
            createdAt = Instant.now()
        ))
        return true
    }

    override fun remove(postId: Long, userId: Long): Boolean {
        val deleted = scrapJpa.deleteByPostIdAndUserId(postId, userId)
        return deleted > 0
    }

    override fun exists(postId: Long, userId: Long): Boolean =
        scrapJpa.existsByPostIdAndUserId(postId, userId)

    override fun count(postId: Long): Long =
        scrapJpa.countByPostId(postId)
}
