package com.doran.penpal.feign

import com.doran.penpal.global.DataResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import java.util.UUID

@FeignClient(name = "svc-user", url = "http://localhost:8080")
interface UserServiceFeignClient {

    @GetMapping("/api/internal/randFriend")
    fun getRandomFriend(@RequestParam("excludeIds") excludeIds: MutableList<String>): DataResponse<UserIdData>
}

data class UserIdData (
    val userId: UUID
)