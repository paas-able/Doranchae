package com.doran.welfare.infrastructure.persistence

import com.doran.welfare.domain.Like
import com.doran.welfare.domain.LikeRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class LikeRepositoryImpl(
    private val jpaRepository: LikeJpaRepository
) : LikeRepository {
    
    override fun findByWelfareIdAndUserId(welfareId: UUID, userId: String): Like? {
        return jpaRepository.findByWelfareIdAndUserId(welfareId, userId)?.toDomain()
    }
    
    override fun findByUserId(userId: String): List<Like> {
        return jpaRepository.findByUserId(userId).map { it.toDomain() }
    }
    
    override fun findByWelfareId(welfareId: UUID): List<Like> {
        return jpaRepository.findByWelfareId(welfareId).map { it.toDomain() }
    }
    
    override fun save(like: Like): UUID {
        val entity = LikeEntity(
            welfareId = like.welfareId,
            userId = like.userId,
            id = like.id,
            createdAt = like.createdAt
        )
        return jpaRepository.save(entity).id
    }
    
    override fun deleteByWelfareIdAndUserId(welfareId: UUID, userId: String) {
        jpaRepository.deleteByWelfareIdAndUserId(welfareId, userId)
    }
    
    override fun countByWelfareId(welfareId: UUID): Long {
        return jpaRepository.countByWelfareId(welfareId)
    }
    
    private fun LikeEntity.toDomain(): Like {
        return Like(
            id = id,
            welfareId = welfareId,
            userId = userId,
            createdAt = createdAt
        )
    }
}