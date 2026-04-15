# Start-Website.ps1
# PowerShell script to start the Learnnomine website

Write-Host "Starting Learnnomine Website..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit
}

# Check if npm dependencies are installed
if (-Not (Test-Path -Path ".\node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the server
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Open http://localhost:8080 in your browser" -ForegroundColor Green
npm start
