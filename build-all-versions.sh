#!/bin/bash
# Build script for multiple Java versions
# This script builds the hotspot agent for Java 8, 17, and 21

echo "========================================"
echo "Building Hotspot Agent for All Java Versions"
echo "========================================"
echo

# Check if output directory exists and clean it
if [ -d "output" ]; then
    echo "Cleaning output directory..."
    rm -rf output
fi

echo
echo "========================================"
echo "Building Java 8 Agent (Default)"
echo "========================================"
mvn clean package -pl utils-support-hotspot-agent -am -DskipTests -Pjava8
if [ $? -ne 0 ]; then
    echo "Java 8 build failed!"
    exit 1
fi

echo
echo "========================================"
echo "Building Java 17 Agent"
echo "========================================"
mvn clean package -pl utils-support-hotspot-agent -am -DskipTests -Pjava17
if [ $? -ne 0 ]; then
    echo "Java 17 build failed!"
    exit 1
fi

echo
echo "========================================"
echo "Building Java 21 Agent"
echo "========================================"
mvn clean package -pl utils-support-hotspot-agent -am -DskipTests -Pjava21
if [ $? -ne 0 ]; then
    echo "Java 21 build failed!"
    exit 1
fi

echo
echo "========================================"
echo "Build Summary"
echo "========================================"
echo "All agent versions built successfully!"
echo
echo "Output directory structure:"
echo "  output/"
echo "  ├── java8/"
echo "  │   ├── utils-support-hotspot-agent-4.0.0.33-java8.jar"
echo "  │   ├── utils-support-hotspot-bootstrap-hook-4.0.0.33.jar"
echo "  │   ├── plugins/"
echo "  │   └── libs/"
echo "  ├── java17/"
echo "  │   ├── utils-support-hotspot-agent-4.0.0.33-java17.jar"
echo "  │   ├── utils-support-hotspot-bootstrap-hook-4.0.0.33.jar"
echo "  │   ├── plugins/"
echo "  │   └── libs/"
echo "  └── java21/"
echo "      ├── utils-support-hotspot-agent-4.0.0.33-java21.jar"
echo "      ├── utils-support-hotspot-bootstrap-hook-4.0.0.33.jar"
echo "      ├── plugins/"
echo "      └── libs/"
echo
echo "Usage:"
echo "  Java 8:  -javaagent:output/java8/utils-support-hotspot-agent-4.0.0.33-java8.jar"
echo "  Java 17: -javaagent:output/java17/utils-support-hotspot-agent-4.0.0.33-java17.jar"
echo "  Java 21: -javaagent:output/java21/utils-support-hotspot-agent-4.0.0.33-java21.jar"
echo
echo "========================================"
