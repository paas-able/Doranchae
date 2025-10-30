package com.doran.user.domain.controllers

import com.doran.user.domain.UserService
import com.doran.user.global.ApiResponse
import com.doran.user.global.DataResponse
import com.doran.user.global.ErrorCode
import com.doran.user.global.auth.CustomUserDetails
import com.doran.user.global.exception.CustomException
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import java.util.*
import com.doran.user.enums.InterestOption
import org.springframework.http.ResponseEntity
import java.time.LocalDate
import java.util.*
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

    @GetMapping("/randfriend")
    fun getRandomPenpalUserId(): ResponseEntity<DataResponse<Map<String, UUID>>> {
        val randomUserId = userService.findRandomUserId()
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