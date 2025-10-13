package com.doran.welfare.infrastructure.persistence.jpa.entity

import jakarta.persistence.*

@Entity
@Table(name = "welfare_posts")
class WelfarePostJpaEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 200)
    val title: String,

    @Column(columnDefinition = "TEXT")
    val content: String,

    val category: String? = null
)
