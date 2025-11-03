package com.doran.user.dto

import com.doran.user.utils.annotations.ValidateInterestsCount
import com.doran.user.utils.annotations.ValidatePassword
import com.doran.user.utils.annotations.ValidatePhoneNumber
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.time.LocalDate
import java.util.UUID

/* Data Class */
data class JoinRequest (
    @field:NotNull(message = "아이디는 필수입니다.")
    val loginId: String,

    @field:ValidatePassword
    val password: String,

    @field:NotNull(message = "닉네임은 필수입니다.")
    val nickname: String,

    @field:Valid // 1. 하위 DTO도 검증하도록 @Valid 추가
    val userDetail: UserDetail,

    @field:ValidateInterestsCount
    val interests: InterestsInput,

    @field:Valid // 2. 하위 DTO도 검증하도록 @Valid 추가
    val userSetting: UserSettings,

    @field:Valid // 3. 하위 DTO도 검증하도록 @Valid 추가
    val NOKInfo : NOKInfo
)
data class InterestsInput (
    val interest1: String,
    val interest2: String,
    val interest3: String,
)
data class UserSettings (
    @field:NotNull(message = "약관 동의 여부는 필수입니다.")
    val termsAgree: Boolean,
    @field:NotNull(message = "Push 알림 여부는 필수입니다.")
    val notificationPush: Boolean,
    @field:NotNull(message = "SMS 알림 여부는 필수입니다.")
    val notificationSMS: Boolean,
    @field:NotNull(message = "보호자 알림 여부는 필수입니다.")
    val notificationNOK: Boolean
)
data class NOKInfo (
    @field:NotBlank(message = "보호자 관계는 필수입니다.")
    val relationship: String,
    @field:NotBlank(message = "보호자 이름은 필수입니다.")
    val name: String,
    @field:ValidatePhoneNumber
    val phoneNumber: String
)
data class UserDetail(
    @field:NotBlank(message = "이름은 필수입니다.")
    val name: String,
    @field:NotNull(message = "생년월일은 필수입니다.")
    val birthDate: LocalDate,
    @field:ValidatePhoneNumber
    var phoneNumber: String,
    @field:NotNull(message = "성별은 필수입니다.")
    val gender: String,
)

data class JoinResponse (
    val newUserId: UUID,
    val newNOKId: UUID
)
