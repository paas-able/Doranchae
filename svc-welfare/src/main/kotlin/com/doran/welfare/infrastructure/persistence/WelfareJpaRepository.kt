package com.doran.welfare.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface WelfareJpaRepository : JpaRepository<WelfareEntity, UUID>