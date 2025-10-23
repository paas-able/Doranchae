package com.doran.chat.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.scheduling.TaskScheduler
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig (
    private val taskScheduler: TaskScheduler
): WebSocketMessageBrokerConfigurer {

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.addEndpoint("/ws-chat")
            .setAllowedOriginPatterns("*")
            .withSockJS()
    }

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.enableSimpleBroker("/topic")
            .setHeartbeatValue(longArrayOf(10_000, 20_000)) // S↔C 10s/20s
            .setTaskScheduler(taskScheduler)  // 서버 → 클라이언트
        registry.setApplicationDestinationPrefixes("/app") // 클라이언트 → 서버
    }
}

@Configuration
class SchedulerConfig {
    @Bean
    fun taskScheduler(): TaskScheduler {
        val scheduler = org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler()
        scheduler.poolSize = 1
        scheduler.setThreadNamePrefix("ws-heartbeat-thread-")
        scheduler.initialize()
        return scheduler
    }
}