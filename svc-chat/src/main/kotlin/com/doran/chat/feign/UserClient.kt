package com.doran.chat.feign

import com.doran.chat.dto.ChatDto
import com.doran.chat.global.DataResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import java.util.UUID

@FeignClient(name = "svc-user", url="http://localhost:8080")
interface UserClient {

    @GetMapping("/api/internal/{userId}")
    fun getUserDetail(@PathVariable("userId") userId: UUID): DataResponse<ChatDto.UserDetailDto>
}