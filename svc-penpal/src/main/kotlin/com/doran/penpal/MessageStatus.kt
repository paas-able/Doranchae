package com.doran.penpal

import jakarta.persistence.Embeddable

enum class Status {
    DRAFT, SENT, READ
}

@Embeddable
data class MessageStatus(val status: Status) {
    fun changeStatus(newStatus: Status): MessageStatus{
        // TODO: 예외 처리
        return this.copy(status = newStatus)
    }

    fun getName(): String {
        return this.status.name
    }
}
