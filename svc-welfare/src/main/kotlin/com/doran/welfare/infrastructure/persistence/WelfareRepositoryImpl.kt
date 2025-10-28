package com.doran.welfare.infrastructure.persistence

import com.doran.welfare.domain.Welfare
import com.doran.welfare.domain.WelfareRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class WelfareRepositoryImpl(
    private val jpaRepository: WelfareJpaRepository
) : WelfareRepository {
    
    override fun findAll(): List<Welfare> {
        return jpaRepository.findAll().map { it.toDomain() }
    }
    
    override fun findById(id: UUID): Welfare? {
        return jpaRepository.findById(id).orElse(null)?.toDomain()
    }
    
    override fun search(theme: String?, region: String?): List<Welfare> {
        return jpaRepository.findAll().map { it.toDomain() }
    }
    
    override fun save(welfare: Welfare): UUID {
        val entity = WelfareEntity(
            id = welfare.id,
            title = welfare.title,
            content = welfare.content,
            organization = welfare.organization,
            region = welfare.region,
            localUploadDate = welfare.localUploadDate,
            startDate = welfare.startDate,
            endDate = welfare.endDate,
            provider = welfare.provider,
            sourceUrl = welfare.sourceUrl
        )
        return jpaRepository.save(entity).id
    }
}