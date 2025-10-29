package com.doran.user.domain

// --- 1. (수정) Import 문 정리 및 추가 ---
import com.doran.user.domain.entities.NOK
import com.doran.user.domain.entities.User
import com.doran.user.domain.repositories.NOKRepository
import com.doran.user.domain.repositories.UserRepository
import com.doran.user.domain.valueObjects.Interests
import com.doran.user.domain.valueObjects.UserDetails as UserValueDetails // UserDetails 별명 사용
import com.doran.user.domain.valueObjects.UserSetting
import com.doran.user.enums.Gender
import com.doran.user.enums.InterestOption
import com.doran.user.dto.JoinRequest
import com.doran.user.dto.NOKInfo
import com.doran.user.global.auth.CustomUserDetails
import com.doran.user.global.ErrorCode // ErrorCode 임포트 추가
import com.doran.user.global.exception.CustomException // CustomException 임포트 추가
import jakarta.transaction.Transactional
import org.springframework.security.core.userdetails.UserDetails // Spring Security UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder // PasswordEncoder 임포트
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    // --- 2. (수정) 생성자 주입 확인 ---
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
        // UserValueDetails (별명) 사용 확인
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

        // 비밀번호 암호화 (passwordEncoder 사용 확인)
        val encodedPassword = passwordEncoder.encode(req.password)

        // --- 3. (수정) User 객체 생성 시 모든 필드 정확히 전달 ---
        val newUser = User(
            loginId = req.loginId,
            password = encodedPassword, // 암호화된 비밀번호
            userDetail = newUserDetail,   // userDetail 전달 확인
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