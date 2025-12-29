@echo off
echo ========================================
echo   Coffee Beans App - Initial Setup
echo ========================================
echo.

echo Step 1: Installing server dependencies...
cd server\server_beans
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install server dependencies
    pause
    exit /b 1
)
echo ✓ Server dependencies installed successfully
echo.

echo Step 2: Installing client dependencies...
cd ..\..\client\client_beans
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo ✓ Client dependencies installed successfully
echo.

echo Step 3: Returning to server directory...
cd ..\..\server\server_beans
echo ✓ Ready for database setup
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
echo ✓ Database migration completed successfully
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo You can now start the application with:
echo   cd server\server_beans
echo   npm run dev:full
echo.
echo This will start both the server (http://localhost:3001)
echo and client (http://localhost:3000) simultaneously.
echo.
echo Happy coding! ☕
echo.
pause