# 🎨 ComicKid Studio

A phone-first comic book creation app for young creators. Built with Next.js, Firebase, and Claude AI.

## Features

- 📚 **Library** — Active comics, finished masterpieces, and an Idea Vault
- ✏️ **Comic Editor** — Draw, add characters, speech bubbles, sound effects
- 🦸 **Character Builder** — Create simple SVG characters with custom colors & accessories
- 🤖 **ComicBot** — AI assistant powered by Claude for plot twists, names, dialogue
- 🌟 **Public Gallery** — Showcase finished comics with emoji reactions
- 📄 **PDF Export** — Print-ready A4 comic export

## Tech Stack

- **Frontend**: Next.js 14 (App Router, `src/` dir), Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (Google)
- **Storage**: Firebase Storage
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## Quick Start

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/comickid-studio.git
cd comickid-studio
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your Firebase and Anthropic API keys
```

### 3. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── ai-assist/     # Claude AI endpoint
│   ├── editor/[id]/       # Comic editor page
│   ├── gallery/           # Public gallery
│   ├── library/           # User's comic library
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx           # Landing / login
├── components/
│   ├── characters/
│   │   ├── CharacterBuilder.tsx
│   │   └── CharacterSVG.tsx
│   ├── editor/
│   │   ├── BubblePicker.tsx
│   │   └── ComicBot.tsx
│   └── ui/
│       └── BottomNav.tsx
├── lib/
│   ├── authContext.tsx
│   ├── comicsService.ts
│   ├── firebase.ts
│   └── pdfExport.ts
└── types/
    └── index.ts
```

## Firebase Setup

1. Create project at console.firebase.google.com
2. Enable **Authentication** → Google provider
3. Create **Firestore** database (test mode to start)
4. Enable **Storage**
5. Copy config to `.env.local`
6. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

## Deploying to Vercel

1. Push to GitHub
2. Import repo at vercel.com
3. Add all `.env.local` variables in Vercel dashboard
4. Deploy — every push to `main` auto-deploys!

## Security Notes

- **Never** commit `.env.local`
- `ANTHROPIC_API_KEY` has no `NEXT_PUBLIC_` prefix — stays server-side
- Firestore rules restrict comic access to owners + public read for published comics
- Reactions can be added by any authenticated user

## Roadmap Ideas

- [ ] Multi-panel layouts (2x2, 3-panel strips)
- [ ] Background scene library (city, space, forest)
- [ ] Comic sharing via link
- [ ] Export as image strip
- [ ] Parent dashboard to review before publishing
- [ ] Sound effect animations
- [ ] Guided tutorial for first-time users
