package com.doran.community.entities

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
        this.updatedAt = LocalDateTime.now()

        return this
    }

    fun updatePost(editPart: String, newTitle: String?, newContent: String?): Post {
        if (editPart == "title" && newTitle != null) {
            this.title = newTitle
        } else if (editPart == "content" && newContent != null) {
            this.content = newContent
        } else if (editPart == "both" && newTitle != null && newContent != null) {
            this.title = newTitle
            this.content = newContent
        }

        this.isEdited = true
        this.updatedAt = LocalDateTime.now()

        return this
    }
}
