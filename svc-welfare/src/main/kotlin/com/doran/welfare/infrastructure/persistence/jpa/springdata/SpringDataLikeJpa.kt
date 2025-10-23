package com.doran.welfare.infrastructure.persistence.jpa.springdata

import com.doran.welfare.infrastructure.persistence.jpa.entity.WelfareLikeJpaEntity
import org.springframework.data.jpa.repository.JpaRepository

interface SpringDataLikeJpa : JpaRepository<WelfareLikeJpaEntity, Long> {
    fun existsByPostIdAndUserId(postId: Long, userId: Long): Boolean
    fun countByPostId(postId: Long): Long
    fun deleteByPostIdAndUserId(postId: Long, userId: Long): Long
    fun findByPostIdAndUserId(postId: Long, userId: Long): WelfareLikeJpaEntity?
}
