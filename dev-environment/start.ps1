#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Start JengaFlow development environment and open web interfaces
.DESCRIPTION
    This script starts all Docker services and automatically opens:
    - Frontend application
    - GraphQL Playground
    - Swagger API documentation
#>

param(
    [switch]$NoBrowser,  # Skip opening browsers
    [switch]$Build       # Force rebuild of containers
)

Write-Host "🚀 Starting JengaFlow Development Environment..." -ForegroundColor Cyan

# Navigate to the script directory
Set-Location $PSScriptRoot

# Build the docker compose command
$composeCmd = "docker compose up"
if ($Build) {
    $composeCmd += " --build"
}

# Start docker compose in background
Write-Host "📦 Starting Docker containers..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; $composeCmd"

if ($NoBrowser) {
    Write-Host "✅ Docker containers starting. Browsers will not open." -ForegroundColor Green
    exit 0
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Function to wait for a URL to be ready
function Wait-ForUrl {
    param(
        [string]$Url,
        [string]$Name,
        [int]$MaxAttempts = 30
    )
    
    Write-Host "Checking $Name..." -ForegroundColor Gray
    $attempt = 0
    while ($attempt -lt $MaxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri $Url -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ $Name is ready" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Service not ready yet
        }
        $attempt++
        Start-Sleep -Seconds 2
    }
    Write-Host "⚠ $Name is taking longer than expected" -ForegroundColor Yellow
    return $false
}

# Wait for services
Wait-ForUrl -Url "http://localhost:4200" -Name "Frontend"
Wait-ForUrl -Url "http://localhost:5001/health" -Name "Backend API"
Wait-ForUrl -Url "http://localhost:8080" -Name "Keycloak"

Write-Host ""
Write-Host "🌐 Opening web interfaces..." -ForegroundColor Cyan

# Open URLs in default browser
Start-Process "http://localhost:4200"                    # Frontend
Start-Sleep -Milliseconds 500
Start-Process "http://localhost:5001/graphql"            # GraphQL Playground
Start-Sleep -Milliseconds 500
Start-Process "http://localhost:5001/swagger"            # Swagger UI

Write-Host ""
Write-Host "✅ Development environment is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Available services:" -ForegroundColor Cyan
Write-Host "   • Frontend:        http://localhost:4200" -ForegroundColor White
Write-Host "   • GraphQL:         http://localhost:5001/graphql" -ForegroundColor White
Write-Host "   • Swagger:         http://localhost:5001/swagger" -ForegroundColor White
Write-Host "   • Keycloak:        http://localhost:8080" -ForegroundColor White
Write-Host "   • Go Service:      http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "💡 To stop: Press Ctrl+C in the Docker Compose window" -ForegroundColor Yellow
Write-Host ""
