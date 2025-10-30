package com.doran.penpal.entity

import com.doran.penpal.MessageStatus
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "penpal_message")
data class PenpalMessage (
    @Id
    @Column(columnDefinition = "binary(16)")
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, columnDefinition = "binary(16)")
    val sendFrom: UUID,

    @Column(nullable = false, columnDefinition = "binary(16)")
    val sendTo: UUID,

    @Column(nullable = false)
    val content: String,

    @Column(nullable = false)
    @Embedded
    var status: MessageStatus,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "penpal_id", nullable = false)
    val penpal: Penpal,

    @Column(nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
) {
    fun updateStatus(newMessageStatus: MessageStatus) {
        // TODO: 예외 처리
        this.status = newMessageStatus
    }
}