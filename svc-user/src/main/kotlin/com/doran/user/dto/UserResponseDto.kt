package com.doran.user.dto

import java.time.LocalDate
import java.util.*

data class NokInfoResponse(
    val relationship: String,
    val name: String,
    val phoneNumber: String
)

data class UserInfoResponse (
    val userId: UUID,
    val nickname: String,
    val age: Int,
    val gender: String,
    val interests: List<String>,
    
    val nokInfo: NokInfoResponse? 
)