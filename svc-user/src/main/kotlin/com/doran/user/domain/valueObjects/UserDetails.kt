package com.doran.user.domain.valueObjects

import com.doran.user.enums.Gender
import jakarta.persistence.*
import java.time.LocalDate

@Embeddable
data class UserDetails(
    val name: String,
    val birthDate: LocalDate,
    var phoneNumber: String,
    val gender: Gender,

    @Embedded
    val interests: Interests,
) {
    fun changePhoneNumber(newNumber: String) {
        this.phoneNumber = newNumber
    }
}
