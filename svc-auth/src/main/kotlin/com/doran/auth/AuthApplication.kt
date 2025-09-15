package com.doran.auth

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SvcAuthApplication

fun main(args: Array<String>) {
	runApplication<SvcAuthApplication>(*args)
}
