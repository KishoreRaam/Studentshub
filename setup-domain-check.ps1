# Domain Check Setup Script
# Run this script to install dependencies and start the application

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Domain Availability Check Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install API dependencies
Write-Host "Installing API dependencies..." -ForegroundColor Yellow
Push-Location api
if (Test-Path "node_modules") {
    Write-Host "✓ API dependencies already installed" -ForegroundColor Green
} else {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ API dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install API dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
Pop-Location

Write-Host ""

# Check if root dependencies are installed
Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ Frontend dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1 - Start both servers:" -ForegroundColor Cyan
Write-Host "  npm run dev:full" -ForegroundColor White
Write-Host ""
Write-Host "Option 2 - Start separately (in two terminals):" -ForegroundColor Cyan
Write-Host "  Terminal 1: npm run api" -ForegroundColor White
Write-Host "  Terminal 2: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  API:      http://localhost:3001" -ForegroundColor White
Write-Host ""

# Ask if user wants to start now
$response = Read-Host "Do you want to start the application now? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "Starting servers..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    
    # Start API server in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run api"
    Start-Sleep -Seconds 2
    
    # Start Vite dev server
    npm run dev
} else {
    Write-Host ""
    Write-Host "Setup complete! Run 'npm run dev:full' when ready." -ForegroundColor Green
}
