# XMBFolio 🎮

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
   git clone https://github.com/yourusername/XMBFolio.git
   cd XMBFolio
   ```

2. **Navigate to the latest version**
   ```bash
   cd v3
   ```

3. **Serve locally** (required for blog system to work)
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
v3/
├── index.html              # Main entry point
├── main.js                 # Core navigation & positioning (593 lines)
├── blog-system.js          # Markdown blog integration (278 lines)
├── mesh-gradient.js        # WebGL shader backgrounds (291 lines)
├── style.css              # Responsive styling (394 lines)
└── blog/                  # Markdown blog posts
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

The integrated blog system automatically loads Markdown files from the `blog/` folder and displays them in the Log menu section.

### Creating Blog Posts

1. Create a new `.md` file in the `blog/` folder
2. Add frontmatter with required fields:

```markdown
---
title: "Your Post Title"
date: "2024-01-15"
excerpt: "Brief description of your post"
---

# Your Post Content

Write your blog content in Markdown format...
```

3. Add the filename to `blog-system.js` in the `blogFiles` array:

```javascript
this.blogFiles = [
    '2024-01-15-welcome.md',
    'your-new-post.md'  // Add your file here
];
```

### Blog Features

- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Modal Viewer**: Full-screen blog post reader with PS3 styling
- **Frontmatter Parsing**: Automatic title, date, and excerpt extraction
- **Responsive Design**: Optimized reading experience on all devices

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
- **CSS3 Transforms** - Smooth menu animations
- **Markdown Parsing** - Custom lightweight parser
- **Responsive CSS** - Mobile-first design approach

### Performance Features
- **Hardware Acceleration** - WebGL rendering for smooth animations
- **Optimized Positioning** - Single source of truth for menu positioning
- **Efficient Rendering** - Minimal DOM manipulation
- **Mobile Optimization** - Reduced visual effects on mobile devices

### Browser-Specific Features
- **Safari Mobile** - Custom positioning calculations for proper display
- **Touch Events** - Native touch gesture support
- **Viewport Detection** - Responsive behavior based on screen size
- **WebGL Fallbacks** - Graceful degradation for unsupported browsers

## 📋 Development Notes

- Menu positioning uses a unified JavaScript system to prevent conflicts
- Blog system initializes after main navigation to ensure proper integration
- WebGL backgrounds use dual-layer rendering for visual depth
- CSS animations are minimized on mobile for performance

## 🎯 Version History

- **v3** (Current) - Full-featured XMB with blog system and WebGL backgrounds
- **v2** - Simplified XMB implementation with gradient backgrounds  
- **v1** - Initial XMB recreation with basic navigation

---

**Created with ❤️ as a tribute to the iconic PlayStation 3 XrossMediaBar interface**