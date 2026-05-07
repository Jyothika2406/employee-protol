@echo off
echo ========================================
echo   Pushing Code to GitHub
echo ========================================
echo.
echo Repository: https://github.com/Jyothika2406/employee-protol
echo.
echo You will be prompted for GitHub credentials:
echo   Username: Jyothika2406
echo   Password: Use Personal Access Token from https://github.com/settings/tokens
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo Checking git status...
git status
echo.

echo Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Code pushed to GitHub
    echo ========================================
    echo.
    echo View your code at:
    echo https://github.com/Jyothika2406/employee-protol
    echo.
) else (
    echo.
    echo ========================================
    echo   PUSH FAILED
    echo ========================================
    echo.
    echo Please check:
    echo 1. You entered correct username: Jyothika2406
    echo 2. You used a Personal Access Token (not password)
    echo 3. Token has 'repo' permissions
    echo.
    echo Get token at: https://github.com/settings/tokens
    echo.
)

pause
