package com.doran.welfare

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/welfare")
class WelfareController {
    @GetMapping("/hello") fun hello() = "hello from welfare"
}
