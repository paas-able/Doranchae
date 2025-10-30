package com.doran.penpal.feign.dto

import java.time.LocalDate
import java.util.*

data class UserInfoDetail (
    val userId: UUID,
    val nickname: String,
    val birthDate: LocalDate,
    val gender: String,
    val interests: List<String>,
)
