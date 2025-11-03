package com.doran.community.feign

import com.doran.penpal.global.DataResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import java.util.*

@FeignClient(name = "svc-user", url = "http://localhost:8080")
interface UserServiceFeignClient {
    @GetMapping("/api/internal/{userId}")
    fun getUserInfo(@PathVariable userId: UUID): DataResponse<UserInfoDetail>
}