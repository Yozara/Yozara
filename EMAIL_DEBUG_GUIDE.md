# Email Verification Debug Checklist

## Likely Email Issue Root Causes (in order of probability):

### 1. **Supabase Email Configuration**
- [ ] SMTP settings not configured (emails disabled)
- [ ] Email rate limit exceeded
- [ ] Sender email not verified as bounce account
- [ ] Check in Supabase: Authentication → Email Templates → Sender email

### 2. **Redirect URL Misconfiguration**
- [ ] `NEXT_PUBLIC_SITE_URL` not set in Vercel env vars
- [ ] Domain not added to Supabase Auth → URL Configuration → Redirect URLs
- [ ] Missing `/auth/callback` route in allowed redirects
- [ ] Origin header detection failing

### 3. **Email Delivery**
- [ ] Check spam folder / promotions tab
- [ ] Verify email address is correct (typos in input)
- [ ] Check Supabase Logs → Auth → Failed email sends

## Current System Architecture

**Problem:** Email verification flow has multiple redirect steps that can break:

```
User Signs Up
  ↓
signUpAction sends emailRedirectTo + code via Supabase
  ↓ (requires user to click email link)
User clicks email link with code
  ↓
Browser hits /auth/callback?code=XXX&next=/onboarding
  ↓
Callback exchanges code for session
  ↓
Redirects to /onboarding
  ↓
User fills username/anime_class
  ↓
Redirects to /profile
```

**Failure Points:**
1. Email never sent (Supabase config issue)
2. Email link wrong domain (redirect URL issue)
3. Code expired (user waited too long)
4. Callback fails to exchange code (session issue)
5. Profile creation fails (RLS or trigger issue)

## Action Plan

### Step 1: Verify Supabase Configuration
```
Go to: Supabase Dashboard → your project
1. Auth → Email Templates
   - Confirm "Send email during signup" is ENABLED
   - Check sender email is configured
   
2. Auth → URL Configuration
   - Add: https://yozara.in (production)
   - Add: https://yozara.in/auth/callback
   - Local: http://localhost:3000/auth/callback
   
3. Auth → SMTP Configuration
   - If not using Supabase email, configure your SMTP
```

### Step 2: Code Fixes
- Add logging to auth flow
- Add automatic session creation on signup (no email verification required)
- Create alternative auth flow (magic link or OAuth)

### Step 3: User Communication
- Show error messages with next steps
- Link to support docs
