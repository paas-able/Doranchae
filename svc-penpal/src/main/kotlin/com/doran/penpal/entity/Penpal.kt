package com.doran.penpal.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "penpal")
data class Penpal(
    @Id
    @Column(columnDefinition = "binary(16)")
    val id: UUID = UUID.randomUUID(),

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "penpal_participants", joinColumns = [JoinColumn(name = "penpal_id")])
    @Column(name = "participant_id", columnDefinition = "binary(16)")
    val participantIds: Set<UUID>,

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "penpal_message_ref", joinColumns = [JoinColumn(name = "penpal_id")])
    @OrderColumn(name = "list_order")
    var messages: List<UUID>,

    var isActive: Boolean = true,

    var isFriend: Boolean = false,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun addMessage(newMessage: PenpalMessage) {
        this.messages += newMessage.id
        this.updatedAt = LocalDateTime.now()
    }
}
