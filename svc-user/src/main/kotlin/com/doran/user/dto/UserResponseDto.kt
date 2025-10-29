package com.doran.user.dto

import java.util.UUID

data class UserInfoResponse (
    val userId: UUID,
    val nickname: String,
    val age: Int,
    val gender: String,
    val interests: List<String>,
)