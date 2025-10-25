package com.doran.user.domain

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SvcUserApplication

fun main(args: Array<String>) {
	runApplication<SvcUserApplication>(*args)
}
