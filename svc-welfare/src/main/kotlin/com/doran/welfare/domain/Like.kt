package com.doran.welfare.domain

import java.time.LocalDateTime
import java.util.UUID

data class Like(
    val id: UUID,
    val welfareId: String,
    val userId: String,
    val createdAt: LocalDateTime
)

interface LikeRepository {
    fun findByWelfareIdAndUserId(welfareId: String, userId: String): Like?
    fun findByUserId(userId: String): List<Like>
    fun findByWelfareId(welfareId: String): List<Like>
    fun save(like: Like): UUID
    fun deleteByWelfareIdAndUserId(welfareId: String, userId: String)
    fun countByWelfareId(welfareId: String): Long
}
