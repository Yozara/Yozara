# Database Setup & Debugging Guide

## Critical Issue: Supabase Database Not Getting Updated

The app cannot save user profiles because the database isn't properly configured.

## Step 1: Set Up Supabase Database

### Option A: Using Supabase Dashboard (Recommended for quick setup)

1. **Go to Supabase Dashboard**
   - Visit https://app.supabase.com
   - Select your project (Yozara)
   - Go to **SQL Editor**

2. **Run the SQL Setup Script**
   - Click **"New Query"**
   - Copy and paste the entire content from `DATABASE_SETUP.sql` (in this repo)
   - Click **"Run"** button
   - Verify: All statements execute successfully with no errors

3. **Verify Tables Exist**
   - Go to **Database** > **Tables**
   - You should see: `profiles` table
   - Click on `profiles` and verify columns: `id`, `username`, `anime_class`, `anipoints_balance`, `avatar_url`, `created_at`, `updated_at`

4. **Verify RLS Policies**
   - Go to **Authentication** > **Policies**
   - You should see 3 policies on `profiles`:
     - "Users can read own profile" (SELECT)
     - "Users can update own profile" (UPDATE)
     - "Users can insert own profile" (INSERT)

### Option B: Using Supabase CLI (if you have it installed)

```bash
# Connect to your Supabase project
supabase db pull

# Then run the SQL file
psql -h db.xxx.supabase.co -U postgres < DATABASE_SETUP.sql
```

## Step 2: Test the Auth Flow

1. **Clear Browser Data**
   - Open DevTools (F12)
   - Go to **Application** > **Storage** > **Clear site data**

2. **Test Signup**
   - Go to http://localhost:3000/signup
   - Create account with:
     - Email: `test@example.com`
     - Password: `MyPassword123`
   - Should successful (check browser console for logs)

3. **Monitor Console Logs**
   - Open DevTools Console (F12 > Console)
   - Look for these log messages:
     ```
     Signup result: { email: '...', userId: 'xxx-xxx', session: true, identities: 1 }
     Profile lookup on signin: { userId: 'xxx', profileExists: true, ... }
     Onboarding update result: { error: null, data: [{username: '...', anime_class: '...'}], userId: 'xxx' }
     ```

4. **Check Supabase Dashboard**
   - Go to **Database** > **Tables** > **profiles**
   - You should see a new row with the user's ID
   - After onboarding, `username` and `anime_class` should be populated

## Step 3: Debug If Still Not Working

### If profiles table doesn't exist:
1. Make sure you ran the SQL setup script
2. Check for any SQL errors in the Supabase dashboard

### If user rows aren't created on signup:
1. Check the trigger exists: **SQL Editor** > **Run**:
   ```sql
   SELECT trigger_name FROM information_schema.triggers WHERE table_name = 'authusers';
   ```
   Should show: `on_auth_user_created`

2. Manually trigger the function:
   ```sql
   SELECT public.handle_new_user();
   ```

### If roles/RLS policies are blocking:
1. Go to **Database** > **Roles** 
2. Check role: `authenticated`
3. Verify it has SELECT/UPDATE/INSERT on `profiles` table
4. Go to **Database** > **Tables** > **profiles** > **RLS** to view policies

### If you see permission errors in console:
1. This is an RLS policy issue
2. Make sure all 3 policies are created correctly
3. Test with a simpler policy first:
   ```sql
   -- Temporary: Allow all authenticated users (not recommended for production)
   CREATE POLICY "Allow all for testing" ON profiles
   FOR ALL USING (true);
   ```

## Step 4: Environment Variables

Make sure `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

Check these are set:
```bash
cat .env.local | grep SUPABASE
```

## Step 5: Test Full Flow

1. Signup with test account
2. Get redirected to onboarding
3. Enter username and anime class
4. Click "Claim 500 AniPoints"
5. Should redirect to profile page
6. Profile page should show username, anime class, and 500 AniPoints balance

## Console Logs to Watch

✅ **Success indicators:**
```
Signup result: { email: '...', userId: 'xxx', session: true, identities: 1 }
Profile lookup on signin: { userId: 'xxx', profileExists: true, hasUsername: false, hasAnimeClass: false }
Onboarding update result: { error: null, data: [...], userId: 'xxx' }
```

❌ **Error indicators:**
- `profileExists: false` → profiles table doesn't exist or trigger isn't firing
- `error: "permission denied"` → RLS policies blocking access
- `error: "relation does not exist"` → table not created

## Quick Sanity Check

Run this in Supabase SQL Editor:
```sql
-- Check table exists
SELECT * FROM information_schema.tables WHERE table_name = 'profiles';

-- Check RLS is enabled
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'profiles';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Check trigger
SELECT trigger_name FROM information_schema.triggers WHERE table_name = 'users';
```

All of these should return results (not empty).

---

**Questions?** Check the browser DevTools Console and Supabase Dashboard logs for detailed error messages.
