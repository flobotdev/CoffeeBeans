@echo off
echo ========================================
echo   All The Beans App - .NET Setup
echo ========================================
echo.

echo Step 1: Installing client dependencies...
cd client\client_beans
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install client dependencies
    pause
    exit /b 1
)
echo Client dependencies installed successfully
echo.

echo Step 2: Checking .NET SDK installation...
cd ..\..\server\server_net\AllTheBeans
dotnet --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: .NET SDK not found. Please install .NET 8.0 or higher
    echo Download from: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)
echo .NET SDK found
echo.

echo Step 3: Restoring .NET dependencies...
call dotnet restore
if %errorlevel% neq 0 (
    echo ERROR: Failed to restore .NET dependencies
    pause
    exit /b 1
)
echo .NET dependencies restored successfully
echo.

echo ========================================
echo   DATABASE CONFIGURATION
echo ========================================
echo.
echo Before running the application, ensure:
echo.
echo 1. PostgreSQL is installed and running
echo 2. Create a database named 'coffee_beans_db'
echo 3. Update appsettings.Development.json with your database credentials
echo.
echo Example connection string in appsettings.Development.json:
echo "DefaultConnection": "Host=localhost;Port=5432;Database=coffee_beans_db;Username=postgres;Password=your_password"
echo.
echo Note: The .NET app will automatically initialize the database on first run
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Starting .NET backend in new terminal...
cd ..\..\..
start "All The Beans .NET Backend" cmd /k "cd /d %CD%\server\server_net\AllTheBeans && dotnet run"

echo Starting React frontend in new terminal...
timeout /t 2 /nobreak >nul
start "All The React Frontend" cmd /k "cd /d %CD%\client\client_beans && npm start"

echo.
echo ========================================
echo   APPLICATION STARTING
echo ========================================
echo.
echo Backend terminal opened (http://localhost:5036)
echo Frontend terminal opened (http://localhost:3000)
echo.
echo The application will be ready at http://localhost:3000
echo Wait for both services to start completely...
echo.
pause