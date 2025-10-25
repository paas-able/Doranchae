package com.doran.penpal.global.exception

import com.doran.penpal.global.ErrorCode
import java.lang.RuntimeException

class CustomException (
    val errorCode: ErrorCode
) : RuntimeException() {
}