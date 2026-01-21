# AuLock Platform - Setup Guide

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account (free tier works fine)
- Git (optional, for version control)

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: AuLock Platform
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click "Create new project" and wait for setup to complete

### 1.2 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from the project root
4. Paste into the SQL editor
5. Click "Run" to execute the schema
6. Verify tables were created: Go to **Table Editor** and you should see:
   - `schools`
   - `profiles`
   - `qr_tokens`

### 1.3 Get Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 2: Configure Environment Variables

1. In the project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Create Test Users

### Option A: Using Supabase Dashboard (Recommended for testing)

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click "Add user" → "Create new user"
3. Create test users for each role:

**SuperAdmin:**
- Email: `admin@aulock.cl`
- Password: `Admin123!`
- After creation, go to **Table Editor** → **profiles**
- Find the user and set `role` to `superadmin`

**Profesor:**
- Email: `profesor@aulock.cl`
- Password: `Profe123!`
- Set `role` to `profesor` in profiles table
- Set `school_id` to the demo school ID

**Alumno (for QR testing):**
- Email: `alumno@aulock.cl`
- Password: `Alumno123!`
- Set `role` to `alumno` in profiles table
- Set `school_id` to the demo school ID

### Option B: Create QR Token for Student

1. Go to **Table Editor** → **qr_tokens**
2. Click "Insert row"
3. Fill in:
   - `user_id`: The UUID of the student from profiles table
   - `token`: `TEST_TOKEN_123` (or any unique string)
   - `is_active`: `true`
4. Save

Now students can access via: `http://localhost:5173/access?code=TEST_TOKEN_123`

## Step 5: Run the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Step 6: Test the Application

### Test Landing Page
1. Navigate to `http://localhost:5173`
2. You should see three role cards: Alumno, Profesor, SuperAdmin

### Test Teacher Login
1. Click "Profesor" card
2. Enter credentials:
   - Email: `profesor@aulock.cl`
   - Password: `Profe123!`
3. Should redirect to teacher dashboard

### Test QR Login
1. Navigate to `http://localhost:5173/access?code=TEST_TOKEN_123`
2. Should automatically log in and redirect to student dashboard

### Test SuperAdmin Login
1. Click "SuperAdmin" card
2. Enter admin credentials
3. Should redirect to admin dashboard

## Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server after changing `.env`

### "Token inválido" on QR login
- Verify token exists in `qr_tokens` table
- Check `is_active` is `true`
- Verify `user_id` matches a valid user

### Login fails with "Invalid credentials"
- Verify user exists in Supabase Auth
- Check profile exists in `profiles` table
- Verify role is set correctly

### PWA not installing
- PWA only works in production build (`npm run build && npm run preview`)
- Use HTTPS or localhost
- Check browser console for service worker errors

## Next Steps

After successful setup:
1. Customize the school name in Supabase `schools` table
2. Create real users for your institution
3. Generate unique QR tokens for students
4. Build out the dashboard functionality (Phase 2)

## Mobile App (Optional)

To run as a native Android app:
```bash
npm run build
npm run cap:sync
npm run cap:open:android
```

See `MOBILE_BUILD.md` for detailed mobile setup instructions.
