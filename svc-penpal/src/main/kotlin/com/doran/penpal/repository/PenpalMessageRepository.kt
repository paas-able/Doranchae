package com.doran.penpal.repository

import com.doran.penpal.entity.PenpalMessage
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PenpalMessageRepository: JpaRepository<PenpalMessage, UUID> {
}