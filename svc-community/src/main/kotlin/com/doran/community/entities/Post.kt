package com.doran.community.entities

import com.doran.penpal.global.ErrorCode
import com.doran.penpal.global.exception.CustomException
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "post")
data class Post(
    @Id
    @Column(columnDefinition = "binary(16)")
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    var title: String,

    @Column(nullable = false)
    var content: String,

    @Column(columnDefinition = "binary(16)", nullable = false)
    val authorId: UUID,

    var likes: Int = 0,

    var isEdited: Boolean = false,

    val createdAt: LocalDateTime = LocalDateTime.now(),

    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun updateLikes(isClicked: Boolean): Post{
        if (isClicked) {
            this.likes += 1
        } else {
            this.likes -= 1
        }
        return this
    }

    fun updatePost(editPart: String, newTitle: String?, newContent: String?): Post {
        if (this.isEdited) {
            throw CustomException(ErrorCode.POST_ALREADY_EDITED)
        }

        if (editPart == "title" && newTitle != null) {
            this.title = newTitle
        } else if (editPart == "content" && newContent != null) {
            this.content = newContent
        } else if (editPart == "both" && newTitle != null && newContent != null) {
            this.title = newTitle
            this.content = newContent
        }

        return this
    }
}
