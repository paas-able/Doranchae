package com.doran.user.domain.entities

import com.doran.user.domain.valueObjects.UserDetails
import com.doran.user.domain.valueObjects.UserSetting
import jakarta.persistence.*
//import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "user")
data class User(
    @Id
    @Column(columnDefinition = "binary(16)")
    val id: UUID = UUID.randomUUID(),
    val loginId: String,
    val password: String,

    @Embedded
    val userDetail: UserDetails,

    @Embedded
    val userSetting: UserSetting,

    val createdAt: LocalDateTime = LocalDateTime.now(),
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    /*fun isPasswordEqual(inputPassword: String, passwordEncoder: PasswordEncoder): Boolean {
        return passwordEncoder.matches(inputPassword, this.password)
    }*/

    fun updateTimestamp() {
        this.updatedAt = LocalDateTime.now()
    }
}
