package com.doran.welfare.domain

import java.time.LocalDateTime
import java.util.UUID

data class Scrap(
    val id: UUID,
    val welfareId: String,
    val userId: String,
    val createdAt: LocalDateTime
)

interface ScrapRepository {
    fun findByWelfareIdAndUserId(welfareId: String, userId: String): Scrap?
    fun findByUserId(userId: String): List<Scrap>
    fun findByWelfareId(welfareId: String): List<Scrap>
    fun save(scrap: Scrap): UUID
    fun deleteByWelfareIdAndUserId(welfareId: String, userId: String)
    fun countByWelfareId(welfareId: String): Long
}
