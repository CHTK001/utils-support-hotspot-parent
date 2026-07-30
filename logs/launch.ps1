Get-Process -Name java -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
$proc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','G:\work\utils-support-hotspot-parent\logs\_tsb.bat' -WindowStyle Hidden -PassThru
Write-Host "tsb PID=$($proc.Id)"
Start-Sleep -Seconds 1
$proc2 = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c','G:\work\utils-support-hotspot-parent\logs\_tsa.bat' -WindowStyle Hidden -PassThru
Write-Host "tsa PID=$($proc2.Id)"