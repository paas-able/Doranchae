package com.doran.welfare.infrastructure.persistence

import com.doran.welfare.domain.Welfare
import com.doran.welfare.domain.WelfareRepository
import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "welfare")
class WelfareEntity protected constructor() {
    @Id
    @Column(columnDefinition = "BINARY(16)")
    lateinit var id: UUID

    @Column(nullable = false)
    lateinit var title: String

    @Column(nullable = false, columnDefinition = "TEXT")
    lateinit var content: String

    @Column(nullable = false)
    lateinit var organization: String

    @Column(nullable = false)
    lateinit var region: String

    @Column(nullable = false)
    lateinit var localUploadDate: LocalDate

    @Column(nullable = false)
    lateinit var startDate: LocalDate

    @Column(nullable = true)
    var endDate: LocalDate? = null

    @Column(nullable = false)
    lateinit var provider: String

    @Column(name = "source_url")
    lateinit var sourceUrl: String

    constructor(
        id: UUID,
        title: String,
        content: String,
        organization: String,
        region: String,
        localUploadDate: LocalDate,
        startDate: LocalDate,
        endDate: LocalDate?,
        provider: String,
        sourceUrl: String
    ) : this() {
        this.id = id
        this.title = title
        this.content = content
        this.organization = organization
        this.region = region
        this.localUploadDate = localUploadDate
        this.startDate = startDate
        this.endDate = endDate
        this.provider = provider
        this.sourceUrl = sourceUrl
    }

    fun toDomain(): Welfare {
        return Welfare(
            id = id,
            title = title,
            content = content,
            organization = organization,
            region = region,
            localUploadDate = localUploadDate,
            startDate = startDate,
            endDate = endDate,
            provider = provider,
            sourceUrl = sourceUrl
        )
    }
}