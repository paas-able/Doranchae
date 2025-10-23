package com.doran.welfare.domain

interface PostRepository {
    fun findAll(): List<Post>
    fun findById(id: Long): Post?
}
