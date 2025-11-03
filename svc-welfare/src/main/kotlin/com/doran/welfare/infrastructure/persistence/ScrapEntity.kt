package com.doran.welfare.infrastructure.persistence

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "scraps", uniqueConstraints = [UniqueConstraint(columnNames = ["welfare_id", "user_id"])])
class ScrapEntity protected constructor() {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    lateinit var id: UUID

    @Column(name = "welfare_id", nullable = false, length = 50)
    lateinit var welfareId: String

    @Column(name = "user_id", nullable = false)
    lateinit var userId: String

    @Column(nullable = false)
    lateinit var createdAt: LocalDateTime

    constructor(
        welfareId: String,
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
