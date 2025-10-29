package com.doran.user.domain.repositories

import com.doran.user.domain.entities.NOK
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface NOKRepository: JpaRepository<NOK, UUID> {
}