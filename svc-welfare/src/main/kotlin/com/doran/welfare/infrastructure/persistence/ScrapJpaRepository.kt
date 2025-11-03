package com.doran.welfare.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ScrapJpaRepository : JpaRepository<ScrapEntity, UUID> {
    fun countByWelfareId(welfareId: String): Long
    fun findByWelfareIdAndUserId(welfareId: String, userId: String): ScrapEntity?
    fun deleteByWelfareIdAndUserId(welfareId: String, userId: String)
    fun findByUserId(userId: String): List<ScrapEntity>
    fun findByWelfareId(welfareId: String): List<ScrapEntity>
}
