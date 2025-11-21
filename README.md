# 🎮 Memory Puzzle Game

A beautiful, production-ready Memory Puzzle Game built with Next.js 14, TypeScript, Supabase, and Vercel Blob Storage. Features custom image uploads, game state persistence, and a stunning modern UI with smooth animations.

![Memory Puzzle Game](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)

## ✨ Features

- **🎨 Custom Image Upload** - Upload your own square images to create personalized game boards
- **💾 Auto-Save Progress** - Game state is automatically saved after every move
- **🔄 Resume Game** - Continue from where you left off, even after closing the browser
- **👤 Player Profiles** - Create your profile and track your progress
- **🎯 Multiple Grid Sizes** - Play with 4×4 or 6×6 grids
- **🏆 Win Animations** - Beautiful confetti celebration when you complete the puzzle
- **📱 Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- **✨ Modern UI** - Glassmorphism, smooth animations, and vibrant gradients
- **🎭 Framer Motion** - Silky smooth animations and transitions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up free](https://supabase.com))
- A Vercel account ([sign up free](https://vercel.com))

### 1. Clone and Install

```bash
# Navigate to the project directory
cd Memory

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to **SQL Editor** and run the migration file:
   - Copy the contents of `supabase/migrations/001_initial.sql`
   - Paste and execute in the SQL Editor
4. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` `public` key

### 3. Set Up Vercel Blob Storage

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Create a new **Blob Store**
4. Copy the `BLOB_READ_WRITE_TOKEN`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📦 Deployment on Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `BLOB_READ_WRITE_TOKEN`
5. Click **Deploy**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

## 🎮 How to Play

1. **Enter Your Name** - Create your player profile on the landing page
2. **Start Game** - The game board will appear with face-down tiles
3. **Match Pairs** - Click tiles to reveal images and find matching pairs
4. **Win** - Match all pairs to see the victory animation!
5. **Custom Images** - Upload your own square images from the upload page

## 📂 Project Structure

```
memory-puzzle/
├── app/
│   ├── api/upload/        # Image upload API route
│   ├── game/              # Game page
│   ├── upload/            # Image upload page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── GameBoard.tsx      # Main game logic
│   ├── GameTile.tsx       # Individual tile with flip animation
│   ├── WinModal.tsx       # Victory modal with confetti
│   ├── ImageUploader.tsx  # Image upload component
│   ├── GameControls.tsx   # Game control buttons
│   └── PlayerProfile.tsx  # Player display
├── lib/
│   ├── supabase.ts        # Supabase configuration
│   ├── blob.ts            # Vercel Blob utilities
│   ├── gameLogic.ts       # Core game logic
│   └── types.ts           # TypeScript types
├── actions/
│   ├── profile.ts         # Profile server actions
│   ├── gameState.ts       # Game state server actions
│   └── images.ts          # Image management actions
├── utils/
│   ├── localStorage.ts    # Browser storage utilities
│   └── imageValidation.ts # Image validation
├── supabase/
│   └── migrations/
│       └── 001_initial.sql # Database schema
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🗄️ Database Schema

### Tables

**profiles**
- `id` (UUID, Primary Key)
- `name` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**images**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `blob_url` (Text)
- `blob_pathname` (Text)
- `created_at` (Timestamp)

**game_states**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key, Unique)
- `state` (JSONB)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🛠️ Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Storage**: Vercel Blob Storage
- **Deployment**: Vercel
- **UI**: Glassmorphism, Gradients, Custom Animations

## 🎨 Design Features

- Modern glassmorphism effects
- Vibrant color gradients (Primary blue + Accent purple)
- Smooth 3D flip animations on tiles
- Confetti celebration on win
- Responsive grid layouts
- Dark theme with premium aesthetics
- Micro-interactions and hover effects

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Yes |

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Run Production Build Locally

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 🐛 Troubleshooting

### Images Not Uploading

- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check that images are square (1:1 aspect ratio)
- Ensure images are under 5MB

### Database Connection Issues

- Verify Supabase URL and anon key
- Check that SQL migration was run successfully
- Ensure RLS policies are enabled

### Game Not Saving

- Check browser console for errors
- Verify userId is stored in localStorage
- Check Supabase connection

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Default images from [Unsplash](https://unsplash.com)
- Icons and design inspiration from modern UI/UX trends
- Built with ❤️ using Next.js and Supabase

## 🚀 Future Enhancements

- [ ] Multiplayer mode
- [ ] Leaderboard system
- [ ] Timer and scoring
- [ ] Difficulty levels
- [ ] Sound effects
- [ ] More grid size options
- [ ] Themes and customization
- [ ] Social sharing

---

**Made with 💜 by the Memory Puzzle Team**

For questions or support, please open an issue on GitHub.
