# Script de respaldo automático para BarberFlow
$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$destinoCarpeta = Join-Path $PSScriptRoot "_RESPALDOS"

if (!(Test-Path $destinoCarpeta)) {
    New-Item -ItemType Directory -Path $destinoCarpeta | Out-Null
}

$archivoZip = Join-Path $destinoCarpeta "Respaldo_BarberFlow_$fecha.zip"
$archivos = Get-ChildItem -Path $PSScriptRoot -Include *.html, *.js, *.css, *.md -Recurse -File | Where-Object { $_.FullName -notmatch "_RESPALDOS" }

Compress-Archive -Path $archivos.FullName -DestinationPath $archivoZip -Force

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   BARBERFLOW URUGUAY - RESPALDO EXITOSO" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Copia de seguridad creada en:" -ForegroundColor White
Write-Host $archivoZip -ForegroundColor Yellow
Write-Host "Total de archivos respaldados: $($archivos.Count)" -ForegroundColor White
Write-Host "Tus estrategias y tu codigo estan 100% seguros." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
