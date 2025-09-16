package com.doran.penpal

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/penpal")
class PenpalController {
    @GetMapping("/hello") fun hello() = "hello from penpal"
}
