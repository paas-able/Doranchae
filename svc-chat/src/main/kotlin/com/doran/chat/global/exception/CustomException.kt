package com.doran.chat.global.exception

import com.doran.chat.global.ErrorCode
import java.lang.RuntimeException

class CustomException (
    val errorCode: ErrorCode
) : RuntimeException() {
}