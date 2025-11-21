# 🚀 Quick Start Guide

Follow these steps to get your Memory Puzzle Game running locally and deployed to production.

## Prerequisites Checklist

Before you start, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **Supabase account** ([Sign up free](https://supabase.com))
- [ ] **Vercel account** ([Sign up free](https://vercel.com))
- [ ] **Git** installed (for deployment)

---

## 📦 Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
cd C:\Users\swaya\Desktop\Memory
npm install
```

This will install all required packages (~10-15 seconds).

---

## 🗄️ Step 2: Set Up Supabase Database

### 2.1 Create Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Enter project details:
   - **Name**: Memory Puzzle Game
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to you
4. Click **"Create new project"** (takes ~2 minutes)

### 2.2 Run Database Migration

1. Once project is ready, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file: `supabase/migrations/001_initial.sql`
4. Copy all the SQL code
5. Paste into the SQL Editor
6. Click **"Run"** button
7. You should see: "Success. No rows returned"

### 2.3 Get API Credentials

1. Go to **Settings → API** (left sidebar)
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

---

## 💾 Step 3: Set Up Vercel Blob Storage

### 3.1 Create Blob Store

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Storage** tab
3. Click **"Create Database"**
4. Select **"Blob"**
5. Enter name: `memory-puzzle-images`
6. Click **"Create"**

### 3.2 Get Blob Token

1. After creation, click on your blob store
2. Go to **".env.local"** tab
3. Copy the value of `BLOB_READ_WRITE_TOKEN`
   - It looks like: `vercel_blob_rw_xxxxxxxxxxxxx`

---

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Create .env.local File

In the project root, create a file named `.env.local`:

```bash
# You can copy from .env.example
copy .env.example .env.local
```

### 4.2 Add Your Credentials

Open `.env.local` and replace with your actual values:

```env
# Supabase (from Step 2.3)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel Blob (from Step 3.2)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxx
```

**⚠️ Important:** Never commit `.env.local` to Git! It's already in `.gitignore`.

---

## 🎮 Step 5: Run Locally

Start the development server:

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in XXXms
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

---

## ✅ Step 6: Test the Application

### First Time User Flow

1. **Landing Page**: Enter your name (e.g., "Alex")
2. **Click "Start Game"**
3. **Game Page**: Try clicking tiles to match pairs
4. **Refresh Page**: Your game should resume automatically!
5. **Click "📷 Custom Images"**
6. **Upload Page**: Try uploading a square image
7. **Return to Game**: Play with your custom images!

### Things to Test

- [ ] Enter name and start game
- [ ] Match some tiles
- [ ] Check auto-save indicator (Saving... → Saved ✓)
- [ ] Refresh page - game should resume
- [ ] Upload a square image (will fail if not square)
- [ ] Delete an uploaded image
- [ ] Complete a full game - see confetti!
- [ ] Try different grid sizes (4×4 vs 6×6)

---

## 🚀 Step 7: Deploy to Vercel

### 7.1 Push to GitHub

If not already done:

```bash
git init
git add .
git commit -m "Initial commit - Memory Puzzle Game"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 7.2 Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Click **"Import"**
5. **Add Environment Variables**:
   - Click **"Environment Variables"**
   - Add all three variables from your `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `BLOB_READ_WRITE_TOKEN`
6. Click **"Deploy"**

Your app will be live in ~2 minutes! 🎉

### 7.3 Test Production

1. Visit your Vercel URL (e.g., `https://memory-puzzle-xxx.vercel.app`)
2. Test all features on the live site
3. Share with friends!

---

## 🎨 Customization Ideas

### Change Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    500: '#YOUR_COLOR', // Change primary color
  },
  accent: {
    500: '#YOUR_COLOR', // Change accent color
  },
}
```

### Add More Default Images

Edit `app/game/page.tsx` and add more Unsplash URLs to `DEFAULT_IMAGES` array.

### Change Grid Sizes

Edit `lib/types.ts` to add more grid size options:

```typescript
export type GridSize = 4 | 6 | 8; // Add 8x8 option
```

---

## 🆘 Troubleshooting

### "npm is not recognized"

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### "Failed to upload image"

**Possible causes**:
- Image is not square (must be 1:1 ratio)
- Image is too large (max 5MB)
- `BLOB_READ_WRITE_TOKEN` is incorrect

**Solution**: Check console for errors, verify image dimensions

### "Database connection failed"

**Possible causes**:
- Supabase credentials are incorrect
- SQL migration wasn't run
- Project URL is wrong

**Solution**: 
1. Verify variables in `.env.local`
2. Re-run SQL migration in Supabase
3. Check Supabase dashboard for project status

### "Game not saving"

**Possible causes**:
- localStorage is disabled
- User ID not generated
- Supabase connection issue

**Solution**: 
1. Check browser console for errors
2. Open DevTools → Application → Local Storage
3. Verify `memory_puzzle_user_id` exists
4. Test Supabase connection

### Build Errors

If you get build errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run dev server | `npm run dev` |
| Build for production | `npm run build` |
| Run production build | `npm start` |
| Check for errors | `npm run lint` |

| Page | URL |
|------|-----|
| Landing | `http://localhost:3000` |
| Game | `http://localhost:3000/game` |
| Upload | `http://localhost:3000/upload` |

---

## ✨ You're All Set!

Your Memory Puzzle Game is now:
- ✅ Running locally
- ✅ Connected to Supabase
- ✅ Connected to Vercel Blob
- ✅ Ready for deployment

**Enjoy your beautiful memory game!** 🎉

If you have questions, check the [README.md](README.md) for more details.
