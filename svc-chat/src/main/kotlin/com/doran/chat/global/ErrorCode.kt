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
    CHAT_ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "CH002", "채팅방을 찾을 수 없습니다."),
    CHAT_ROOM_INACTIVATED(HttpStatus.BAD_REQUEST,"CH003","비활성화된 채팅입니다."),

    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH001","유효하지 않은 토큰입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED,"AUTH002","인증되지 않은 요청입니다."),
    PARSE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"AUTH003","토큰 파싱 중 문제가 발생했습니다.")
}