# XMBFolio 🎮

> 🎮 This is JSL's personal implementation of [XMBFolio](https://github.com/jetsharklambo/xmbfolio). For the customizable template that you can fork and make your own, please visit the main XMBFolio repository.

A stunning portfolio website inspired by Sony PlayStation 3's iconic XrossMediaBar (XMB) interface. Built with modern web technologies including WebGL shaders, responsive design, and an integrated blog system.

## ✨ Features

- **🎯 Authentic XMB Navigation** - Faithful recreation of PS3's horizontal/vertical menu system
- **🌊 Dynamic WebGL Backgrounds** - Dual-layer mesh gradient system with customizable colors
- **📝 Integrated Blog System** - Markdown-powered blog posts that integrate seamlessly with navigation
- **📱 Cross-Platform Responsive** - Optimized for desktop, mobile, and tablet with touch support
- **⌨️ Multiple Input Methods** - Keyboard arrows, touch gestures, and mouse navigation
- **🎨 Modern PS3 Aesthetic** - Black background with green accent theming

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/jetsharklambo/jsl-xmbfolio.git
   cd XMBFolio
   ```

2. **Navigate to the latest version**
   ```bash
   cd v3
   ```

3. **Serve locally** (required for GitHub API requests)
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using any other static server
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
.
├── index.html                    # Main entry point
├── main.js                       # Core navigation logic
├── blog-system.js                # Blog integration (fetches from GitHub)
├── blog-posts.json               # Pre-generated blog index (auto-updated daily)
├── mesh-gradient.js              # WebGL shader backgrounds
├── menu-config.js                # Comprehensive menu positioning config
├── menu-position-manager.js      # Cross-platform positioning system
├── menu-focus-manager.js         # Smart submenu positioning for mobile
├── menu-control-panel.js         # Debug controls and user interface
├── menu-debug.js                 # Debug overlay and visualization
├── style.css                     # Responsive styling
├── .github/workflows/
│   └── generate-blog-index.yml   # Auto-generates blog-posts.json daily
├── scripts/
│   ├── generate-blog-index.js    # Blog index generator script
│   └── package.json              # Script dependencies
└── blog/                         # Markdown blog posts
    ├── 2024-01-15-welcome.md
    ├── 2024-02-10-development-update.md
    └── 2024-03-05-design-philosophy.md
```

## 🎮 Navigation

### Desktop
- **Arrow Keys**: Navigate through menus
- **Mouse**: Click on menu items to navigate
- **Hover**: Visual feedback on interactive elements

### Mobile
- **Touch**: Tap menu items to navigate
- **Swipe Gestures**: 
  - Horizontal swipes: Navigate main menu
  - Vertical swipes: Navigate sub-menus

## 📝 Blog System

The integrated blog system uses a **GitHub Actions workflow** to automatically generate a static JSON index of blog posts. This approach eliminates rate limiting issues and provides faster page loads.

### How It Works

1. **GitHub Action**: Runs daily (and on blog changes) to scan all `.md` files in `blog/` folder
2. **JSON Generation**: Creates `blog-posts.json` with parsed frontmatter and content
3. **Static Fetching**: Client fetches pre-generated JSON (no API rate limits!)
4. **Auto-Updates**: New blog posts appear automatically within 24 hours (or immediately on push)
5. **GitHub Links**: Clicking a blog post opens the GitHub page with an anchor to the first heading

### Creating Blog Posts

1. **Create a new `.md` file** in the `blog/` folder
2. **Add frontmatter** with required fields:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
excerpt: "Brief description of your post"
---

# Your Post Content

Write your blog content in Markdown format...
```

3. **Commit to GitHub** - The GitHub Action will automatically:
   - Detect the new/modified blog post
   - Regenerate `blog-posts.json`
   - Commit the updated JSON file
   - Your site will show the new post on next page load!

### Blog Features

- **GitHub Actions Automation**: Automatic JSON generation on schedule or blog changes
- **No Rate Limiting**: Fetches static JSON file instead of GitHub API
- **Faster Loading**: Single request instead of N+1 API calls
- **Smart Link Generation**: Links to GitHub with anchors to first headings
- **Frontmatter Parsing**: Automatic title, date, and excerpt extraction
- **Zero Maintenance**: Fully automated workflow
- **GitHub Rendering**: Posts display with GitHub's native Markdown renderer

### Workflow Configuration

The GitHub Action (`.github/workflows/generate-blog-index.yml`) runs:
- **Daily** at midnight UTC
- **On push** to `blog/` folder (instant updates)
- **Manually** via workflow dispatch

To customize for your repository:

```javascript
// In blog-system.js, update the GitHub raw URL:
this.blogIndexUrl = 'https://raw.githubusercontent.com/yourusername/yourrepo/main/blog-posts.json';
```

```javascript
// In scripts/generate-blog-index.js, update repo info:
const GITHUB_REPO = 'yourusername/yourrepository';
const GITHUB_BRANCH = 'main';
```

## 🎨 Customization

### Colors

Modify the gradient colors in `main.js`:

```javascript
// Primary gradient layer
const primaryGradient = new MeshGradientRenderer('background-primary', {
    colors: ['#000000', '#1a3b1a', '#2d5a27', '#0f1f0f'], // Customize these
    speed: 0.3,
    distortion: 0.8,
    opacity: 1.0
});
```

### Menu Items

Edit the menu structure in `index.html`:

```html
<div class="menu-item">
    <div class="menu-item-header">
        <svg class="menu-item-icon" viewBox="0 0 24 24">
            <!-- Your custom SVG icon -->
        </svg>
        <div class="menu-item-description">Your Menu Item</div>
    </div>
    <!-- Sub-menu items -->
</div>
```

### Positioning

Adjust menu positioning for different browsers in `main.js`:

```javascript
// Mobile positioning
let rightPercent = isMobileDevice ? 0.0 : 0.25;
let horizontalOffset = isMobileDevice ? 0 : 0;
```

## 🌐 Browser Support

- **WebGL Required**: Modern browsers with WebGL support
- **Tested Browsers**: 
  - Chrome/Chromium (Desktop & Mobile)
  - Safari (Desktop & Mobile) - with specific positioning adjustments
  - Firefox (Desktop & Mobile)
  - Edge (Desktop & Mobile)

## 📱 Mobile Optimizations

- **Touch-first Design**: Optimized touch targets and gestures
- **Performance**: Reduced animations and optimized rendering
- **Responsive Layout**: Adaptive sizing for different screen sizes
- **Safari Compatibility**: Special positioning adjustments for Safari mobile

## 🛠️ Technical Details

### Core Technologies
- **Vanilla JavaScript** - No external dependencies
- **WebGL/WebGL2** - Hardware-accelerated background rendering
- **GitHub Actions** - Automated blog post indexing
- **Static JSON Fetching** - No API rate limits
- **CSS3 Transforms** - Smooth menu animations
- **Frontmatter Parsing** - Custom YAML-like parser
- **Responsive CSS** - Mobile-first design approach

### Performance Features
- **Hardware Acceleration** - WebGL rendering for smooth animations
- **Smart Mobile Positioning** - MenuFocusManager keeps active items centered
- **Z-Index Elevation** - Active menu items render above adjacent menus
- **Optimized Blog Loading** - Single JSON request vs N+1 API calls
- **No Rate Limiting** - Static file fetching from GitHub raw content
- **Mobile Optimization** - Touch-optimized interface with proper text wrapping
- **Cross-Browser Compatibility** - Browser-specific positioning adjustments

### Advanced Features
- **Automated Blog Pipeline** - GitHub Actions generates blog index on schedule/push
- **Debug Control Panel** - Real-time menu positioning with visual feedback
- **Environment Detection** - Automatic device, browser, and viewport detection
- **User Preferences** - LocalStorage persistence for custom positioning
- **Touch Gesture Support** - Native touch events with conflict resolution
- **Smart Submenu Positioning** - Dynamic boundary calculations for mobile centering
- **GitHub Link Anchors** - Smart heading detection for direct navigation

## 📋 Development Notes

- **Positioning System**: MenuFocusManager with smart boundary calculations for mobile
- **Blog Automation**: GitHub Actions workflow generates static JSON index (no rate limits)
- **WebGL Backgrounds**: Dual-layer mesh gradient rendering for visual depth
- **Mobile Centering**: Active items positioned at 25% from left with submenu visibility priority
- **Click Handling**: Z-index elevation and pointer-events ensure correct submenu interactions
- **Browser Detection**: Automatic environment detection with platform-specific configurations

## 🎯 Version History

- **v3** (Current) - Full-featured XMB with blog system and WebGL backgrounds
- **v2** - Simplified XMB implementation with gradient backgrounds  
- **v1** - Initial XMB recreation with basic navigation

## 🙏 Credits & Acknowledgments

This project builds upon the excellent work of:

- **Menu System**: Inspired by and adapted from [ps3-xmb-menu](https://github.com/mustafaHTP/ps3-xmb-menu) by [mustafaHTP](https://github.com/mustafaHTP)
- **WebGL Background**: Based on mesh gradient shaders from [Paper Design Shaders](https://github.com/paper-design/shaders)
- Train by Jamison Wieser from <a href="https://thenounproject.com/browse/icons/term/train/" target="_blank" title="Train Icons">Noun Project</a> (CC BY 3.0)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Created with ❤️ as a tribute to the iconic PlayStation 3 XrossMediaBar interface**
