# 🔒 Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in CodeSprint, please send an email to the maintainers **directly** rather than using the public issue tracker.

**Do not open public issues for security vulnerabilities.**

---

## Supply Chain Security

### Dependency Management

**npm (Frontend)**

- All dependencies sourced from official npm registry
- Lockfile version 3 with SHA-512 integrity verification (`package-lock.json`)
- Run `npm audit` regularly:
  ```bash
  npm audit
  npm audit fix  # Auto-fix if updates available
  ```

**Python (Backend)**

- All dependencies pinned to specific versions in `requirements.txt`
- Virtual environment isolated: `backend/venv/`
- Regular dependency audits recommended

### Secret Management

⚠️ **CRITICAL RULES:**

1. **Never commit `.env` files or secrets to version control**
   - `.env` files are git-ignored
   - Use only `.env.example` as template
   - `.env.example` contains NO real secrets

2. **Environment Variables**
   - Database passwords
   - API keys (Supabase, GitHub)
   - JWT secrets
   - OAuth credentials
   - Encryption keys

   Must be:
   - Stored in `.env` (local only)
   - Injected via CI/CD secrets (production)
   - Never logged or printed
   - Rotated quarterly or after any exposure

3. **Production Deployment**
   - Use platform secrets:
     - **Vercel**: Vercel Dashboard → Project Settings → Environment Variables
     - **GitHub Actions**: Repository Settings → Secrets and variables
     - **Heroku**: Config Vars
     - **AWS**: AWS Secrets Manager / Parameter Store
     - **Azure**: Azure Key Vault

### Setup Instructions

#### Initial Setup (Local Development)

```bash
# 1. Copy template to actual env file
cp backend/.env.example backend/.env

# 2. Fill in actual values from:
#    - Supabase Dashboard (Settings → API & Database)
#    - GitHub Settings → Developer Settings → OAuth Apps
#    - Your infrastructure

# 3. Generate secure secrets:

# Option A: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option B: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 4. Update backend/.env with generated values
```

#### CI/CD Setup

**GitHub Actions Example:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
  SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
  SECRET_KEY: ${{ secrets.SECRET_KEY }}
  TOKEN_ENCRYPTION_KEY: ${{ secrets.TOKEN_ENCRYPTION_KEY }}
  GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
  GITHUB_CLIENT_SECRET: ${{ secrets.GITHUB_CLIENT_SECRET }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        run: ./scripts/deploy.sh
```

---

## Secrets Exposure Recovery

### If secrets are accidentally exposed:

1. **Immediately rotate credentials:**

   ```bash
   # Supabase: Dashboard → Settings → Database → Reset password
   # GitHub: Settings → Developer Settings → OAuth Apps → Regenerate
   ```

2. **Remove from git history:**

   ```bash
   # WARNING: This rewrites history - coordinate with team
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch backend/.env' HEAD
   git push origin main --force-with-lease
   ```

3. **Scan git history for others:**

   ```bash
   npm install -g detect-secrets
   detect-secrets scan
   detect-secrets audit .secrets.baseline
   ```

4. **Update all environments:**
   - Local dev: Update `.env`
   - CI/CD: Update GitHub Secrets / Platform settings
   - Production servers: Re-deploy with new secrets

---

## Security Scanning

### Pre-Commit Hooks

Install git-secrets to prevent accidental commits:

```bash
# Install git-secrets globally
git clone https://github.com/awslabs/git-secrets.git /tmp/git-secrets
cd /tmp/git-secrets
sudo make install

# Initialize in repo
git secrets --install
git secrets --register-aws
git secrets --add 'DATABASE_URL.*@'
git secrets --add 'SUPABASE_KEY=.*'
git secrets --add 'GITHUB_CLIENT_SECRET=.*'
```

### npm Audit in CI/CD

```bash
# Check for vulnerabilities
npm audit

# Auto-fix if updates available
npm audit fix

# Require moderate or higher severity to fail CI
npm audit --audit-level=moderate
```

### Dependency Updates

- **Automated**: Enable GitHub Dependabot
  - Settings → Code security and analysis → Dependabot
- **Manual**: Weekly dependency review
  ```bash
  npm outdated
  npm update
  ```

---

## Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] No real secrets in `.env.example`
- [ ] All production secrets in CI/CD platform secrets manager
- [ ] `package-lock.json` committed (no `--no-save`)
- [ ] Lockfile integrity verified before deploy
- [ ] `npm audit` passing in CI/CD
- [ ] Git-secrets or similar pre-commit hook installed locally
- [ ] Team trained on secret management procedures
- [ ] Incident response plan documented
- [ ] Quarterly secret rotation schedule set

---

## Development Best Practices

### ✅ DO

- Use `import.meta.env` for frontend configs (Vite)
- Use `process.env` with `.env` files for backend
- Store non-secrets in code (API endpoints, feature flags)
- Use strong, randomly-generated secrets (32+ bytes)
- Rotate secrets quarterly or after any access incident
- Document all required environment variables

### ❌ DON'T

- Commit `.env` files
- Hardcode API keys or passwords
- Log environment variables or secrets
- Share credentials via Slack/email
- Use weak or placeholder secrets in production
- Commit to main without passing security checks

---

## Additional Resources

- [OWASP: Environment Variables](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [GitHub: Managing secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase Security Docs](https://supabase.com/docs/guides/self-hosting/security/ssl)

---

**Last Updated:** April 2, 2026  
**Version:** 1.0.0
