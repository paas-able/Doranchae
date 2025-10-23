package com.doran.welfare.infrastructure.persistence.jpa.springdata

import com.doran.welfare.infrastructure.persistence.jpa.entity.WelfarePostJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface SpringDataPostJpa : JpaRepository<WelfarePostJpaEntity, Long>
