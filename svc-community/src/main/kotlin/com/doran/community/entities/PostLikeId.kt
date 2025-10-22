package com.doran.community.entities

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import java.io.Serializable
import java.util.UUID

@Embeddable
data class PostLikeId (
    @Column(name = "post_id", columnDefinition = "binary(16)")
    val postId: UUID,

    @Column(name = "user_id", columnDefinition = "binary(16)")
    val userId: UUID,
): Serializable
