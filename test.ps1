Get-Process -Name java -ErrorAction SilentlyContinue | Where-Object { $_.Id -notin @(18512,25052,30784) } | Stop-Process -Force
Start-Sleep -Seconds 2
Set-Location 'utils-support-hotspot-test-springboot-a'
$agentJar = Resolve-Path '..\output\java8\utils-support-hotspot-agent-4.0.0.33-java8.jar'
$appJar = Resolve-Path 'target\utils-support-hotspot-test-springboot-a-4.0.0.33.jar'
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'C:\Program Files\Amazon Corretto\jdk1.8.0_492\bin\java.exe'
$psi.Arguments = "-javaagent:`"$agentJar`"=agent-config.json -jar `"$appJar`""
$psi.WorkingDirectory = (Get-Location).Path
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$p = [System.Diagnostics.Process]::Start($psi)
Write-Output "PID: $($p.Id)"
Start-Sleep -Seconds 35
if ($p.HasExited) { Write-Output "EXIT: $($p.ExitCode)"; Write-Output $p.StandardError.ReadToEnd() } else { Write-Output 'RUNNING'; try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:18956/qps?action=current&container=TOMCAT' -UseBasicParsing -TimeoutSec 5; Write-Output "QPS: $($r.Content)" } catch { Write-Output 'QPS FAILED' } }
