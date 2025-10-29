package com.doran.user.global
import org.springframework.http.ResponseEntity

data class BaseResponse (
    val isSuccess: Boolean,
    val code: String,
    val message: String
)

data class DataResponse<T> (
    val isSuccess: Boolean,
    val code: String,
    val message: String,
    val data: T?
)

object ApiResponse {
    fun <T> success(data: T): ResponseEntity<DataResponse<T>> {
        return ResponseEntity.ok(DataResponse(true, "200", "Success", data))
    }

    fun successWithNoData(): ResponseEntity<BaseResponse> {
        return ResponseEntity.ok(BaseResponse(true, "200", "Success"))
    }

    fun failure(errorCode: ErrorCode): ResponseEntity<BaseResponse> {
        return ResponseEntity.status(errorCode.httpStatus).body(BaseResponse(false, errorCode.code, errorCode.message))
    }
}