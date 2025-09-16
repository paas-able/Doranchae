package com.doran.welfare

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class WelfareApplication

fun main(args: Array<String>) {
    runApplication<WelfareApplication>(*args)
}
