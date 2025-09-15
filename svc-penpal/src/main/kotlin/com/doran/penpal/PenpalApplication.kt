package com.doran.penpal

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PenpalApplication

fun main(args: Array<String>) {
    runApplication<PenpalApplication>(*args)
}
