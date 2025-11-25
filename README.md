# Figma Replica - Interactive Design Implementation

A pixel-perfect implementation of a Figma design featuring interactive components, smooth animations, and modern UI patterns.

## ✨ Features

- 🎨 **Pixel-perfect design** from Figma
- 🧭 **Interactive compass** with spin animation on click
- 📝 **Record/SB component** with gradient styling
- 🌧️ **Animated weather component** with pixelated rain drops
- 🎯 **Interactive CTA button** with hover effects and popup modal
- 📱 **Responsive design** (desktop & mobile views)
- ✨ **Smooth animations** and transitions
- 🎭 **Modern UI patterns** with soft shadows and blur effects
- 🪟 **Browser window mockup** with Safari-style chrome

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

## 🚀 Getting Started

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

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run sync` - Sync design data from Figma (requires FIGMA_API_KEY)

## 📁 Project Structure

```
figma-replica/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles & Tailwind imports
├── public/              # Static assets (SVG exports from Figma)
│   ├── 111-586.svg      # Compass component SVG
│   ├── 85-373.svg       # SB component SVG
│   └── 85-374.svg       # Weather component SVG
├── .agent/
│   └── workflows/       # Workflow documentation
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎮 Interactive Components

### 🧭 Compass Component
- Click to trigger spinning animation
- Exact Figma design with cardinal directions (N, S, E, W)
- Green circular needle with smooth rotation
- Subtle drop shadow for depth

### 📝 Record/SB Component
- Gradient background (gray to white)
- Custom Inter font typography
- White border accent

### 🌧️ Weather Component
- Pixelated cloud design using green circles
- Animated raindrops with infinite loop
- Staggered animation delays for natural effect

### 🎯 Big CTA Button
- **Normal state**: Bright lime green (#C7FF29)
- **Hover state**: 
  - Color changes to lighter green (#E2FF91)
  - Button lifts up with increased shadow
  - Smooth transitions
- **Click**: Opens modal popup with humorous message
- Pixel-perfect Figma implementation

### 🪟 Modal Popup
- Clean, modern design with rounded corners
- Backdrop blur effect
- Smooth bounce-in animation
- Click outside or X button to close

## 🎨 Design Details

- **Color Palette**: 
  - Primary: `#C7FF29` (Lime Green)
  - Background: `#F3F7FF` (Light Blue)
  - Accents: `#1A1D1C` (Near Black)
- **Typography**: Inter font family
- **Animations**: Custom keyframe animations for smooth interactions
- **Shadows**: Soft drop shadows (8px blur, 8% opacity)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

MIT

## 👤 Author

Built with ❤️ using Figma design specifications
