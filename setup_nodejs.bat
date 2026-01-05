@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   All The Beans App - .Node.js Setup
echo ========================================
echo.

echo Step 1: Installing server dependencies...
cd server\server_nodejs
if not exist package.json (
    echo ERROR: Cannot find package.json in server\server_nodejs
    echo Make sure you're running this script from the coffeebeans_test directory
    pause
    exit /b 1
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo Server dependencies installed successfully
echo.

echo Step 2: Installing client dependencies...
cd ..\..\client\client_beans
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo Client dependencies installed successfully
echo.

echo Step 3: Returning to server directory...
cd ..\..\server\server_nodejs
echo Ready for database setup
echo.

echo ========================================
echo   MANUAL DATABASE SETUP REQUIRED
echo ========================================
echo.
echo Before running the migration, you need to:
echo.
echo 1. Ensure PostgreSQL is installed and running
echo 2. Create a database named 'coffee_beans_db'
echo 3. Create/update the .env file with your database credentials
echo.
echo Example .env file content:
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=coffee_beans_db
echo DB_USER=postgres
echo DB_PASSWORD=your_actual_password
echo JWT_SECRET=your-super-secret-jwt-key-change-in-production
echo PORT=3001
echo.
echo Press any key when database is set up...
pause >nul

echo.
echo Step 4: Running database migration...
call node init\migrate.js
if %errorlevel% neq 0 (
    echo ERROR: Database migration failed
    echo Please check your database connection and try again
    pause
    exit /b 1
)
echo Database migration completed successfully
echo.

echo Step 5: Generating JWT token...
echo (This may take a moment...)
call node init\generateToken.js
if %errorlevel% neq 0 (
    echo ERROR: Token generation failed
    pause
    exit /b 1
)
echo JWT token generated successfully
echo.


echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Starting Node.js server with frontend in new terminal...
set "ROOT_DIR=%CD%\..\.."
cd ..\..
start "All The Beans Node.js Full Stack" cmd /k "cd /d "%ROOT_DIR%\server\server_nodejs" && npm run dev:full"

echo.
echo ========================================
echo   APPLICATION STARTING
echo ========================================
echo.
echo Server and client starting in new terminal...
echo Server will run on http://localhost:3001
echo Client will run on http://localhost:3000
echo.
echo Wait for both services to start completely...
echo.
pause