package com.doran.welfare.domain

import java.time.Instant

data class Like(
    val id: Long? = null,
    val postId: Long,
    val userId: Long,
    val createdAt: Instant = Instant.now()
)
