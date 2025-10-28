package com.doran.chat.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import java.util.*
import java.util.concurrent.ConcurrentHashMap

@Service
class ChatBotService(
    private val functionCallHandler: FunctionCallHandler,
    @Value("\${gemini.api.key}") private val apiKey: String
) {
    private val webClient = WebClient.builder()
        .baseUrl("https://generativelanguage.googleapis.com/v1beta")
        .build()

    private val conversationHistory = ConcurrentHashMap<UUID, MutableList<Map<String, Any>>>()

    private val systemInstruction = mapOf(
        "parts" to listOf(mapOf("text" to """
            You are a chatbot that helps users interact with the community service.
            You can create posts via function.
            Maintain friendly tone in Korean.
        """.trimIndent()))
    )

    private val tools = listOf(
        mapOf(
            "functionDeclarations" to listOf(
                mapOf(
                    "name" to "create_post",
                    "description" to "커뮤니티에 새 게시글을 작성합니다.",
                    "parameters" to mapOf(
                        "type" to "OBJECT",
                        "properties" to mapOf(
                            "title" to mapOf("type" to "STRING", "description" to "게시글 제목"),
                            "content" to mapOf("type" to "STRING", "description" to "게시글 내용")
                        ),
                        "required" to listOf("title", "content")
                    )
                )//,
//                mapOf(
//                    "name" to "search_post",
//                    "description" to "커뮤니티에서 특정 키워드로 게시글을 검색합니다.",
//                    "parameters" to mapOf(
//                        "type" to "OBJECT",
//                        "properties" to mapOf(
//                            "query" to mapOf("type" to "STRING", "description" to "검색할 키워드")
//                        ),
//                        "required" to listOf("query")
//                    )
//                )
            )
        )
    )

    fun getChatbotResponse(userId: UUID, userMessage: String): String {
        println("🧠 [ChatBotService] user($userId) message: $userMessage")

        val messages = conversationHistory.getOrPut(userId) { mutableListOf() }

        messages.add(mapOf("role" to "user", "parts" to listOf(mapOf("text" to userMessage))))

        val firstResponse = callGeminiApi(messages)

        val firstCandidate = (firstResponse?.get("candidates") as? List<Map<String, Any>>)?.get(0)
        val firstContent = firstCandidate?.get("content") as? Map<String, Any>
        val firstPart = (firstContent?.get("parts") as? List<Map<String, Any>>)?.get(0)
        val functionCall = firstPart?.get("functionCall") as? Map<String, Any>

        if (functionCall != null && firstContent != null) {
            messages.add(firstContent)

            val functionName = functionCall["name"] as String
            val arguments = functionCall["args"] as Map<String, Any>

            println("🔧 [ChatBotService] Function call detected: $functionName $arguments")

            val result = functionCallHandler.handleFunctionCall(functionName, arguments)

            val functionResponseContent = mapOf(
                "role" to "function",
                "parts" to listOf(
                    mapOf(
                        "functionResponse" to mapOf(
                            "name" to functionName,
                            "response" to mapOf("content" to result)
                        )
                    )
                )
            )
            messages.add(functionResponseContent)

            val secondResponse = callGeminiApi(messages)
            val secondCandidate = (secondResponse?.get("candidates") as? List<Map<String, Any>>)?.get(0)
            val secondContent = secondCandidate?.get("content") as? Map<String, Any>
            val secondPart = (secondContent?.get("parts") as? List<Map<String, Any>>)?.get(0)

            val summary = secondPart?.get("text") as? String ?: "함수 실행은 완료했으나 요약에 실패했습니다."
            messages.add(secondContent!!)
            return summary
        }

        val answer = firstPart?.get("text") as? String ?: "답변을 불러오지 못했습니다."
        if (firstContent != null) {
            messages.add(firstContent)
        }
        return answer
    }

    private fun callGeminiApi(messages: List<Map<String, Any>>): Map<*, *>? {
        val requestBody = mapOf(
            "contents" to messages,
            "systemInstruction" to systemInstruction,
            "tools" to tools,
            "toolConfig" to mapOf(
                "functionCallingConfig" to mapOf("mode" to "AUTO")
            )
        )

        return webClient.post()
            .uri("/models/gemini-2.5-flash-lite:generateContent?key=$apiKey")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(Map::class.java)
            .block()
    }
}