#!/bin/bash
# 
# CodeSprint Security Setup Script
# Initializes all security tooling for local development
#
# Usage: bash scripts/setup-security.sh
#

set -e

echo "🔒 CodeSprint Security Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Error: Run this script from the repository root${NC}"
    exit 1
fi

echo -e "${YELLOW}1️⃣  Installing pre-commit framework...${NC}"
if ! command -v pre-commit &> /dev/null; then
    if command -v pip3 &> /dev/null; then
        pip3 install pre-commit
    elif command -v pip &> /dev/null; then
        pip install pre-commit
    else
        echo -e "${RED}❌ pip not found. Install Python or pre-commit manually.${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}2️⃣  Installing pre-commit hooks...${NC}"
pre-commit install
pre-commit install --hook-type commit-msg

echo -e "${YELLOW}3️⃣  Installing gitleaks...${NC}"
if ! command -v gitleaks &> /dev/null; then
    echo "📦 Installing gitleaks via package manager..."
    if command -v brew &> /dev/null; then
        brew install gitleaks
    elif command -v apt-get &> /dev/null; then
        sudo apt-get install -y gitleaks
    else
        echo -e "${YELLOW}⚠️  Please install gitleaks manually from: https://github.com/gitleaks/gitleaks${NC}"
    fi
fi

echo -e "${YELLOW}4️⃣  Setting up npm security...${NC}"
cd frontend
npm install
npm audit --audit-level=moderate || true
cd ..

echo -e "${YELLOW}5️⃣  Initializing detect-secrets baseline...${NC}"
if ! command -v detect-secrets &> /dev/null; then
    pip3 install detect-secrets || pip install detect-secrets
fi
detect-secrets scan --all-files > .secrets.baseline || true

echo -e "${YELLOW}6️⃣  Verifying .env file security...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  WARNING: .env file exists locally (this is OK for development)${NC}"
    echo "   Make sure it's never committed to git!"
    if git ls-files | grep -q "backend/.env"; then
        echo -e "${RED}❌ ERROR: .env is tracked by git! Removing it now...${NC}"
        git rm --cached backend/.env
        git commit -m "Remove .env from tracking (SECURITY)"
    fi
fi

echo ""
echo -e "${GREEN}✅ Security setup complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  1. Copy backend/.env.example to backend/.env"
echo "  2. Fill backend/.env with actual credentials:"
echo "     - Supabase: https://app.supabase.com → Settings → API"
echo "     - GitHub OAuth: https://github.com/settings/developers"
echo "  3. Test git hooks: git hook run npm-audit"
echo "  4. Make a test commit to verify pre-commit hooks work"
echo ""
echo -e "${YELLOW}Security Info:${NC}"
echo "  📖 Read: SECURITY.md"
echo "  🔒 Never commit: .env files, secrets, credentials"
echo "  🧪 Test before deploy: npm run security:check"
echo ""
