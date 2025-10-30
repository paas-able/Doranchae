package com.doran.user.domain.repositories

import com.doran.user.domain.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.Query
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, UUID> {
    
    fun findByLoginId(loginId: String): User?

    @Query(value = "SELECT BIN_TO_UUID(id) FROM user ORDER BY RAND() LIMIT 1", nativeQuery = true)
    fun findRandomUserId(): Optional<UUID>
}