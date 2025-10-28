package com.doran.welfare.domain

import java.time.LocalDate
import java.util.UUID

data class Welfare(
    val id: UUID,
    val title: String,
    val content: String,
    val organization: String,
    val region: String,
    val localUploadDate: LocalDate,
    val startDate: LocalDate,
    val endDate: LocalDate?,
    val provider: String,
    val sourceUrl: String
)

interface WelfareRepository {
    fun findAll(): List<Welfare>
    fun findById(id: UUID): Welfare?
    fun search(theme: String?, region: String?): List<Welfare>
    fun save(welfare: Welfare): UUID
}