package com.doran.user.domain.controllers

import com.doran.user.domain.UserService
import com.doran.user.global.ApiResponse
import com.doran.user.global.DataResponse
import com.doran.user.global.ErrorCode
import com.doran.user.global.auth.CustomUserDetails
import com.doran.user.global.exception.CustomException
import org.springframework.web.bind.annotation.*
import java.util.*
import com.doran.user.enums.InterestOption
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import java.time.LocalDate
import java.util.stream.Collectors

@RestController
@RequestMapping("/api/internal")
class UserInternalController (
    val userService: UserService
) {
    @GetMapping("/{userId}")
    fun retrieveUserInfo(@PathVariable userId: UUID): ResponseEntity<DataResponse<UserInfoDetail>> {
        val user = userService.retrieveUser(userId).orElseThrow { CustomException(ErrorCode.USER_NOT_FOUND) }

        val userInterestList = user.userDetail.interests.interests
            .stream()
            .map { it: InterestOption? -> it?.code?:"" }
            .collect(Collectors.toList())

        val responseDto = UserInfoDetail(
            userId = user.id,
            nickname = user.nickname,
            birthDate = user.userDetail.birthDate,
            gender = user.userDetail.gender.code,
            interests = userInterestList
        )
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/randFriend")
    fun getRandomPenpalUserId(
        @AuthenticationPrincipal userDetails: CustomUserDetails,
        @RequestParam("excludeIds") excludeIds: MutableList<String>
    ): ResponseEntity<DataResponse<Map<String, String>>> {
        val randomUserId = userService.findRandomUserId(excludeIdList = excludeIds)
            .orElseThrow { CustomException(ErrorCode.USER_NOT_FOUND) }

        return ApiResponse.success(mapOf("userId" to randomUserId))
    }
}

data class UserInfoDetail (
    val userId: UUID,
    val nickname: String,
    val birthDate: LocalDate,
    val gender: String,
    val interests: List<String>,
)