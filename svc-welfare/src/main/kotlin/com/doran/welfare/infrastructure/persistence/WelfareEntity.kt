package com.doran.welfare.infrastructure.persistence

import com.doran.welfare.domain.Welfare
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "welfare")
class WelfareEntity(

    @Id
    @Column(name = "servId", length = 50)
    val servId: String,

    @Column(nullable = false)
    val title: String,

    @Column(columnDefinition = "TEXT")
    val content: String? = null,

    @Column
    val organization: String? = null,

    @Column
    val region: String? = null,

    @Column(name = "local_upload_date")
    val localUploadDate: LocalDate? = null,

    @Column
    val provider: String? = null,

    @Column(name = "source_url", length = 1024)
    val sourceUrl: String? = null
) {
    // 🔸 JPA 기본 생성자 (필수)
    protected constructor() : this(
        servId = "",
        title = ""
    )

    fun toDomain(): Welfare {
        return Welfare(
            servId = servId,
            title = title,
            content = content,
            organization = organization,
            region = region,
            localUploadDate = localUploadDate,
            provider = provider,
            sourceUrl = sourceUrl
        )
    }
}
