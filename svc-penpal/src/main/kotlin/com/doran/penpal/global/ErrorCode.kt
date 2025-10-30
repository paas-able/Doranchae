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

    // Penpal
    PENPAL_NOT_FOUND(HttpStatus.BAD_REQUEST, "PENP4001", "해당 펜팔이 존재하지 않습니다."),
    PENPAL_ALREADY_INACTIVE(HttpStatus.BAD_REQUEST, "PENP4002", "이미 비활성화 된 펜팔입니다"),
    NOT_YOUR_PENPAL(HttpStatus.UNAUTHORIZED, "PENP4011", "펜팔에 대한 권한이 없습니다")
}