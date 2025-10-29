package com.doran.user.global.auth

import com.doran.user.domain.entities.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(
    val user: User
) : UserDetails { 

    fun getUserId(): java.util.UUID = user.id

    // (이하 UserDetails 인터페이스의 필수 메소드들)

    // 사용자의 권한 목록 (일단은 비워둠)
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> = mutableListOf()

    // 사용자의 비밀번호
    override fun getPassword(): String = user.password

    // 사용자의 고유 식별자 (로그인 ID)
    override fun getUsername(): String = user.loginId

    // 계정 만료 여부 (true: 만료 안 됨)
    override fun isAccountNonExpired(): Boolean = true

    // 계정 잠김 여부 (true: 안 잠김)
    override fun isAccountNonLocked(): Boolean = true

    // 자격 증명(비밀번호) 만료 여부 (true: 만료 안 됨)
    override fun isCredentialsNonExpired(): Boolean = true

    // 계정 활성화 여부 (true: 활성화됨)
    override fun isEnabled(): Boolean = true
}