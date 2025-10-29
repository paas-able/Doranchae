package com.doran.welfare.application

import com.doran.welfare.domain.Welfare
import com.doran.welfare.domain.WelfareRepository
import com.doran.welfare.domain.Like
import com.doran.welfare.domain.LikeRepository
import com.doran.welfare.domain.Scrap
import com.doran.welfare.domain.ScrapRepository
import com.doran.welfare.global.ErrorCode
import com.doran.welfare.global.exception.CustomException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID

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
    
    fun getWelfareById(id: UUID): Welfare {
        return welfareRepository.findById(id) 
            ?: throw CustomException(ErrorCode.WELFARE_NOT_FOUND)
    }

    fun searchWelfares(theme: String?, region: String?): List<Welfare> {
        return welfareRepository.search(theme, region)
    }
    
    // ==================== LIKE ====================
    @Transactional
    fun addLike(welfareId: UUID, userId: String) {
        logger.info("중복 체크 시작: welfareId=$welfareId, userId=$userId")
        
        // 중복 확인
        val existingLike = likeRepository.findByWelfareIdAndUserId(welfareId, userId)
        logger.info("조회 결과: $existingLike")
        
        if (existingLike != null) {
            logger.warn("이미 좋아요함: welfareId=$welfareId, userId=$userId")
            throw CustomException(ErrorCode.LIKE_ALREADY_EXISTS)
        }
        
        // 복지정보 존재 확인
        welfareRepository.findById(welfareId) 
            ?: throw CustomException(ErrorCode.WELFARE_NOT_FOUND)
        
        // Like 생성 및 저장
        val like = Like(
            id = UUID.randomUUID(),
            welfareId = welfareId,
            userId = userId,
            createdAt = LocalDateTime.now()
        )
        logger.info("Like 저장: $like")
        likeRepository.save(like)
        logger.info("Like 저장 완료")
    }
    
    @Transactional
    fun removeLike(welfareId: UUID, userId: String) {
        logger.info("Like 삭제: welfareId=$welfareId, userId=$userId")
        likeRepository.deleteByWelfareIdAndUserId(welfareId, userId)
    }
    
    fun getLikeCount(welfareId: UUID): Long {
        val count = likeRepository.countByWelfareId(welfareId)
        logger.info("Like 개수: welfareId=$welfareId, count=$count")
        return count
    }
    
    fun getMyLikes(userId: String): List<Welfare> {
        val likes = likeRepository.findByUserId(userId)
        logger.info("📋 사용자 Like 목록: userId=$userId, count=${likes.size}")
        return likes.mapNotNull { like ->
            welfareRepository.findById(like.welfareId)
        }
    }

    // ==================== SCRAP ====================
    @Transactional
    fun addScrap(welfareId: UUID, userId: String) {
        logger.info("스크랩 중복 체크 시작: welfareId=$welfareId, userId=$userId")
        
        // 중복 확인
        val existingScrap = scrapRepository.findByWelfareIdAndUserId(welfareId, userId)
        logger.info("조회 결과: $existingScrap")
        
        if (existingScrap != null) {
            logger.warn("이미 스크랩함: welfareId=$welfareId, userId=$userId")
            throw CustomException(ErrorCode.SCRAP_ALREADY_EXISTS)
        }
        
        // 복지정보 존재 확인
        welfareRepository.findById(welfareId) 
            ?: throw CustomException(ErrorCode.WELFARE_NOT_FOUND)
        
        // Scrap 생성 및 저장
        val scrap = Scrap(
            id = UUID.randomUUID(),
            welfareId = welfareId,
            userId = userId,
            createdAt = LocalDateTime.now()
        )
        logger.info("Scrap 저장: $scrap")
        scrapRepository.save(scrap)
        logger.info("Scrap 저장 완료")
    }
    
    @Transactional
    fun removeScrap(welfareId: UUID, userId: String) {
        logger.info("Scrap 삭제: welfareId=$welfareId, userId=$userId")
        scrapRepository.deleteByWelfareIdAndUserId(welfareId, userId)
    }
    
    fun getScrapCount(welfareId: UUID): Long {
        val count = scrapRepository.countByWelfareId(welfareId)
        logger.info("Scrap 개수: welfareId=$welfareId, count=$count")
        return count
    }
    
    fun getMyScraps(userId: String): List<Welfare> {
        val scraps = scrapRepository.findByUserId(userId)
        logger.info("사용자 Scrap 목록: userId=$userId, count=${scraps.size}")
        return scraps.mapNotNull { scrap ->
            welfareRepository.findById(scrap.welfareId)
        }
    }
}