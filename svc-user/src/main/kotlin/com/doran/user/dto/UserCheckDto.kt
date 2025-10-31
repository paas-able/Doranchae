package com.doran.user.dto

import jakarta.validation.constraints.NotBlank

data class CheckLoginIdRequest(
    @field:NotBlank(message = "아이디는 필수입니다.")
    val loginId: String
)

data class CheckLoginIdResponse(
    val isAvailable: Boolean, // true: 사용 가능, false: 이미 사용 중
    val message: String       // 응답 메시지 (예: "사용 가능한 아이디입니다.")
)