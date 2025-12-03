@echo off
REM BAW Project Setup Script for Windows

echo.
echo ================================
echo BAW - Setup Script
echo ================================
echo.

REM Backend Setup
echo [1/4] Setting up Django Backend...
cd BAW_back

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Run migrations
echo Running migrations...
python manage.py migrate

echo.
echo Backend setup complete!
echo.
echo To start the Django server, run:
echo   cd BAW_back
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.

REM Frontend Setup
cd ..\BAW-frontend

echo [2/4] Setting up React Frontend...
echo Installing Node dependencies...
call npm install

echo.
echo Frontend setup complete!
echo.
echo To start the React server, run:
echo   cd BAW-frontend
echo   npm run dev
echo.

cd ..

echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Start backend: cd BAW_back && venv\Scripts\activate && python manage.py runserver
echo 2. Start frontend: cd BAW-frontend && npm run dev
echo 3. Create admin user: python manage.py createsuperuser
echo 4. Visit http://localhost:3000
echo.
pause
