package com.doran.welfare.global

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
    WELFARE_NOT_FOUND(HttpStatus.NOT_FOUND, "WEL404", "Welfare information doesn't exist"),
    LIKE_ALREADY_EXISTS(HttpStatus.CONFLICT, "WEL409", "Like already exists"),
    SCRAP_ALREADY_EXISTS(HttpStatus.CONFLICT, "WEL409", "Scrap already exists");
}