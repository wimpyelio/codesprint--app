# CodeSprint Security Setup Script (Windows PowerShell)
# Initializes all security tooling for local development
#
# Usage: .\scripts\setup-security.ps1

Write-Host "🔒 CodeSprint Security Setup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend/package.json")) {
    Write-Host "❌ Error: Run this script from the repository root" -ForegroundColor Red
    exit 1
}

# Check for .env file tracked in git
Write-Host "1️⃣  Checking for .env files in git..." -ForegroundColor Yellow
$tracked_env = git ls-files | Select-String "\.env$"
if ($tracked_env) {
    Write-Host "⚠️  WARNING: .env file is tracked by git" -ForegroundColor Red
    Write-Host "Removing from git tracking..." -ForegroundColor Yellow
    git rm --cached backend/.env
    git commit -m "Remove .env from tracking (SECURITY)"
    Write-Host "✅ .env removed from git tracking" -ForegroundColor Green
}

# Verify .env.example
Write-Host "2️⃣  Verifying .env.example..." -ForegroundColor Yellow
if (Test-Path "backend/.env.example") {
    $env_content = Get-Content "backend/.env.example"
    if ($env_content -match "postgres:|@db\.|AAAA") {
        Write-Host "⚠️  WARNING: .env.example may contain secrets!" -ForegroundColor Yellow
    } else {
        Write-Host "✅ .env.example looks secure" -ForegroundColor Green
    }
}

# Setup frontend
Write-Host "3️⃣  Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location frontend
npm install
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Pop-Location

# Git history check
Write-Host "4️⃣  Scanning git history for secrets..." -ForegroundColor Yellow
$history_check = git log --all --full-history -- "*.env" 2>&1
if ($history_check -and $history_check -notmatch "no matches") {
    Write-Host "❌ ERROR: .env file found in git history!" -ForegroundColor Red
    Write-Host "This indicates potential secret exposure!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To remove from history (WARNING: This rewrites history):" -ForegroundColor Yellow
    Write-Host "  git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch backend/.env' HEAD" -ForegroundColor Cyan
    Write-Host "  git push origin main --force-with-lease" -ForegroundColor Cyan
} else {
    Write-Host "✅ No .env files in git history" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Security setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1. Copy backend\.env.example to backend\.env" -ForegroundColor Cyan
Write-Host "  2. Fill backend\.env with actual credentials:" -ForegroundColor Cyan
Write-Host "     - Supabase: https://app.supabase.com → Settings → API" -ForegroundColor Cyan
Write-Host "     - GitHub OAuth: https://github.com/settings/developers" -ForegroundColor Cyan
Write-Host ""
Write-Host "Security Info:" -ForegroundColor Yellow
Write-Host "  📖 Read: SECURITY.md" -ForegroundColor Cyan
Write-Host "  🔒 Never commit: .env files, secrets, credentials" -ForegroundColor Cyan
Write-Host "  🧪 Test before deploy: npm run security:check" -ForegroundColor Cyan
Write-Host ""
