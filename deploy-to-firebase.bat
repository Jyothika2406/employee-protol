@echo off
echo ========================================
echo   Employee Portal - Firebase Deployment
echo ========================================
echo.

echo Step 1: Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please fix errors and try again.
    pause
    exit /b 1
)
echo Build completed successfully!
echo.

echo Step 2: Logging into Firebase...
call firebase login
if %errorlevel% neq 0 (
    echo Firebase login failed!
    echo.
    echo Please try one of these:
    echo 1. Run: firebase login --reauth
    echo 2. Run: firebase login --no-localhost
    echo 3. Or deploy manually from Firebase Console
    pause
    exit /b 1
)
echo.

echo Step 3: Deploying to Firebase Hosting...
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo Deployment failed!
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Deployment Successful!
echo ========================================
echo.
echo Your app is now live at:
echo https://mentneo-ea55a.web.app
echo.
echo Press any key to open the app in your browser...
pause > nul
start https://mentneo-ea55a.web.app

exit /b 0
