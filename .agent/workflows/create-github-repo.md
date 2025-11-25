---
description: Steps to create a GitHub repository for this project
---

# Create GitHub Repository for Figma Replica

Follow these steps to create a GitHub repository and push your code:

## Step 1: Initialize Git Repository (if not already done)

```bash
cd "/Users/shashwat/Documents/Work/Cursor/Figms MCP Test/figma-replica"
git init
```

## Step 2: Create .gitignore file

Make sure you have a `.gitignore` file to exclude unnecessary files:

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/dist
/build

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Figma data (optional - remove if you want to include)
design.json
parsed-design.json
file_info.json
compass-node.json
button-data.json
EOF
```

## Step 3: Add all files to Git

```bash
git add .
```

## Step 4: Create initial commit

```bash
git commit -m "Initial commit: Figma replica with interactive components"
```

## Step 5: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `figma-replica` (or your preferred name)
   - **Description**: "Interactive Figma design replica with React, Vite, and Tailwind CSS"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 6: Connect local repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/figma-replica.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 7: Verify the upload

1. Refresh your GitHub repository page
2. You should see all your files uploaded
3. The README.md should be displayed on the repository homepage

## Optional: Create a README.md

If you don't have a README yet, create one:

```bash
cat > README.md << 'EOF'
# Figma Replica - Interactive Design Implementation

A pixel-perfect implementation of a Figma design featuring interactive components, smooth animations, and modern UI patterns.

## Features

- 🎨 **Pixel-perfect design** from Figma
- 🧭 **Interactive compass** with spin animation
- 🌧️ **Animated weather component** with rain drops
- 🎯 **Interactive CTA button** with hover effects and popup modal
- 📱 **Responsive design** (desktop & mobile views)
- ✨ **Smooth animations** and transitions
- 🎭 **Modern UI patterns** with soft shadows and blur effects

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/figma-replica.git
   cd figma-replica
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run sync` - Sync design data from Figma

## Project Structure

```
figma-replica/
├── src/
│   ├── App.tsx          # Main application component
│   └── index.css        # Global styles
├── public/              # Static assets (SVG exports from Figma)
├── package.json
└── README.md
```

## Components

### Compass
- Interactive spinning animation on click
- Exact Figma design with cardinal directions
- Smooth rotation transitions

### Record/SB Component
- Gradient background
- Custom typography

### Weather Component
- Pixelated cloud design
- Animated raindrops

### Big CTA Button
- Hover effects (color change, shadow growth, movement)
- Click to show modal popup
- Smooth transitions

## License

MIT

## Author

Your Name
EOF
```

Then commit and push the README:

```bash
git add README.md
git commit -m "Add README with project documentation"
git push
```

## Troubleshooting

### If you get authentication errors:

1. **Use Personal Access Token** instead of password:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` scope
   - Use the token as your password when pushing

2. **Or use SSH** instead of HTTPS:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/figma-replica.git
   ```

### If you need to change the remote URL:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/NEW_REPO_NAME.git
```

## Done! 🎉

Your code is now on GitHub and can be shared with others!
