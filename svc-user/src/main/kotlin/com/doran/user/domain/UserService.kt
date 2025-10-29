package com.doran.user.domain

import com.doran.user.domain.entities.NOK
import com.doran.user.domain.entities.User
import com.doran.user.domain.repositories.NOKRepository
import com.doran.user.domain.repositories.UserRepository
import com.doran.user.domain.valueObjects.Interests
import com.doran.user.domain.valueObjects.UserDetails as UserValueDetails
import com.doran.user.domain.valueObjects.UserSetting
import com.doran.user.enums.Gender
import com.doran.user.enums.InterestOption
import com.doran.user.dto.JoinRequest
import com.doran.user.dto.NOKInfo
import com.doran.user.global.auth.CustomUserDetails
import com.doran.user.global.ErrorCode
import com.doran.user.global.exception.CustomException 
import jakarta.transaction.Transactional
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder 
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    private val userRepository: UserRepository, 
    private val nokRepository: NOKRepository,   
    private val passwordEncoder: PasswordEncoder // passwordEncoder 주입 확인
) : UserDetailsService {

    @Transactional
    fun createUser(req: JoinRequest) : User {
        
        // 중복 아이디 검사
        if (userRepository.findByLoginId(req.loginId) != null) {
            throw CustomException(ErrorCode.USER_ID_DUPLICATED)
        }

        val interestSet = mutableSetOf(
            InterestOption.fromCode(req.interests.interest1),
            InterestOption.fromCode(req.interests.interest2),
            InterestOption.fromCode(req.interests.interest3),
        )
        val newInterests = Interests(interestSet)

        val newUserDetail = UserValueDetails(
            name = req.userDetail.name,
            birthDate = req.userDetail.birthDate,
            gender = Gender.fromCode(req.userDetail.gender)!!,
            phoneNumber = req.userDetail.phoneNumber,
            interests = newInterests
        )

        val newUserSetting = UserSetting(
            termsAgree = req.userSetting.termsAgree,
            notificationNOK = req.userSetting.notificationNOK,
            notificationPush = req.userSetting.notificationPush,
            notificationSMS = req.userSetting.notificationSMS
        )

        val encodedPassword = passwordEncoder.encode(req.password)

        val newUser = User(
            loginId = req.loginId,
            password = encodedPassword,
            userDetail = newUserDetail, 
            userSetting = newUserSetting,
            nickname = req.nickname
        )

        return userRepository.save(newUser)
    }

    @Transactional
    fun createNOK(req: NOKInfo, user: User): NOK {
        val newNOK = NOK(
            relationship = req.relationship,
            name = req.name,
            phoneNumber = req.phoneNumber,
            user = user
        )
        return nokRepository.save(newNOK)
    }

    @Transactional
    fun retrieveUser(userId: UUID): Optional<User> {
        return userRepository.findById(userId)
    }

    @Transactional
    override fun loadUserByUsername(loginId: String): UserDetails {
        val user = userRepository.findByLoginId(loginId)
            ?: throw UsernameNotFoundException("User not found with loginId: $loginId")
        return CustomUserDetails(user)
    }

    //랜덤유저
    @Transactional 
    fun findRandomUserId(): Optional<UUID> {
        return userRepository.findRandomUserId()
    }
}