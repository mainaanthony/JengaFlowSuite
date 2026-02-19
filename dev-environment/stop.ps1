#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Stop JengaFlow development environment
.DESCRIPTION
    Stops all Docker containers gracefully
#>

Write-Host "🛑 Stopping JengaFlow Development Environment..." -ForegroundColor Yellow

# Navigate to the script directory
Set-Location $PSScriptRoot

# Stop docker compose
docker compose down

Write-Host "✅ All services stopped" -ForegroundColor Green
