package com.doran.welfare.application

import com.doran.welfare.domain.LikeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

data class LikeResult(val liked: Boolean, val count: Long)

@Service
class AddLikeUseCase(
    private val likeRepository: LikeRepository
) {
    @Transactional
    fun execute(postId: Long, userId: Long): LikeResult {
        val created = likeRepository.add(postId, userId)
        val count = likeRepository.count(postId)
        return LikeResult(liked = true, count = count).copy(liked = true && created || likeRepository.exists(postId, userId))
    }
}
