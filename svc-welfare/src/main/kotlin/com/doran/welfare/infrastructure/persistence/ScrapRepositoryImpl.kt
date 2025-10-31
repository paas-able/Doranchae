package com.doran.welfare.infrastructure.persistence

import com.doran.welfare.domain.Scrap
import com.doran.welfare.domain.ScrapRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
class ScrapRepositoryImpl(
    private val jpaRepository: ScrapJpaRepository
) : ScrapRepository {

    override fun findByWelfareIdAndUserId(welfareId: String, userId: String): Scrap? {
        return jpaRepository.findByWelfareIdAndUserId(welfareId, userId)?.toDomain()
    }

    override fun findByUserId(userId: String): List<Scrap> {
        return jpaRepository.findByUserId(userId).map { it.toDomain() }
    }

    override fun findByWelfareId(welfareId: String): List<Scrap> {
        return jpaRepository.findByWelfareId(welfareId).map { it.toDomain() }
    }

    override fun save(scrap: Scrap): UUID {
        val entity = ScrapEntity(
            welfareId = scrap.welfareId,
            userId = scrap.userId,
            id = scrap.id,
            createdAt = scrap.createdAt
        )
        return jpaRepository.save(entity).id
    }

    override fun deleteByWelfareIdAndUserId(welfareId: String, userId: String) {
        jpaRepository.deleteByWelfareIdAndUserId(welfareId, userId)
    }

    override fun countByWelfareId(welfareId: String): Long {
        return jpaRepository.countByWelfareId(welfareId)
    }

    private fun ScrapEntity.toDomain(): Scrap {
        return Scrap(
            id = id,
            welfareId = welfareId,
            userId = userId,
            createdAt = createdAt
        )
    }
}
