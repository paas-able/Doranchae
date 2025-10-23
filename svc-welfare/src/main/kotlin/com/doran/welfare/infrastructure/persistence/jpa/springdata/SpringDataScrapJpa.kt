package com.doran.welfare.infrastructure.persistence.jpa.springdata

import com.doran.welfare.infrastructure.persistence.jpa.entity.WelfareScrapJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface SpringDataScrapJpa : JpaRepository<WelfareScrapJpaEntity, Long> {
    fun existsByPostIdAndUserId(postId: Long, userId: Long): Boolean
    fun countByPostId(postId: Long): Long
    fun deleteByPostIdAndUserId(postId: Long, userId: Long): Long
}
