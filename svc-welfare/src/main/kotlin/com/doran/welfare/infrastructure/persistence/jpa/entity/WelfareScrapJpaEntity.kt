package com.doran.welfare.infrastructure.persistence.jpa.entity

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(
    name = "welfare_scraps",
    uniqueConstraints = [UniqueConstraint(name = "uk_scrap_post_user", columnNames = ["post_id", "user_id"])],
    indexes = [Index(name = "idx_scrap_post", columnList = "post_id")]
)
class WelfareScrapJpaEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "post_id", nullable = false)
    val postId: Long,

    @Column(name = "user_id", nullable = false)
    val userId: Long,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now()
)
