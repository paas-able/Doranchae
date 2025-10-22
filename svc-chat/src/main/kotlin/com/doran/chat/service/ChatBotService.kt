package com.doran.chat.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
class ChatBotService(
    @Value("\${gemini.api.key}") private val apiKey: String
) {
    private val webClient = WebClient.builder()
        .baseUrl("https://generativelanguage.googleapis.com")
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build()

    fun getChatbotResponse(userMessage: String): String {
        println("🧠 [ChatBotService] user message: $userMessage")

        val requestBody = mapOf(
            "contents" to listOf(
                mapOf("parts" to listOf(mapOf("text" to userMessage)))
            )
        )

        //for debug
        val requestUri = "/v1beta/models/gemini-2.5-flash-lite:generateContent?key=$apiKey"
        println("🚀 [ChatBotService] Requesting URL: https://generativelanguage.googleapis.com$requestUri")

        return try {
            val response = webClient.post()
                .uri(requestUri)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map::class.java)
                .block()

            println("✅ [ChatBotService] response: $response")

            val candidates = response?.get("candidates") as? List<Map<String, Any>>
            val content = candidates?.get(0)?.get("content") as? Map<String, Any>
            val parts = content?.get("parts") as? List<Map<String, Any>>
            parts?.get(0)?.get("text") as? String ?: "답변을 불러오지 못했습니다."

        } catch (e: Exception) {
            println("❌ [ChatBotService] Error: ${e.message}")
            "죄송해요, 지금은 답변을 드릴 수 없어요."
        }
    }
}