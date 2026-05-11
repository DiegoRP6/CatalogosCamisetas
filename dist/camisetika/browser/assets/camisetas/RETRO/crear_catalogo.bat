@echo off
cd /d "%~dp0"
echo ========================================
echo   Generador de catalogo PDF
echo ========================================
echo.

where python >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Python no esta instalado o no esta en el PATH.
    echo Descargalo desde https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Instalando dependencias (si hace falta)...
python -m pip install --quiet --upgrade Pillow reportlab
echo.

echo Ejecutando script...
echo.
python crear_catalogo.py

echo.
echo ========================================
pause
