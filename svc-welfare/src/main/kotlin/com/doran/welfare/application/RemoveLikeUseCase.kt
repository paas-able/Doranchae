package com.doran.welfare.application

import com.doran.welfare.domain.LikeRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RemoveLikeUseCase(
    private val likeRepository: LikeRepository
) {
    @Transactional
    fun execute(postId: Long, userId: Long): LikeResult {
        likeRepository.remove(postId, userId)
        val count = likeRepository.count(postId)
        return LikeResult(liked = false, count = count)
    }
}
