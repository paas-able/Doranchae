package com.doran.welfare.application

import com.doran.welfare.domain.ScrapRepository
import com.doran.welfare.presentation.api.dto.ScrapResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RemoveScrapUseCase(
    private val scrapRepository: ScrapRepository
) {
    @Transactional
    fun execute(postId: Long, userId: Long): ScrapResponse {
        scrapRepository.remove(postId, userId)
        val count = scrapRepository.count(postId)
        return ScrapResponse(scrapped = false, count = count)
    }
}
