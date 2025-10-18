package com.doran.penpal.repository

import com.doran.penpal.entity.Penpal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface PenpalRepository: JpaRepository<Penpal, UUID> {

    @Query("select p from Penpal p " +
            "join p.participantIds participant " +
            "where participant in :participantIds " +
            "group by p having count(*) = :count")
    fun findPenpalByParticipants(
        @Param("participantIds") participantIds: Set<UUID>,
        @Param("count") count: Long = 2L
    ): Optional<Penpal>
}