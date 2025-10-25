package com.doran.auth
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HealthController { @GetMapping("/healthz") fun health() = "ok" }