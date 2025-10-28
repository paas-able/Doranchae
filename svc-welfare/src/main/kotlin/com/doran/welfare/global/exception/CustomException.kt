package com.doran.welfare.global.exception

import com.doran.welfare.global.ErrorCode
import java.lang.RuntimeException

class CustomException (
    val errorCode: ErrorCode
) : RuntimeException() {
}