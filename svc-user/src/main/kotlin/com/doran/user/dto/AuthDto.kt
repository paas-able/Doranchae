package com.doran.user.dto

data class LoginRequest(
    val loginId: String,
    val password: String
)

data class TokenResponse(
    val accessToken: String
)