# 🚀 Deploy to Vercel

## Quick Deploy

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Deploy

## Project Structure
```
encrypty/
├── frontend/          # All frontend files (served by Vercel)
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── ...
├── vercel.json        # Vercel configuration
├── package.json       # Project metadata
└── .vercelignore      # Files to exclude from deployment
```

## Important Settings
- **Root Directory**: `frontend`
- **Build Command**: (empty - static site)
- **Output Directory**: (empty)
- **Framework**: None (static site)

## After Deployment
Your site will be available at: `https://your-project.vercel.app`
