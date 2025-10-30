package com.doran.chat.domain.service

import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient

@Component
class FunctionCallHandler{
    private val webClient = WebClient.create()

    fun handleFunctionCall(functionName: String, args: Map<String, Any>, userJwt: String): String {
        return when (functionName) {
            "create_post" -> createPost(args["title"] as String, args["content"] as String, userJwt)
            else -> "알 수 없는 기능입니다."
        }
    }

    private fun createPost(title: String, content: String, userJwt: String): String {
        val body = mapOf("title" to title, "content" to content)

        try {
            val response = webClient.post()
                .uri("http://localhost:8080/api/community/post")
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, "Bearer $userJwt")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map::class.java)
                .block()

            return "게시글 작성 완료: ${response?.get("message") ?: "성공"}"
        } catch (e: Exception) {
            return "게시글 작성 중 오류가 발생했습니다: ${e.message}"
        }
    }
}