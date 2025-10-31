package com.doran.welfare.infrastructure.persistence

import com.doran.welfare.domain.Welfare
import com.doran.welfare.domain.WelfareRepository
import org.springframework.stereotype.Repository

@Repository
class WelfareRepositoryImpl(
    private val jpaRepository: WelfareJpaRepository
) : WelfareRepository {

    override fun findAll(): List<Welfare> {
        return jpaRepository.findAll().map { it.toDomain() }
    }

    override fun findById(servId: String): Welfare? {
        return jpaRepository.findById(servId).orElse(null)?.toDomain()
    }

    override fun search(theme: String?, region: String?): List<Welfare> {
        return jpaRepository.findAll().map { it.toDomain() }
    }

    override fun save(welfare: Welfare): String {
        val entity = WelfareEntity(
            servId = welfare.servId,
            title = welfare.title,
            content = welfare.content,
            organization = welfare.organization,
            region = welfare.region,
            localUploadDate = welfare.localUploadDate,
            provider = welfare.provider,
            sourceUrl = welfare.sourceUrl
        )
        return jpaRepository.save(entity).servId
    }
}
