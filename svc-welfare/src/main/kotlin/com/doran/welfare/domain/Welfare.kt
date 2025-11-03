package com.doran.welfare.domain

import java.time.LocalDate

data class Welfare(
    val servId: String,
    val title: String,
    val content: String?,
    val organization: String?,
    val region: String?,
    val localUploadDate: LocalDate?,
    val provider: String?,
    val sourceUrl: String?
)

interface WelfareRepository {
    fun findAll(): List<Welfare>
    fun findById(servId: String): Welfare?
    fun search(theme: String?, region: String?): List<Welfare>
    fun save(welfare: Welfare): String
}
