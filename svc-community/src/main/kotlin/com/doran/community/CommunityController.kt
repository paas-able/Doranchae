package com.doran.community

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/community")
class CommunityController {
    @GetMapping("/hello") fun hello() = "hello from community"
}
