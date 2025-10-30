package com.doran.user.global.exception

import com.doran.user.global.ErrorCode
import java.lang.RuntimeException

class CustomException (
    val errorCode: ErrorCode
) : RuntimeException() {
}