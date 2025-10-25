package com.doran.user.domain.repositories

import com.doran.user.domain.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository :JpaRepository<User, UUID>{
}