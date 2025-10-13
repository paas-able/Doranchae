package com.doran.welfare.domain

interface LikeRepository {
    fun add(postId: Long, userId: Long): Boolean   // true: 새로 생성, false: 이미 있었음
    fun remove(postId: Long, userId: Long): Boolean // true: 삭제됨, false: 없었음
    fun exists(postId: Long, userId: Long): Boolean
    fun count(postId: Long): Long
}
