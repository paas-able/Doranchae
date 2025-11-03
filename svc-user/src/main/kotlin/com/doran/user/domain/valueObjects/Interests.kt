package com.doran.user.domain.valueObjects

import com.doran.user.enums.InterestOption
import jakarta.persistence.*

@Embeddable
data class Interests(
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_interests", joinColumns = [JoinColumn(name = "user_id")])
    @Enumerated(EnumType.STRING)
    val interests: MutableSet<InterestOption?>
) {
    fun updateInterests(newOptions: MutableSet<InterestOption?>): Interests {
        return this.copy(interests = newOptions)
    }
}
