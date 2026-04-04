# Streamlined Authentication Flow - Implementation Guide

## Current System Issues
1. Multiple redirects causing confusion (signup → email verification → callback → onboarding → profile)
2. Email verification can fail silently
3. Users get stuck if emails don't arrive
4. Onboarding is mandatory but could be optional

## New Streamlined Flow

### Option A: Better UX (Recommended)
```
1. User fills email + password
   ↓
2. Account created immediately (no email verification wait)
   ↓
3. Auto-redirect to onboarding (or skip to profile)
   ↓
4. User fills username + anime class (can skip)
   ↓
5. Sent to profile/home
```

### Option B: Keep Email Verification (Current)
But add:
1. Loading state with email sending confirmation
2. Resend button if user doesn't see email
3. Skip verification link (send fresh code)
4. Better error messages

## Email Verification Debugging Checklist

### Step 1: Verify Supabase Configuration
```bash
# In Supabase Console go to:
Authentication → Email Templates
- Confirm "Send email during signup" toggle is ON
- Verify sender email is configured
- Check email templates preview

Authentication → URL Configuration
- Add: https://yozara.in (production domain)
- Add: https://yozara.in/auth/callback (exact callback URL)
- Check localhost is not blocking production
```

### Step 2: Debug Code Issues
```typescript
// In auth.ts signUpAction:
// ✓ Using origin from request headers first
// ✓ Fallback to NEXT_PUBLIC_SITE_URL env var
// ✓ Finally fallback to localhost
// ✓ Email redirect URL should match Supabase configuration

// Check callback route:
// ✓ Code extraction from URL params
// ✓ Session exchange via supabase.auth.exchangeCodeForSession()
// ✓ Cookie setting via SSR client
```

### Step 3: Test Email Flow
1. Sign up with test email
2. Wait 5 seconds (might be slow)
3. Check email (including spam/promotions)
4. If not received:
   - Check Supabase Auth Logs or Email Templates section
   - Enable test SMTP if available
   - Check email domain isn't blocklisted

### Step 4: Alternative Auth Methods (if email problematic)
```
Option 1: OAuth (Google, GitHub)
- Eliminates email verification
- Instant login

Option 2: Magic Link (Supabase built-in)
- Works like click-to-verify but cleaner UX
- Set magic_link_duration in Supabase

Option 3: No email verification
- Create session immediately on signup
- Optional email confirmation later
```

## Implementation Tasks

### High Priority
- [ ] Add skip button to onboarding (auto-generate username if needed)
- [ ] Add favicon as default profile image
- [ ] Update delete account email (DONE - see route.ts)
- [ ] Make homepage show different content for logged-in users
- [ ] Add logout button in navbar (DONE - in dropdown)

### Medium Priority
- [ ] Add resend confirmation email button
- [ ] Improve error messages
- [ ] Add loading spinner during email exchange
- [ ] Create email verification success page

### Low Priority
- [ ] Add OAuth options (Google, Discord)
- [ ] Add magic link as backup
- [ ] Email template customization UI

## Configuration Needed

### Supabase Setup
```env
# Verify these are set:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Add callback URL to Supabase:
# Go to Authentication → URL Configuration
# Add Redirect URL: https://yozara.in/auth/callback
```

### Vercel Setup
```env
NEXT_PUBLIC_SITE_URL=https://yozara.in
RESEND_API_KEY=your-resend-key (for deletion email)
```

## Testing Checklist

- [ ] Sign up with new email
- [ ] Verify email arrives within 5 minutes
- [ ] Click verification link
- [ ] Auto-fill onboarding
- [ ] Skip onboarding and go to profile
- [ ] Profile shows user info correctly
- [ ] Navbar shows profile dropdown when logged in
- [ ] Delete account sends custom email
- [ ] Logout works and redirects to home
- [ ] Homepage shows different content for logged-in users

## Current Status
✅ Build fix (@anime/@manga pages dynamic)
✅ Navbar auth-aware dropdown
✅ Delete account email template
🔄 Email verification debugging
⏳ Homepage auth-aware content
⏳ Onboarding skip button
⏳ Default favicon profile image
