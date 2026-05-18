# 📋 Environment Variables Reference

This document details all environment variables used by CodeSprint.

## Backend Environment Variables

### Database Configuration

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `DATABASE_URL` | String | ✅ Yes | `postgresql://user:pass@host:5432/db` | PostgreSQL connection string with credentials |
| | | | | **Use SSL:** `?sslmode=require` |

### Supabase Configuration

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `SUPABASE_URL` | String | ✅ Yes | `https://project-id.supabase.co` | Supabase project URL |
| `SUPABASE_KEY` | String | ✅ Yes | `sb_pub_xxxxx` | Public anon key (OK to expose) |
| `SUPABASE_SERVICE_KEY` | String | ✅ Yes | `eyJhbGc...` | Service role key (**KEEP SECRET**) |

### JWT & Security

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `SECRET_KEY` | String | ✅ Yes | Random 32+ char string | Used for JWT signing |
| `ALGORITHM` | String | ✅ Yes | `HS256` | JWT algorithm (recommend: HS256 or RS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Integer | ✅ Yes | `30` | JWT token lifetime (minutes) |
| `TOKEN_ENCRYPTION_KEY` | String | ✅ Yes | Base64 32 bytes | For encrypting sensitive tokens |

### Frontend URLs (CORS)

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `FRONTEND_URL` | String | ✅ Yes | `http://localhost:5173` | Development frontend URL |
| `FRONTEND_URL_PRODUCTION` | String | ✅ Yes | `https://app.codesprint.io` | Production frontend URL |

### OAuth Integration

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `GITHUB_CLIENT_ID` | String | ✅ Yes | Random string | From GitHub OAuth app settings |
| `GITHUB_CLIENT_SECRET` | String | ✅ Yes | Random string | **KEEP SECRET** from GitHub |
| `GITHUB_REDIRECT_URI` | String | ✅ Yes | `https://api.domain.com/oauth/callback` | Must match GitHub OAuth app config |

### Application Configuration

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `ENV` | String | ✅ Yes | `development` | Either `development` or `production` |
| `DEBUG` | Boolean | ✅ Yes | `False` | **Must be `False` in production** |

---

## Frontend Environment Variables

Frontend uses Vite environment variables (prefix: `VITE_`)

### API Configuration

| Variable | Type | Required | Example | Notes |
|----------|------|----------|---------|-------|
| `VITE_API_BASE` | String | ❌ No | `http://localhost:8000/api` | API server URL (optional, defaults to localhost) |
| `VITE_API_BASE_URL` | String | ❌ No | `https://api.domain.com/api` | Alternative API URL (fallback) |

---

## Setting Up Environment Variables

### Local Development

1. **Copy template:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Get credentials from Supabase:**
   - Go to: https://app.supabase.com
   - Select your project
   - Settings → API → Copy values:
     - `SUPABASE_URL` → Project URL
     - `SUPABASE_KEY` → `anon` key
     - `SUPABASE_SERVICE_KEY` → `service_role` key

3. **Get database password:**
   - Settings → Database → Note the password or reset it
   - Format URL: `postgresql://postgres:PASSWORD@host:5432/postgres`

4. **Generate secrets:**
   ```bash
   # Python
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Update `.env`:**
   ```bash
   # Fill in all values from Supabase and generated secrets
   # Do NOT commit this file!
   ```

### Staging/Production Deployment

**Option 1: Vercel**
```bash
# Add secrets to Vercel
vercel env add DATABASE_URL
vercel env add SUPABASE_URL
# ... repeat for all variables

# Deploy
vercel deploy --prod
```

**Option 2: GitHub Actions** (recommended)
```bash
# Add to GitHub Secrets:
# Settings → Secrets and variables → Actions

# In workflow, reference:
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  # ... rest of env vars
```

**Option 3: Docker Secrets**
```dockerfile
# Pass at runtime
docker run -e DATABASE_URL=$DATABASE_URL \
           -e SUPABASE_URL=$SUPABASE_URL \
           myapp:latest
```

**Option 4: AWS/Azure/GCP Secrets Manager**
```bash
# Store secrets in cloud provider's secrets service
# Retrieve at runtime via SDK

# AWS Example:
import boto3
client = boto3.client('secretsmanager')
secret = client.get_secret_value(SecretId='codesprint/prod')
DATABASE_URL = secret['SecretString']['DATABASE_URL']
```

---

## Variable Validation

### On Application Startup

The backend validates all required variables:

```python
# app/config.py
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")
```

### Check in CI/CD

```bash
# Verify all required variables are set
required_vars=(
  "DATABASE_URL"
  "SUPABASE_URL"
  "SUPABASE_KEY"
  "SUPABASE_SERVICE_KEY"
  "SECRET_KEY"
  "ALGORITHM"
  "ACCESS_TOKEN_EXPIRE_MINUTES"
  "TOKEN_ENCRYPTION_KEY"
  "FRONTEND_URL"
  "GITHUB_CLIENT_ID"
  "GITHUB_CLIENT_SECRET"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: $var is not set"
    exit 1
  fi
done
echo "✅ All required variables are set"
```

---

## Security Best Practices

✅ **DO:**
- Use strong, random secrets (32+ bytes)
- Rotate secrets quarterly
- Use different secrets per environment (dev/staging/prod)
- Store secrets in secure vaults (GitHub Secrets, Vercel, etc.)
- Audit who has access to secrets

❌ **DON'T:**
- Commit `.env` to git
- Use placeholder values in production
- Share secrets via Slack/email
- Use same secret for multiple environments
- Log environment variables
- Hardcode secrets in code

---

## Rotation Procedures

### Quarterly Rotation

1. **Generate new secrets:**
   ```bash
   # New JWT secret
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   
   # New encryption key
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Update in vault:**
   - Update GitHub Secrets / Vercel / Cloud provider
   - OR update `.env` file locally

3. **Redeploy application:**
   ```bash
   git push  # Triggers CI/CD with new secrets
   # OR
   vercel deploy --prod
   ```

### Emergency Rotation (After Compromise)

1. **Immediately:** Revoke compromised secrets
   - Supabase: Reset password + regenerate keys
   - GitHub OAuth: Regenerate secret
   - JWT: Deploy new `SECRET_KEY`

2. **Update all environments:**
   - Dev, Staging, Production

3. **Notify team:** Alert about security incident

4. **Audit:** Review access logs for suspicious activity

---

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Verify `.env` file exists in `backend/` directory
- Check PostgreSQL connection string format
- Ensure no typos in `DATABASE_URL` variable name

### "Invalid Supabase key"
- Verify using correct key (anon vs service role)
- Check for trailing/leading spaces in key
- Regenerate key in Supabase Dashboard

### "JWT token expired"
- Check `ACCESS_TOKEN_EXPIRE_MINUTES` value
- Verify server time is correct
- Client may need to refresh token

### "CORS error"
- Verify `FRONTEND_URL` matches actual frontend domain
- Check CORS middleware in backend
- Ensure protocol matches (http vs https)

---

**Reference Version:** 1.0.0  
**Last Updated:** April 2, 2026
