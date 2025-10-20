package com.doran.chat.global

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

    //CHATBOT
    CHAT_DUPLICATE_ROOM(HttpStatus.BAD_REQUEST, "CH001", "이미 두 유저의 채팅방이 존재합니다."),
    CHAT_ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "CH002", "채팅방을 찾을 수 없습니다.")
}