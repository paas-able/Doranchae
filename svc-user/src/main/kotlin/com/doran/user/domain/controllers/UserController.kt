package com.doran.user.domain.controllers


import com.doran.user.dto.*

import com.doran.user.global.auth.CustomUserDetails
import com.doran.user.global.jwt.JwtTokenProvider
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder

import com.doran.user.global.ApiResponse
import com.doran.user.global.ErrorCode
import com.doran.user.global.DataResponse
import com.doran.user.global.exception.CustomException

import com.doran.user.domain.UserService
import com.doran.user.enums.InterestOption
import com.doran.user.utils.annotations.ValidateInterestsCount
import com.doran.user.utils.annotations.ValidatePassword
import com.doran.user.utils.annotations.ValidatePhoneNumber
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*
import java.util.stream.Collectors

@RestController
@RequestMapping("/api/user")
class UserController(
    private val userService: UserService,
    private val authenticationManager: AuthenticationManager,
    private val jwtTokenProvider: JwtTokenProvider
) {
    @PostMapping("/join")
    fun join(@Valid @RequestBody req: JoinRequest): ResponseEntity<DataResponse<JoinResponse>> {
        val newUser = userService.createUser(req = req)
        val newNOK = userService.createNOK(req.NOKInfo, newUser)
        val responseDTO = JoinResponse(newUser.id, newNOK.id!!)
        return ApiResponse.success(responseDTO)
    }
    @PostMapping("/check-login-id")
    fun checkLoginId(@Valid @RequestBody req: CheckLoginIdRequest): ResponseEntity<DataResponse<CheckLoginIdResponse>> {
        val isAvailable = userService.checkLoginIdAvailability(req.loginId)
        val message = if (isAvailable) "사용 가능한 아이디입니다." else "이미 사용 중인 아이디입니다."
        
        return ApiResponse.success(CheckLoginIdResponse(isAvailable, message))
    }

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<TokenResponse> {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                loginRequest.loginId,
                loginRequest.password
            )
        )

        SecurityContextHolder.getContext().authentication = authentication
        val token = jwtTokenProvider.generateToken(authentication)

        return ResponseEntity.ok(TokenResponse(token))
    }

    @GetMapping("/{userId}")
    fun retrieveUserInfo(@PathVariable userId: UUID): ResponseEntity<DataResponse<UserInfoResponse>>{
        val user = userService.retrieveUser(userId).orElseThrow { CustomException(ErrorCode.USER_NOT_FOUND) }

        val userInterestList = user.userDetail.interests.interests
            .stream()
            .map { it: InterestOption? -> it?.code?:"" }
            .collect(Collectors.toList())

        val userAge = LocalDateTime.now().year - user.userDetail.birthDate.year + 1
        
        // 보호자 정보 조회
        val nok = userService.getNokByUserId(user.id)
        val nokInfoResponse = nok?.let {
            NokInfoResponse(
                relationship = it.relationship,
                name = it.name,
                phoneNumber = it.phoneNumber
            )
        }
        val responseDto = UserInfoResponse(
            userId = user.id,
            nickname = user.nickname,
            age = userAge,
            gender = user.userDetail.gender.code,
            interests = userInterestList,
            nokInfo = nokInfoResponse
        )
        return ApiResponse.success(responseDto)
    }

    @GetMapping("/me")
    fun getMyInfo(authentication: Authentication): ResponseEntity<DataResponse<UserInfoResponse>> {
        
        val principal = authentication.principal as CustomUserDetails
        val user = principal.user 
        
        val nok = userService.getNokByUserId(user.id)
        
        val nokInfoResponse = nok?.let {
            NokInfoResponse(
                relationship = it.relationship,
                name = it.name,
                phoneNumber = it.phoneNumber
            )
        }

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
            interests = userInterestList,
            nokInfo = nokInfoResponse
        )
        return ApiResponse.success(responseDto)
    }

}
