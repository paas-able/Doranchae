package com.doran.community

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@EnableFeignClients
@SpringBootApplication
class CommunityApplication

fun main(args: Array<String>) {
    runApplication<CommunityApplication>(*args)
}
