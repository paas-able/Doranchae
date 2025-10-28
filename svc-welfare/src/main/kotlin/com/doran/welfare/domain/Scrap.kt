package com.doran.welfare.domain

import java.time.LocalDateTime
import java.util.UUID

data class Scrap(
    val id: UUID,
    val welfareId: UUID,
    val userId: String,
    val createdAt: LocalDateTime
)

interface ScrapRepository {
    fun findByWelfareIdAndUserId(welfareId: UUID, userId: String): Scrap?
    fun findByUserId(userId: String): List<Scrap>
    fun findByWelfareId(welfareId: UUID): List<Scrap>
    fun save(scrap: Scrap): UUID
    fun deleteByWelfareIdAndUserId(welfareId: UUID, userId: String)
    fun countByWelfareId(welfareId: UUID): Long
}