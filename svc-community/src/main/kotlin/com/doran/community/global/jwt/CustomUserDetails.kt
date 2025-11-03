package com.doran.community.global.jwt

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.User

class CustomUserDetails(
    val userId: String, // 실제 DB ID
    username: String,   // 로그인 ID (claims.subject)
    authorities: MutableCollection<out GrantedAuthority> = mutableListOf()
) : User(username, "", authorities)