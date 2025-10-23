package com.doran.auth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class HelloController {
    @GetMapping("/hello") fun hello() = "hello from auth"
}