package com.doran.welfare.application

import com.doran.welfare.domain.Welfare
import com.doran.welfare.domain.WelfareRepository
import com.doran.welfare.global.ErrorCode
import com.doran.welfare.global.exception.CustomException
import com.doran.welfare.infrastructure.persistence.LikeJpaRepository
import com.doran.welfare.infrastructure.persistence.ScrapJpaRepository
import com.doran.welfare.infrastructure.persistence.LikeEntity
import com.doran.welfare.infrastructure.persistence.ScrapEntity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class WelfareService(
    private val welfareRepository: WelfareRepository,
    private val likeRepository: LikeJpaRepository,
    private val scrapRepository: ScrapJpaRepository
) {
    
    fun getAllWelfares(): List<Welfare> {
        return welfareRepository.findAll()
    }
    
    fun getWelfareById(id: UUID): Welfare {
        return welfareRepository.findById(id) 
            ?: throw CustomException(ErrorCode.WELFARE_NOT_FOUND)
    }

    fun searchWelfares(theme: String?, region: String?): List<Welfare> {
        return welfareRepository.search(theme, region)
    }
    
    @Transactional
    fun addLike(welfareId: UUID, userId: String) {
        if (likeRepository.findByWelfareIdAndUserId(welfareId, userId) != null) {
            throw CustomException(ErrorCode.LIKE_ALREADY_EXISTS)
        }
        likeRepository.save(LikeEntity(welfareId = welfareId, userId = userId))
    }
    
    @Transactional
    fun removeLike(welfareId: UUID, userId: String) {
        likeRepository.deleteByWelfareIdAndUserId(welfareId, userId)
    }
    
    fun getLikeCount(welfareId: UUID): Long {
        return likeRepository.countByWelfareId(welfareId)
    }
    
    fun getMyLikes(userId: String): List<Welfare> {
        return likeRepository.findByUserId(userId).map { like ->
            welfareRepository.findById(like.welfareId)!!
        }
    }

    @Transactional
    fun addScrap(welfareId: UUID, userId: String) {
        if (scrapRepository.findByWelfareIdAndUserId(welfareId, userId) != null) {
            throw CustomException(ErrorCode.SCRAP_ALREADY_EXISTS)
        }
        scrapRepository.save(ScrapEntity(welfareId = welfareId, userId = userId))
    }
    
    @Transactional
    fun removeScrap(welfareId: UUID, userId: String) {
        scrapRepository.deleteByWelfareIdAndUserId(welfareId, userId)
    }
    
    fun getScrapCount(welfareId: UUID): Long {
        return scrapRepository.countByWelfareId(welfareId)
    }
    
    fun getMyScraps(userId: String): List<Welfare> {
        return scrapRepository.findByUserId(userId).map { scrap ->
            welfareRepository.findById(scrap.welfareId)!!
        }
    }
}