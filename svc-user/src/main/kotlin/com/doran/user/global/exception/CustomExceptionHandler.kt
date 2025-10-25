package com.doran.penpal.global.exception

import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime

@RestControllerAdvice
class CustomExceptionHandler {
    @ExceptionHandler(CustomException::class)
    fun customExceptionHandler(e: CustomException): ResponseEntity<Map<String, Any>> {
        val body = mapOf(
            "timestamp" to LocalDateTime.now(),
            "code" to e.errorCode.code,
            "message" to e.errorCode.message
        )
        return ResponseEntity.status(e.errorCode.httpStatus).body(body)
    }

    @ExceptionHandler(RuntimeException::class)
    fun handleRuntimeException(e: RuntimeException): ResponseEntity<Map<String, String>> {
        val body = mapOf(
            "message" to "An unexpected error occurred: ${e.message}"
        )
        return ResponseEntity
            .status(500)
            .body(body)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(e: MethodArgumentNotValidException): ResponseEntity<Map<String, Any>> {
        val errors = e.bindingResult.allErrors.associate { error ->
            val field = (error as? FieldError)?.field
            val message = error.defaultMessage
            field to message
        }

        val body = mapOf(
            "code" to "COMM400",
            "message" to "Validation failed",
            "errors" to errors
        )
        return ResponseEntity
            .badRequest()
            .body(body)
    }
}