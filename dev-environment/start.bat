@echo off
REM Start JengaFlow Development Environment (Windows batch launcher)
REM This script calls the PowerShell script to start everything

powershell -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
