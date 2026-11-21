$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = Join-Path $projectRoot 'backend'
$frontendRoot = Join-Path $projectRoot 'frontend'
$mariaBin = 'D:\wamp64\bin\mariadb\mariadb11.2.2\bin\mysqld.exe'
$mariaConfig = 'D:\wamp64\bin\mariadb\mariadb11.2.2\my.ini'

function Test-PortOpen([int]$port) {
    return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

if (-not (Test-PortOpen 3307) -and (Test-Path $mariaBin) -and (Test-Path $mariaConfig)) {
    Start-Process -FilePath $mariaBin -ArgumentList "--defaults-file=$mariaConfig" -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

if (-not (Test-PortOpen 3000)) {
    Start-Process -FilePath 'npm.cmd' -ArgumentList 'start' -WorkingDirectory $backendRoot -WindowStyle Hidden
}

if (-not (Test-PortOpen 5173)) {
    Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev','--','--host','127.0.0.1' -WorkingDirectory $frontendRoot -WindowStyle Hidden
}

Write-Output 'Explore Hail services started.'
Write-Output 'Frontend: http://localhost:5173'
Write-Output 'Backend:  http://localhost:3000'
