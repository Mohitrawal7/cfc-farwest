# Use official Maven image to build the app
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

# Build the jar
RUN mvn clean package -DskipTests


# Use lightweight JDK image to run the app
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render uses 8080 by default)
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]