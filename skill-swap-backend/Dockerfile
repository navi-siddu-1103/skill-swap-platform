# ── Stage 1: Build the Spring Boot Application ────────────────
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copy Maven wrapper and POM
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Grant execute permission to Maven wrapper
RUN chmod +x mvnw

# Download dependencies offline cache
RUN ./mvnw dependency:go-offline -B || true

# Copy source files and package
COPY src ./src
RUN ./mvnw clean package -DskipTests

# ── Stage 2: Lightweight Runtime ──────────────────────────────
FROM eclipse-temurin:25-jre
WORKDIR /app

# Copy the compiled executable JAR
COPY --from=build /app/target/*.jar app.jar

# Render assigns dynamic port via $PORT
EXPOSE 9091
ENV PORT=9091

ENTRYPOINT ["java", "-jar", "app.jar"]
