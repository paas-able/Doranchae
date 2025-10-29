# # ---------- build ----------
# FROM gradle:8.9.0-jdk17 AS build
# WORKDIR /workspace
# # 캐시를 위해 래퍼/설정 먼저 복사
# COPY gradlew gradlew
# COPY gradle gradle
# COPY build.gradle.kts settings.gradle.kts gradle.properties* ./
# RUN chmod +x gradlew && ./gradlew --no-daemon --version >/dev/null 2>&1 || true
# # 소스 복사 후 빌드
# COPY src src
# RUN ./gradlew --no-daemon --refresh-dependencies clean bootJar -x test
# # ---------- run ----------
# FROM eclipse-temurin:17-jre
# WORKDIR /app
# COPY --from=build /workspace/build/libs/*.jar app.jar
# EXPOSE 8080
# ENTRYPOINT ["java","-jar","/app/app.jar"]

# ---------- build ----------
FROM gradle:8.9.0-jdk17 AS build
WORKDIR /workspace

COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts gradle.properties* ./

RUN ./gradlew --no-daemon dependencies || true 

COPY src src
RUN ./gradlew --no-daemon clean bootJar -x test

# ---------- run ----------
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]



# # ---------- build ----------
# FROM gradle:8.9.0-jdk17 AS build
# WORKDIR /workspace

# # 1. Gradle 설정 파일들만 먼저 복사
# COPY gradlew gradlew
# COPY gradle gradle
# COPY build.gradle.kts settings.gradle.kts gradle.properties* ./

# # 2. 의존성을 먼저 다운로드 (소스 코드 없이)
# #    이렇게 하면 의존성 레이어가 캐시되어 나중에 소스 코드만 변경되어도 이 단계를 건너뛸 수 있음
# #    --refresh-dependencies 는 일단 제거하고 시도 (캐시 문제 해결 기대)
# RUN ./gradlew --no-daemon dependencies || true 

# # 3. 소스 코드 복사
# COPY src src

# # 4. 애플리케이션 빌드 (의존성은 이미 다운로드됨)
# #    --refresh-dependencies 는 일단 제거 (2단계에서 이미 처리 기대)
# RUN ./gradlew --no-daemon clean bootJar -x test

# # ---------- run ----------
# FROM eclipse-temurin:17-jre
# WORKDIR /app
# # 5. 빌드된 JAR 파일 복사 경로는 동일
# COPY --from=build /workspace/build/libs/*.jar app.jar
# EXPOSE 8080
# ENTRYPOINT ["java","-jar","/app.jar"]
