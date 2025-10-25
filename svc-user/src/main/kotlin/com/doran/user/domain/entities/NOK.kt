package com.doran.user.domain.entities

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "next_of_kin")
data class NOK(
    @Id
    @Column(columnDefinition = "binary(16)")
    val id: UUID = UUID.randomUUID(),

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    val user: User,

    var relationship: String,
    var name: String,
    var phoneNumber: String,

    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun update(
        relationship: String = this.relationship,
        name: String = this.name,
        phoneNumber: String = this.phoneNumber
    ) {
        this.relationship = relationship
        this.name = name
        this.phoneNumber = phoneNumber

        this.updatedAt = LocalDateTime.now()
        this.user.updatedAt = LocalDateTime.now()
    }
}
