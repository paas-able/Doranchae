package com.doran.penpal.repository

import com.doran.penpal.entity.Penpal
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
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

    fun findPenpalByParticipantIdsContaining(userId: UUID, pageable: Pageable): Page<Penpal>

    @Query(
        value = """
        SELECT BIN_TO_UUID(pp2.participant_id)
        FROM penpal_participants pp2
        WHERE pp2.penpal_id IN (
            SELECT pp1.penpal_id 
            FROM penpal_participants pp1
            WHERE pp1.participant_id = :myUserId
        )
        AND pp2.participant_id != :myUserId
    """,
        nativeQuery = true
    )
    fun findExistingFriendIds(@Param("myUserId") myUserId: UUID): MutableList<String>
}