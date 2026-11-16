@echo off
cd /d "%~dp0"
node --version >nul 2>&1
if errorlevel 1 (
  echo Installez Node.js 24 depuis https://nodejs.org puis relancez ce fichier.
  pause
  exit /b 1
)
echo Ouvrez http://localhost:3000 dans votre navigateur.
npm start
pause
