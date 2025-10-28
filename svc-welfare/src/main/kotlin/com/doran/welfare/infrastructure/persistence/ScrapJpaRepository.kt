package com.doran.welfare.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ScrapJpaRepository : JpaRepository<ScrapEntity, UUID> {
    fun countByWelfareId(welfareId: UUID): Long
    fun findByWelfareIdAndUserId(welfareId: UUID, userId: String): ScrapEntity?
    fun deleteByWelfareIdAndUserId(welfareId: UUID, userId: String)
    fun findByUserId(userId: String): List<ScrapEntity>
    fun findByWelfareId(welfareId: UUID): List<ScrapEntity>
}