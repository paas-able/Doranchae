package com.doran.user.domain

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
@ComponentScan(basePackages = ["com.doran.user.config", "com.doran.user.domain"])
class SvcUserApplication

fun main(args: Array<String>) {
	runApplication<SvcUserApplication>(*args)
}
