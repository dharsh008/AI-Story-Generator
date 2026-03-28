@echo off
echo ==============================================
echo       Starting AI Story Generator Setup
echo ==============================================
echo.

echo 1. Checking and installing dependencies...
pip install -r requirements.txt

echo.
echo 2. Launching the web application...
echo The app will open in your default browser. 
echo Note: The page might take a few seconds to load completely while the AI model initializes.

:: This opens the default web browser to the local URL
start http://127.0.0.1:5000

echo.
echo ==============================================
echo Server is running! DO NOT CLOSE THIS WINDOW.
echo To stop the application, press Ctrl+C or close this window.
echo ==============================================
echo.

:: Run the Flask application
python app.py

pause
