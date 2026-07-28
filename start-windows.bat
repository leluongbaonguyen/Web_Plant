@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo Dang cai dat thu vien...
call npm install
if errorlevel 1 goto error
echo Dang khoi dong Web Lich Sinh Hoat...
call npm start
exit /b 0
:error
echo Co loi khi cai dat hoac khoi dong. Hay kiem tra Node.js va npm.
pause
exit /b 1
