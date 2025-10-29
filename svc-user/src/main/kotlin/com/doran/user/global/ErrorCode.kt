package com.doran.user.global

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

    // USER
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "USER4001", "해당 유저가 존재하지 않습니다."),
    USER_ID_DUPLICATED(HttpStatus.CONFLICT, "USER4002", "이미 사용중인 아이디입니다.")
}
