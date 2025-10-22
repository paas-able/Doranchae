package com.doran.penpal.global

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val httpStatus: HttpStatus,
    val code: String,
    val message: String
){
    // COMMON ERROR
    COMMON_NOT_FOUND(HttpStatus.NOT_FOUND, "COMM404", "Resource not found"),
    COMMON_BAD_REQUEST(HttpStatus.BAD_REQUEST, "COMM400", "Bad Request"),
    COMMON_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "COMM401", "Unauthorized"),
    COMMON_INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMM500", "Internal Server Error"),

    // COMMUNITY
    POST_ALREADY_EDITED(HttpStatus.BAD_REQUEST, "POST4001", "수정은 1회만 가능합니다"),
    POST_NOT_FOUND(HttpStatus.BAD_REQUEST, "POST4002", "해당 게시글이 존재하지 않습니다"),
    WRONG_EDIT_PART(HttpStatus.BAD_REQUEST, "POST4003", "허용되지 않은 수정 범위입니다."),
    COMMENT_NOT_FOUND(HttpStatus.BAD_REQUEST, "POST4004", "해당 댓글이 존재하지 않습니다"),
}