package com.doran.chat.domain.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient

@Component
class FunctionCallHandler{
    private val webClient = WebClient.create()
    fun handleFunctionCall(functionName: String, args: Map<String, Any>): String {
        return when (functionName) {
            "create_post" -> createPost(args["title"] as String, args["content"] as String)
            //"search_post" -> searchPost(args["query"] as String)
            //검색 기능 미구현인 관계로 추후 확장시 구현. 지금은 주석상태로 둘 것
            else -> "알 수 없는 기능입니다."
        }
    }

    private fun createPost(title: String, content: String): String {
        val body = mapOf("title" to title, "content" to content)

        val response = webClient.post()
            .uri("http://localhost:8080/api/community/post")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(body)
            .retrieve()
            .bodyToMono(Map::class.java)
            .block()

        return "게시글 작성 완료: ${response?.get("message") ?: "성공"}"
    }

//    private fun searchPost(query: String): String {
//        val response = webClient.get()
//            .uri("http://localhost:8080/api/community/search?query=$query")
//            .accept(MediaType.APPLICATION_JSON)
//            .retrieve()
//            .bodyToMono(Map::class.java)
//            .block()
//
//        val posts = response?.get("data") ?: "검색 결과가 없습니다."
//        return "검색 결과: $posts"
//    }
}
