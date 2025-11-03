package com.doran.community.entities

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "post_like")
data class PostLike(
    @EmbeddedId
    val id: PostLikeId,

    @MapsId("postId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    val post: Post,

    val createdAt: LocalDateTime = LocalDateTime.now()
)
