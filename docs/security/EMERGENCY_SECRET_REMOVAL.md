# ⚠️ EMERGENCY: Removing Secrets from Git History

**If you've accidentally committed `.env` files or secrets, follow these steps IMMEDIATELY.**

---

## ⏰ Urgency

This is a **CRITICAL SECURITY ISSUE**. Secrets in git history are:
- Accessible to anyone with repository access
- Archived on GitHub servers even after deletion
- Potentially cached in CI/CD logs and backups
- **Must be rotated immediately**

---

## Step 1: Rotate All Secrets (RIGHT NOW)

Before removing from history, **generate new credentials immediately**:

### Supabase
1. Go to: https://app.supabase.com → Your Project
2. Settings → Database
3. Click "Reset password" - **use a new strong password**
4. Settings → API → Regenerate both:
   - Anon key
   - Service role key

### GitHub OAuth
1. Go to: https://github.com/settings/developers
2. Find the OAuth app used by CodeSprint
3. Regenerate `Client Secret`
4. Update `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### JWT Secrets
Generate new value:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
# OR
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Step 2: Remove `.env` from Git History

**WARNING: This rewrites git history!**

### Check what will be removed:
```bash
git log --all --full-history -- "backend/.env"
```

### Option A: Using git filter-branch (Simple)

```bash
# Remove .env from all commits
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env' \
  HEAD

# Remove from all branches
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env' \
  -- --all

# Remove refs to old commits
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Option B: Using BFD (Fast, Recommended)

```bash
# Download BFD (Blob Filter Daemon)
# https://rtyley.github.io/bfg-repo-cleaner/

java -jar bfg.jar --delete-files backend/.env .
java -jar bfg.jar --delete-files frontend/.env .

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Option C: Using git-filter-repo (Modern)

```bash
pip install git-filter-repo

git filter-repo --invert-paths --path backend/.env
git filter-repo --invert-paths --path frontend/.env
```

---

## Step 3: Force Push Changes

**CRITICAL: Coordinate with team - this affects all developers!**

```bash
# Push rewritten history to all branches
git push origin main --force-with-lease
git push origin develop --force-with-lease

# Or for all branches:
git push --all --force-with-lease
```

---

## Step 4: Team Cleanup

Notify all team members to:

```bash
# Each team member must run:
# This discards their local history and pulls the cleaned version

# 1. Stash any uncommitted work
git stash

# 2. Fetch new history
git fetch origin

# 3. Reset to clean history
git reset --hard origin/main
git reset --hard origin/develop

# 4. Clean up local git objects
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Restore stashed work
git stash pop
```

---

## Step 5: Verify Removal

Confirm `.env` no longer exists in history:

```bash
# Should return nothing
git log --all --full-history -- "backend/.env"
git log --all --full-history -- "frontend/.env"

# Should be empty
git log -p -S "DATABASE_URL.*@" --all
git log -p -S "SUPABASE_KEY=" --all
```

---

## Step 6: Update CI/CD & Deployments

Update in your deployment platform:

### GitHub Secrets
```
Settings → Secrets and variables → Actions
- DATABASE_URL: [NEW VALUE]
- SUPABASE_URL: [NEW VALUE]
- SUPABASE_KEY: [NEW VALUE]
- SUPABASE_SERVICE_KEY: [NEW VALUE]
- SECRET_KEY: [NEW VALUE]
- TOKEN_ENCRYPTION_KEY: [NEW VALUE]
- GITHUB_CLIENT_ID: [NEW VALUE]
- GITHUB_CLIENT_SECRET: [NEW VALUE]
```

### Vercel
```
Project Settings → Environment Variables
[Update all to new values]
```

### Production Servers
```bash
# SSH into production
ssh user@prod-server

# Update environment (specific to your setup)
# Docker: Update secrets volume
# Systemd: Update /etc/default/app-env
# Heroku: heroku config:set KEY=value
```

---

## Step 7: Notify Stakeholders

**Security Incident Notification:**

To: [Security Team, Leads, DevOps]

Subject: Security Incident - Secrets Accidentally Committed

Body:
```
A security incident occurred on [DATE]:

Accidental Commit Details:
- Files exposed: backend/.env, frontend/.env
- Exposure duration: [TIME PERIOD]
- What was exposed: Database credentials, API keys, JWT secrets

Actions Taken:
- All secrets rotated (Supabase DB, GitHub OAuth, JWT keys)
- Removed from git history using git filter-branch
- Force-pushed cleaned repository
- Updated CI/CD platform secrets
- Updated production environment
- Audited access logs (no suspicious activity detected)

Follow-up:
- All team members will resync repositories
- Verify no rogue deployments occurred
- Review database access logs
- Schedule security training refresher
```

---

## Prevention for Future

### Automatic Detection

Add pre-commit hook:

```bash
# Install gitleaks
brew install gitleaks  # or apt-get / scoop

# Initialize in repo
git secrets --install
git secrets --register-aws
git secrets --add 'DATABASE_URL'
git secrets --add 'SUPABASE_KEY'
git secrets --add 'GITHUB_CLIENT_SECRET'

# Now git commit will fail if you try to commit secrets!
```

### CI/CD Scanning

Add to GitHub Actions:

```yaml
- name: Detect Secrets
  run: |
    pip install detect-secrets gitleaks
    detect-secrets scan --all-files
    gitleaks detect --source git --verbose
```

### Code Review

- Always review `.env` in `.gitignore`
- Check `.env.example` for placeholders only
- Never approve PRs with environment files

---

## Rollback (If Needed)

If something goes wrong:

```bash
# This is why we use --force-with-lease instead of --force
# It prevents overwriting someone else's concurrent push

# If you made a mistake before pushing:
git reflog
git reset --hard [old-commit-hash]

# If already pushed, contact repository admin
```

---

## Additional Resources

- [git-filter-repo docs](https://github.com/newren/git-filter-repo)
- [BFD (Blob Filter Daemon)](https://rtyley.github.io/bfg-repo-cleaner/)
- [GitHub: Removing sensitive data from history](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

## Summary Checklist

- [ ] Generated new Supabase credentials
- [ ] Generated new GitHub OAuth secret
- [ ] Generated new JWT secret
- [ ] Updated `.env.example` with placeholders only
- [ ] Ran git filter-branch to remove `.env`
- [ ] Force-pushed cleaned history
- [ ] Updated GitHub Secrets
- [ ] Updated Vercel/production environment
- [ ] Verified `.env` no longer in history
- [ ] Notified team to re-sync
- [ ] Documented incident
- [ ] Implemented pre-commit hooks for future

---

**CRITICAL:** Do not skip any steps. Incomplete removal leaves secrets exposed.

**Questions?** Contact security team or DevOps lead.

Date completed: __________  
Completed by: __________  
Reviewed by: __________
