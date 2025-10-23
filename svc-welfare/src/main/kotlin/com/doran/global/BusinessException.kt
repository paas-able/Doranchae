package com.doran.welfare.global

class BusinessException(val errorCode: ErrorCode, override val message: String? = null) : RuntimeException(message)
