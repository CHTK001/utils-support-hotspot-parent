Set-Location D:\ch\project\utils-support-hotspot-parent\utils-support-hotspot-test-springboot-a
Remove-Item ..\output\plugins\*tomcat10x* -Force -ErrorAction SilentlyContinue
Copy-Item ..\utils-support-hotspot-tomcat9x\target\utils-support-hotspot-tomcat9x-4.0.0.33.jar ..\output\plugins\ -Force
Copy-Item ..\utils-support-hotspot-core\target\utils-support-hotspot-core-4.0.0.33.jar ..\output\libs\ -Force
$agent = "..\output\java8\utils-support-hotspot-agent-4.0.0.33-java8.jar"
$app = "target\utils-support-hotspot-test-springboot-a-4.0.0.33.jar"
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "C:\Program Files\Amazon Corretto\jdk1.8.0_492\bin\java.exe"
$psi.Arguments = "-javaagent:`"$agent`"=agent-config.json -jar `"$app`""
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$p = [System.Diagnostics.Process]::Start($psi)
Write-Output "PID: $($p.Id)"
Start-Sleep -Seconds 30
if ($p.HasExited) { Write-Output "EXIT: $($p.ExitCode)"; Write-Output $p.StandardError.ReadToEnd() } else { Write-Output "ALIVE"; try { $r = Invoke-WebRequest -Uri "http://127.0.0.1:18956/qps?action=current&container=TOMCAT" -UseBasicParsing -TimeoutSec 5; Write-Output "QPS: $($r.Content)" } catch { Write-Output "QPS FAIL" } }
