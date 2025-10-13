package com.doran.welfare.presentation.api.dto

data class PostSummaryDto(
    val id: Long,
    val title: String,
    val content: String,
    val category: String?
)
