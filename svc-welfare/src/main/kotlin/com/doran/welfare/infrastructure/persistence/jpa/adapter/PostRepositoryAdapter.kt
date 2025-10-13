package com.doran.welfare.infrastructure.persistence.jpa.adapter

import com.doran.welfare.domain.Post
import com.doran.welfare.domain.PostRepository
import com.doran.welfare.infrastructure.persistence.jpa.entity.WelfarePostJpaEntity
import com.doran.welfare.infrastructure.persistence.jpa.springdata.SpringDataPostJpa
import org.springframework.stereotype.Component

@Component
class PostRepositoryAdapter(
    private val jpa: SpringDataPostJpa
) : PostRepository {

    override fun findAll(): List<Post> =
        jpa.findAll().map { it.toDomain() }

    override fun findById(id: Long): Post? =
        jpa.findById(id).orElse(null)?.toDomain()

    private fun WelfarePostJpaEntity.toDomain() =
        Post(
            id = requireNotNull(id),
            title = title,
            content = content,
            category = category
        )
}
