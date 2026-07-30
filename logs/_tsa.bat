@echo off
set HOTSPOT_APP_NAME=hotspot-test-service-a
cd /d G:\work\utils-support-hotspot-parent
java -javaagent:output\java8\utils-support-hotspot-agent-4.0.0.42-java8.jar ^
     -jar utils-support-hotspot-test-springboot-a\target\utils-support-hotspot-test-springboot-a-4.0.0.42.jar