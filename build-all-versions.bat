@echo off
REM Build script for multiple Java versions
REM This script builds the hotspot agent for Java 8, 17, and 21

echo ========================================
echo Building Hotspot Agent for All Java Versions
echo ========================================
echo.

REM Check if output directory exists and clean it
if exist output (
    echo Cleaning output directory...
    rmdir /s /q output
)

echo.
echo ========================================
echo Building Java 8 Agent (Default)
echo ========================================
call mvn clean package -pl utils-support-hotspot-agent -am -DskipTests -Pjava8
if %ERRORLEVEL% NEQ 0 (
    echo Java 8 build failed!
    exit /b 1
)

echo.
echo ========================================
echo Building Java 17 Agent
echo ========================================
call mvn clean package -pl utils-support-hotspot-agent -am -DskipTests -Pjava17
if %ERRORLEVEL% NEQ 0 (
    echo Java 17 build failed!
    exit /b 1
)

echo.
echo ========================================
echo Building Java 21 Agent
echo ========================================
call mvn clean package -pl utils-support-hotspot-agent -am -DskipTests -Pjava21
if %ERRORLEVEL% NEQ 0 (
    echo Java 21 build failed!
    exit /b 1
)

echo.
echo ========================================
echo Build Summary
echo ========================================
echo All agent versions built successfully!
echo.
echo Output directory structure:
echo   output/
echo   ├── java8/
echo   │   ├── utils-support-hotspot-agent-4.0.0.33-java8.jar
echo   │   ├── utils-support-hotspot-bootstrap-hook-4.0.0.33.jar
echo   │   ├── plugins/
echo   │   └── libs/
echo   ├── java17/
echo   │   ├── utils-support-hotspot-agent-4.0.0.33-java17.jar
echo   │   ├── utils-support-hotspot-bootstrap-hook-4.0.0.33.jar
echo   │   ├── plugins/
echo   │   └── libs/
echo   └── java21/
echo       ├── utils-support-hotspot-agent-4.0.0.33-java21.jar
echo       ├── utils-support-hotspot-bootstrap-hook-4.0.0.33.jar
echo       ├── plugins/
echo       └── libs/
echo.
echo Usage:
echo   Java 8:  -javaagent:output/java8/utils-support-hotspot-agent-4.0.0.33-java8.jar
echo   Java 17: -javaagent:output/java17/utils-support-hotspot-agent-4.0.0.33-java17.jar
echo   Java 21: -javaagent:output/java21/utils-support-hotspot-agent-4.0.0.33-java21.jar
echo.
echo ========================================

pause
