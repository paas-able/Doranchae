package com.doran.welfare.domain

data class Post(
    val id: Long,
    val title: String,
    val content: String,
    val category: String? = null
)
