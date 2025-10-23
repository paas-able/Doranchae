package com.doran.welfare.global

import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.BindException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException::class)
    fun handleBusiness(e: BusinessException) =
        ApiResponse.failure(e.errorCode, e.message)

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValid(e: MethodArgumentNotValidException) =
        ApiResponse.failure(
            ErrorCode.COMM4001,
            e.bindingResult.fieldErrors.joinToString { "${it.field}: ${it.defaultMessage}" }
        )

    @ExceptionHandler(BindException::class)
    fun handleBind(e: BindException) =
        ApiResponse.failure(
            ErrorCode.COMM4001,
            e.bindingResult.fieldErrors.joinToString { "${it.field}: ${it.defaultMessage}" }
        )

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleNotReadable(e: HttpMessageNotReadableException) =
        ApiResponse.failure(ErrorCode.COMM4001, "요청 본문을 읽을 수 없습니다.")

    @ExceptionHandler(Exception::class)
    fun handleEtc(e: Exception) =
        ApiResponse.failure(ErrorCode.COMM5001)
}
