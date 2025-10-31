package com.doran.welfare.application

import com.doran.welfare.domain.*
import com.doran.welfare.global.ErrorCode
import com.doran.welfare.global.exception.CustomException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.*

@Service
class WelfareService(
    private val welfareRepository: WelfareRepository,
    private val likeRepository: LikeRepository,
    private val scrapRepository: ScrapRepository
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    fun getAllWelfares(): List<Welfare> {
        return welfareRepository.findAll()
    }

    fun getWelfareById(servId: String): Welfare {
        return welfareRepository.findById(servId)
            ?: throw CustomException(ErrorCode.WELFARE_NOT_FOUND)
    }

    fun searchWelfares(theme: String?, region: String?): List<Welfare> {
        return welfareRepository.search(theme, region)
    }

    // ==================== LIKE ====================
    @Transactional
    fun addLike(servId: String, userId: String) {
        val existingLike = likeRepository.findByWelfareIdAndUserId(servId, userId)
        if (existingLike != null)
            throw CustomException(ErrorCode.LIKE_ALREADY_EXISTS)

        welfareRepository.findById(servId)
            ?: throw CustomException(ErrorCode.WELFARE_NOT_FOUND)

        val like = Like(
            id = UUID.randomUUID(),
            welfareId = servId,
            userId = userId,
            createdAt = LocalDateTime.now()
        )
        likeRepository.save(like)
    }

    @Transactional
    fun removeLike(servId: String, userId: String) {
        likeRepository.deleteByWelfareIdAndUserId(servId, userId)
    }

    fun getLikeCount(servId: String): Long {
        return likeRepository.countByWelfareId(servId)
    }

    fun getMyLikes(userId: String): List<Welfare> {
        val likes = likeRepository.findByUserId(userId)
        return likes.mapNotNull { like -> welfareRepository.findById(like.welfareId) }
    }

    // ==================== SCRAP ====================
    @Transactional
    fun addScrap(servId: String, userId: String) {
        val existingScrap = scrapRepository.findByWelfareIdAndUserId(servId, userId)
        if (existingScrap != null)
            throw CustomException(ErrorCode.SCRAP_ALREADY_EXISTS)

        welfareRepository.findById(servId)
            ?: throw CustomException(ErrorCode.WELFARE_NOT_FOUND)

        val scrap = Scrap(
            id = UUID.randomUUID(),
            welfareId = servId,
            userId = userId,
            createdAt = LocalDateTime.now()
        )
        scrapRepository.save(scrap)
    }

    @Transactional
    fun removeScrap(servId: String, userId: String) {
        scrapRepository.deleteByWelfareIdAndUserId(servId, userId)
    }

    fun getScrapCount(servId: String): Long {
        return scrapRepository.countByWelfareId(servId)
    }

    fun getMyScraps(userId: String): List<Welfare> {
        val scraps = scrapRepository.findByUserId(userId)
        return scraps.mapNotNull { scrap -> welfareRepository.findById(scrap.welfareId) }
    }
}
