@echo off
chcp 65001 > nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0hacer_respaldo.ps1"
echo.
pause
