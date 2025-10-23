package com.doran.welfare.domain

interface ScrapRepository {
    fun add(postId: Long, userId: Long): Boolean
    fun remove(postId: Long, userId: Long): Boolean
    fun exists(postId: Long, userId: Long): Boolean
    fun count(postId: Long): Long
}
