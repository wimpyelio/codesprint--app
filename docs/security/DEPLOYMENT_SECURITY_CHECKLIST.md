# 🚀 Pre-Deployment Security Checklist

Use this checklist before any deployment to production.

**Date:** _____________  
**Deployed By:** _____________  
**Deployment Target:** [ ] Staging [ ] Production

---

## ✅ Secrets Management

- [ ] All `.env` files are git-ignored
- [ ] No `.env` files exist in git history (`git log --all -- "*.env"`)
- [ ] All secrets rotated in past 90 days
- [ ] Secrets in `.env` match production values
- [ ] `.env.example` contains ONLY placeholders (no real secrets)
- [ ] No credentials in any source code files
- [ ] No credentials in commit messages or PR descriptions

### If deploying to new environment:

- [ ] Created new API keys in Supabase
- [ ] Generated new JWT secrets
- [ ] Created new OAuth credentials (if needed)
- [ ] Updated CI/CD platform secrets:
  - [ ] `DATABASE_URL`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `SECRET_KEY`
  - [ ] `TOKEN_ENCRYPTION_KEY`
  - [ ] `GITHUB_CLIENT_ID`
  - [ ] `GITHUB_CLIENT_SECRET`

---

## ✅ Code Quality

- [ ] `npm audit` passes (no critical/high issues)
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] No console.log statements with sensitive data
- [ ] No hardcoded API endpoints (except public URLs)
- [ ] All environment variables properly typed

---

## ✅ Dependency Security

- [ ] `package-lock.json` is up-to-date and committed
- [ ] No Git-based dependencies (all from npm registry)
- [ ] No suspicious package updates in last 30 days
- [ ] Verified all direct dependencies (3 packages)
- [ ] Verified critical devDependencies haven't changed maintainers
- [ ] SBOM generated and reviewed (if required)

---

## ✅ Frontend Security

- [ ] No tokens/secrets in `localStorage` on page load
- [ ] API calls to correct base URL (not hardcoded)
- [ ] OAuth state validation enabled
- [ ] CSRF tokens properly handled
- [ ] No external CDN scripts (besides trusted vendors)
- [ ] CSP headers configured

---

## ✅ Backend Security

- [ ] Database using SSL/TLS (`sslmode=require`)
- [ ] JWT token expiration set appropriately
- [ ] CORS configured to allowed domains only
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] Debug mode disabled in production (`DEBUG=False`)

---

## ✅ CI/CD Pipeline

- [ ] Security scanning job passes
- [ ] Secrets detection job passes
- [ ] Lockfile integrity verified
- [ ] No build artifacts with credentials
- [ ] Deployment logs don't expose secrets
- [ ] All environment variables sourced from secrets manager

---

## ✅ Monitoring & Alerting

- [ ] Error logging configured
- [ ] Secrets not logged (never log `process.env`)
- [ ] Alert configured for failed auth attempts
- [ ] Alert configured for unusual database access
- [ ] Log retention policy set

---

## ✅ Documentation

- [ ] SECURITY.md reviewed and current
- [ ] Runbook created for incident response
- [ ] Team trained on secret rotation procedures
- [ ] Backup/recovery procedures documented
- [ ] Emergency contacts listed

---

## ✅ Post-Deployment

- [ ] Health check endpoint responding
- [ ] Database connection successful
- [ ] API authentication working
- [ ] Frontend loads without errors
- [ ] OAuth integration functional
- [ ] Monitoring alerts active

---

## 🔴 CRITICAL - DO NOT DEPLOY IF:

- [ ] ❌ Any `.env` file in git repository
- [ ] ❌ Database credentials in source code
- [ ] ❌ API keys in commit history
- [ ] ❌ `npm audit` shows critical vulnerabilities
- [ ] ❌ Malware/security scanning failed
- [ ] ❌ Untested code in main branch

---

## Rollback Plan

In case of security incident:

1. **Immediate:**
   - Rotate all secrets in Supabase, GitHub, etc.
   - Revoke problematic API keys
   - Review access logs for suspicious activity

2. **Within 1 hour:**
   - Deploy previous known-good version
   - Update application secrets in all environments
   - Notify security team

3. **Post-incident:**
   - Root cause analysis
   - Update security procedures
   - Notify affected users if needed
   - Document lessons learned

---

**Checklist Version:** 1.0.0  
**Last Updated:** 2026-04-02  

Use this checklist for every deployment. Keep signed copies for compliance records.
