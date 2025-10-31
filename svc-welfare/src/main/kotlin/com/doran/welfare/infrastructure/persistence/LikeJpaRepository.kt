package com.doran.welfare.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface LikeJpaRepository : JpaRepository<LikeEntity, UUID> {
    fun countByWelfareId(welfareId: String): Long
    fun findByWelfareIdAndUserId(welfareId: String, userId: String): LikeEntity?
    fun deleteByWelfareIdAndUserId(welfareId: String, userId: String)
    fun findByUserId(userId: String): List<LikeEntity>
    fun findByWelfareId(welfareId: String): List<LikeEntity>
}
