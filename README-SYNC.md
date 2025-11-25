# 🎨 Figma Auto-Sync Guide

Your React app now automatically syncs with Figma changes! Here's everything you need to know.

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Dev Server with Auto-Refresh
```bash
npm run dev
```

Your browser will now auto-refresh every 5 seconds to show any code changes!

## 📝 How It Works

### Auto-Refresh (5 seconds)
- Your dev server checks for file changes every 5 seconds
- When you or the sync script updates code, the browser automatically refreshes
- No need to manually refresh the page!

### Manual Figma Sync (When You Need It)
Since Figma's MCP doesn't support real-time webhooks, you'll sync manually when you make Figma changes:

1. Make changes in Figma
2. Tell me "sync figma" or "update from figma"
3. I'll pull the latest design and update your code
4. The browser will auto-refresh in 5 seconds!

## 🎯 Commands You Can Use

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start dev server with auto-refresh |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🔧 Configuration

### Change Auto-Refresh Interval
Edit `vite.config.ts` and change the `interval` value:
```typescript
watch: {
  usePolling: true,
  interval: 5000, // Change this (in milliseconds)
}
```

### Figma File Settings
Your current Figma file:
- **File Key**: `XJETBSzefFXS8hLHAlKYy1`
- **Node ID**: `85-27`
- **File URL**: https://www.figma.com/design/XJETBSzefFXS8hLHAlKYy1

## 💡 Tips

1. **Keep the terminal open** - The dev server needs to run for auto-refresh to work
2. **Just tell me to sync** - Whenever you change Figma, just say "sync figma" and I'll update everything
3. **Check the browser** - After changes, wait 5 seconds and your browser will refresh automatically

## ❓ Troubleshooting

**Browser not refreshing?**
- Make sure `npm run dev` is running
- Try hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

**Changes not showing?**
- Tell me "sync figma" to pull latest design
- Wait 5 seconds for auto-refresh

## 🎉 That's It!

You're all set! Just:
1. Run `npm run dev`
2. Open http://localhost:5173
3. Make Figma changes and tell me to sync
4. Watch your browser auto-refresh!

Happy designing! 🚀


