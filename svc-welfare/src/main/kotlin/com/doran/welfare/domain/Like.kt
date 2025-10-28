package com.doran.welfare.domain

import java.time.LocalDateTime
import java.util.UUID

data class Like(
    val id: UUID,
    val welfareId: UUID,
    val userId: String,
    val createdAt: LocalDateTime
)

interface LikeRepository {
    fun findByWelfareIdAndUserId(welfareId: UUID, userId: String): Like?
    fun findByUserId(userId: String): List<Like>
    fun findByWelfareId(welfareId: UUID): List<Like>
    fun save(like: Like): UUID
    fun deleteByWelfareIdAndUserId(welfareId: UUID, userId: String)
    fun countByWelfareId(welfareId: UUID): Long
}