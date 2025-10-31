package com.doran.welfare.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository

interface WelfareJpaRepository : JpaRepository<WelfareEntity, String>
