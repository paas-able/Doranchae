package com.doran.user.domain
import com.doran.penpal.global.ApiResponse
import com.doran.penpal.global.DataResponse
import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import com.doran.user.domain.valueObjects.Interests
import com.doran.user.enums.InterestOption
import com.doran.user.utils.annotations.ValidateInterestsCount
import com.doran.user.utils.annotations.ValidatePassword
import com.doran.user.utils.annotations.ValidatePhoneNumber
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import java.util.stream.Collectors

@RestController
@RequestMapping("/api/user")
class UserController(
    val userService: UserService
) {
    @PostMapping("/join")
    fun join(@Valid @RequestBody req: JoinRequest): ResponseEntity<DataResponse<JoinResponse>> {
        val newUser = userService.createUser(req = req)
        val newNOK = userService.createNOK(req.nextOfKin, newUser)
        val responseDTO = JoinResponse(newUser.id, newNOK.id!!)
        return ApiResponse.success(responseDTO)
    }

    @GetMapping("/{userId}")
    fun retrieveUserInfo(@PathVariable userId: UUID): ResponseEntity<DataResponse<UserInfoResponse>>{
        val user = userService.retrieveUser(userId).orElseThrow { CustomException(ErrorCode.USER_NOT_FOUND) }

        val userInterestList = user.userDetail.interests.interests
            .stream()
            .map { it: InterestOption? -> it?.code?:"" }
            .collect(Collectors.toList())

        val userAge = LocalDateTime.now().year - user.userDetail.birthDate.year + 1

        val responseDto = UserInfoResponse(
            userId = user.id,
            nickname = user.nickname,
            age = userAge,
            gender = user.userDetail.gender.code,
            interests = userInterestList
        )
        return ApiResponse.success(responseDto)
    }

    private fun getInterestCode(interests: Interests) {

    }
}

/* Data Class */
data class JoinRequest (
    @field:NotNull(message = "아이디는 필수입니다.")
    val loginId: String,

    @field:ValidatePassword
    val password: String,

    @field:NotNull(message = "닉네임은 필수입니다.")
    val nickname: String,

    val userDetail: UserDetail,

    @field:ValidateInterestsCount
    val interests: InterestsInput,

    val userSetting: UserSettings,
    val nextOfKin: NOKInfo
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

data class UserInfoResponse (
    val userId: UUID,
    val nickname: String,
    val age: Int,
    val gender: String,
    val interests: List<String>,
)