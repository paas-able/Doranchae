package com.doran.user.domain

import com.doran.user.domain.entities.NOK
import com.doran.user.domain.entities.User
import com.doran.user.domain.repositories.NOKRepository
import com.doran.user.domain.repositories.UserRepository
import com.doran.user.domain.valueObjects.Interests
import com.doran.user.domain.valueObjects.UserDetails
import com.doran.user.domain.valueObjects.UserSetting
import com.doran.user.enums.Gender
import com.doran.user.enums.InterestOption
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserService(
    val userRepository: UserRepository,
    val nokRepository: NOKRepository
) {
    @Transactional
    fun createUser(req: JoinRequest) : User{
        val interestSet = mutableSetOf(
            InterestOption.fromCode(req.interests.interest1),
            InterestOption.fromCode(req.interests.interest2),
            InterestOption.fromCode(req.interests.interest3),
        )
        val newInterests = Interests(interestSet)
        val newUserDetail = UserDetails(
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

        val newUser = User(
            loginId = req.loginId,
            password = req.password, // TODO: 암호화 코드 추가
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
}