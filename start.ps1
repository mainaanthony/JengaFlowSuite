#!/usr/bin/env pwsh
<#
.SYNOPSIS
    JengaFlow Quick Launcher - Start from project root
.DESCRIPTION
    Convenience script to start the development environment from the project root
#>

param(
    [switch]$NoBrowser,
    [switch]$Build
)

$devEnvPath = Join-Path $PSScriptRoot "dev-environment"

if (-not (Test-Path $devEnvPath)) {
    Write-Error "dev-environment folder not found at: $devEnvPath"
    exit 1
}

Write-Host "📂 Navigating to dev-environment..." -ForegroundColor Cyan

# Build arguments to pass through
$args = @()
if ($NoBrowser) { $args += "-NoBrowser" }
if ($Build) { $args += "-Build" }

# Call the actual start script
& "$devEnvPath\start.ps1" @args
