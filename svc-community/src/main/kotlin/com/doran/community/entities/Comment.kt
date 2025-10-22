package com.doran.community.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "comment")
data class Comment(
    @Id
    @Column(columnDefinition = "binary(16)")
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = true)
    val parentId: UUID?, //있으면 대댓글

    val authorId: UUID,

    @Column(nullable = false)
    val content: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    val post: Post,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    var updatedAt: LocalDateTime = LocalDateTime.now()
)
