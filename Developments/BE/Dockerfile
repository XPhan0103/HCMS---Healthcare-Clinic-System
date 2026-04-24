# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml to cache dependencies
COPY pom.xml .

# Download dependencies (this will be cached unless pom.xml changes)
# -B: Batch mode
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
# -DskipTests: Skip tests for faster build in CI/CD
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Set deployment directory
WORKDIR /app

# Create a non-root user for security
# Alpine uses addgroup/adduser
RUN addgroup -S hcms && adduser -S hcmsuser -G hcms

# Copy the built jar from the builder stage
# We use a wildcard to avoid hardcoding the version
COPY --from=builder /app/target/hcms-backend-*.jar app.jar

# Set ownership to the non-root user
RUN chown -R hcmsuser:hcms /app

# Switch to non-root user
USER hcmsuser

# Expose the application port (default Spring Boot port)
EXPOSE 8080

# Healthcheck to monitor container status
# --interval: How often to perform the check
# --timeout: How long to wait for a response
# --retries: Number of failures before considering the container unhealthy
# Using wget since it's available in alpine
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Metadata labels
LABEL maintainer="HCMS DevOps Team"
LABEL version="1.0"
LABEL description="Production image for HCMS Backend"

# Run the application
# Using exec form of ENTRYPOINT for proper signal handling (SIGTERM)
ENTRYPOINT ["java", "-jar", "app.jar"]
