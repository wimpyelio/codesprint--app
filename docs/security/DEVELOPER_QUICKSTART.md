# 🚀 Developer Quick Start - Security

Quick reference for developers getting started with CodeSprint.

---

## First Time Setup

### 1. Clone & Install
```bash
git clone https://github.com/yourorg/codesprint-app.git
cd codesprint-app

# Setup security tools (recommended)
bash scripts/setup-security.sh  # macOS/Linux
.\scripts\setup-security.ps1    # Windows PowerShell
```

### 2. Create `.env` Files
```bash
# Backend environment
cp backend/.env.example backend/.env

# Edit backend/.env with:
# - Database credentials from Supabase
# - GitHub OAuth keys
# - Generated JWT secrets
```

### 3. Never Commit Secrets
```bash
# These are already git-ignored, but verify:
cat .gitignore | grep ".env"

# ✅ Should show:
# .env
# backend/.env
# frontend/.env
```

---

## Before Every Commit

```bash
# 1. Run security check
npm run security:check  # from frontend/

# 2. Lint code
npm run lint            # from frontend/

# 3. Run tests
npm run test            # from frontend/

# 4. Pre-commit hooks run automatically
# (gitleaks, secret detection, etc.)
```

---

## Common Tasks

### Generate New Secrets

```bash
# JWT Secret (32+ bytes)
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Encryption Key (base64 32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Check for Exposed Secrets

```bash
# If you accidentally added a secret:
git reset --soft HEAD~1  # Unstage last commit
rm backend/.env          # Remove secret file
git add .
git commit -m "Remove credentials"
```

### Update Dependencies Safely

```bash
cd frontend

# Check for vulnerabilities
npm audit

# Update if safe
npm update

# Commit lock file
git add package-lock.json
git commit -m "Update dependencies"
```

---

## Security Rules

🔒 **GOLDEN RULES:**

1. **Never hardcode secrets**
   ```javascript
   // ❌ DON'T
   const apiKey = "sb_pub_xxxxx";
   
   // ✅ DO
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

2. **Never commit `.env`**
   ```bash
   # ❌ DON'T
   git add backend/.env
   
   # ✅ This is automatically prevented
   ```

3. **Never log secrets**
   ```javascript
   // ❌ DON'T
   console.log(process.env);
   console.log("Token:", token);
   
   // ✅ DO
   console.log("Request to:", endpoint);
   ```

4. **Never share via Slack/Email**
   - Use secure password manager (1Password, LastPass)
   - Contact team lead for sensitive info

5. **Rotate secrets regularly**
   - Quarterly: All secrets
   - Immediately: After any security incident

---

## Troubleshooting

### Pre-commit hooks failing?

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run manually
pre-commit run --all-files
```

### npm audit errors?

```bash
# Check vulnerabilities
npm audit

# Auto-fix if available
npm audit fix

# If fixable, commit
git add package-lock.json
git commit -m "Fix security vulnerabilities"
```

### "Environment variable not set"?

```bash
# Check .env file exists
ls -la backend/.env

# Verify file isn't corrupted
cat backend/.env | grep DATABASE_URL

# Recreate if needed
cp backend/.env.example backend/.env
# Then edit with real values
```

---

## Resources

📖 **Read These:**
- [SECURITY.md](../../SECURITY.md) - Full security policy
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - All env vars explained
- [DEPLOYMENT_SECURITY_CHECKLIST.md](./DEPLOYMENT_SECURITY_CHECKLIST.md) - Before deploying

🔗 **Links:**
- [Supabase Dashboard](https://app.supabase.com)
- [GitHub OAuth Settings](https://github.com/settings/developers)
- [npm Security Docs](https://docs.npmjs.com/packages-and-modules/securing-your-code)

🆘 **Questions?**
- Ask in team Slack/Discord
- Check existing docs
- Contact security lead

---

## Pre-Deployment Checklist

Before you or anyone deploys:

- [ ] All tests passing locally
- [ ] npm audit passing
- [ ] No .env files in git
- [ ] All secrets in CI/CD platform
- [ ] Deployment checklist reviewed
- [ ] Team lead approval
- [ ] Production secrets verified

---

**Version:** 1.0.0  
**Last Updated:** April 2, 2026
