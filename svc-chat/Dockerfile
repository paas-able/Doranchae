# ---------- build ----------
FROM gradle:8.9.0-jdk17 AS build
WORKDIR /workspace
# 캐시를 위해 래퍼/설정 먼저 복사
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts gradle.properties* ./
RUN chmod +x gradlew && ./gradlew --no-daemon --version >/dev/null 2>&1 || true
# 소스 복사 후 빌드
COPY src src
RUN ./gradlew --no-daemon clean bootJar -x test

# ---------- run ----------
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/build/libs/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java","-jar","/app/app.jar"]
