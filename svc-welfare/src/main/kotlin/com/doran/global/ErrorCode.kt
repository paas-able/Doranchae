package com.doran.welfare.global

import org.springframework.http.HttpStatus

enum class ErrorCode(
    val httpStatus: HttpStatus,
    val code: String,
    val message: String
) {
    // 공통
    COMM4001(HttpStatus.BAD_REQUEST, "COMM4001", "잘못된 요청입니다."),
    COMM5001(HttpStatus.INTERNAL_SERVER_ERROR, "COMM5001", "서버 내부 오류입니다."),

    // Welfare 도메인 (WEL*)
    WEL4041(HttpStatus.NOT_FOUND, "WEL4041", "대상 리소스를 찾을 수 없습니다."),
    WEL4091(HttpStatus.CONFLICT, "WEL4091", "이미 처리된 상태입니다."),
    WEL4001(HttpStatus.BAD_REQUEST, "WEL4001", "처리할 수 없는 요청입니다."),

    // 좋아요/스크랩 전용 예시
    WEL_LIKE_NOT_FOUND(HttpStatus.BAD_REQUEST, "WEL4002", "취소할 좋아요가 존재하지 않습니다."),
    WEL_SCRAP_NOT_FOUND(HttpStatus.BAD_REQUEST, "WEL4003", "취소할 스크랩이 존재하지 않습니다.")
}
