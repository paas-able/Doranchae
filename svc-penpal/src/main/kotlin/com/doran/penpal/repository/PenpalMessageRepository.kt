package com.doran.penpal.repository

import com.doran.penpal.entity.Penpal
import com.doran.penpal.entity.PenpalMessage
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PenpalMessageRepository: JpaRepository<PenpalMessage, UUID> {
    fun findAllByPenpal(penpal: Penpal, pageable: Pageable): Page<PenpalMessage>
    fun deleteAllByPenpal(penpal: Penpal)
}