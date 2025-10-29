package com.doran.welfare.infrastructure.persistence

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "likes", uniqueConstraints = [UniqueConstraint(columnNames = ["welfare_id", "user_id"])])
class LikeEntity protected constructor() {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    lateinit var id: UUID
    
    @Column(name = "welfare_id", nullable = false, columnDefinition = "BINARY(16)")
    lateinit var welfareId: UUID
    
    @Column(name = "user_id", nullable = false)
    lateinit var userId: String
    
    @Column(nullable = false)
    lateinit var createdAt: LocalDateTime
    
    constructor(
        welfareId: UUID,
        userId: String,
        id: UUID = UUID.randomUUID(),
        createdAt: LocalDateTime = LocalDateTime.now()
    ) : this() {
        this.id = id
        this.welfareId = welfareId
        this.userId = userId
        this.createdAt = createdAt
    }
}