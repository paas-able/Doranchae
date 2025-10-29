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