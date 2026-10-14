@echo off
setlocal
cd /d "%~dp0"
title Bilar DigitalTech - Bilar Amigo Secreto
where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao encontrado. Instale a versao LTS em https://nodejs.org/
  pause
  exit /b 1
)
echo A verificar dependencias...
if not exist node_modules (
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo A instalacao falhou. Confirme a mensagem de erro acima.
    pause
    exit /b 1
  )
)
echo.
echo A iniciar a aplicacao...
call npm.cmd run dev
pause
