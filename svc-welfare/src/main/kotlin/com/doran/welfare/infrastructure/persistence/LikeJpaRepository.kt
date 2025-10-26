package com.doran.welfare.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface LikeJpaRepository : JpaRepository<LikeEntity, UUID> {
    fun countByWelfareId(welfareId: UUID): Long
    fun findByWelfareIdAndUserId(welfareId: UUID, userId: String): LikeEntity?
    fun deleteByWelfareIdAndUserId(welfareId: UUID, userId: String)
    fun findByUserId(userId: String): List<LikeEntity>
}