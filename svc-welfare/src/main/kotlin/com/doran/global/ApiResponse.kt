package com.doran.welfare.global

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

data class ApiResponse<T>(
    val success: Boolean,
    val code: String,
    val message: String,
    val data: T? = null
) {
    companion object {
        // 일반적인 성공 (데이터 포함)
        fun <T> success(data: T): ResponseEntity<ApiResponse<T>> =
            ResponseEntity.ok(ApiResponse(success = true, code = "OK", message = "성공", data = data))

        // data가 필요 없는 성공
        fun successWithNoData(): ResponseEntity<ApiResponse<Unit>> =
            ResponseEntity.ok(ApiResponse(success = true, code = "OK", message = "성공", data = null))

        // 실패
        fun failure(errorCode: ErrorCode, detailMessage: String? = null): ResponseEntity<ApiResponse<Unit>> =
            ResponseEntity
                .status(errorCode.httpStatus)
                .body(
                    ApiResponse(
                        success = false,
                        code = errorCode.code,
                        message = detailMessage ?: errorCode.message,
                        data = null
                    )
                )
    }
}
