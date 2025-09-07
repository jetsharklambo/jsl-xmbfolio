/**
 * Simple Blog System for XMB Portfolio
 * Reads .md files from blog/ folder and integrates with navigation
 */

class BlogSystem {
    constructor() {
        this.posts = [];
        this.currentPost = null;
        this.blogFolder = 'blog/';
        
        // List of known blog post files (since we can't dynamically list files in browser)
        this.blogFiles = [
            '2024-01-15-welcome.md',
            '2024-02-10-development-update.md', 
            '2024-03-05-design-philosophy.md'
        ];
    }

    async initialize() {
        try {
            console.log('Initializing blog system...');
            await this.loadAllPosts();
            this.replaceBlogSubMenu();
            this.setupEventListeners();
            console.log(`Blog system initialized with ${this.posts.length} posts`);
        } catch (error) {
            console.error('Failed to initialize blog system:', error);
            this.setupFallbackMenu();
        }
    }

    async loadAllPosts() {
        console.log('Attempting to load blog posts...');
        const promises = this.blogFiles.map(filename => this.loadPost(filename));
        const results = await Promise.allSettled(promises);
        
        this.posts = results
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value)
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
        
        console.log(`Loaded ${this.posts.length} blog posts successfully`);
    }

    async loadPost(filename) {
        try {
            console.log(`Attempting to load: ${this.blogFolder}${filename}`);
            const response = await fetch(`${this.blogFolder}${filename}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'text/plain'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            const { frontmatter, body } = this.parseFrontmatter(content);
            
            console.log(`Successfully loaded: ${filename}`);
            return {
                filename,
                title: frontmatter.title || 'Untitled Post',
                date: frontmatter.date || '2024-01-01',
                excerpt: frontmatter.excerpt || '',
                content: body
            };
        } catch (error) {
            console.error(`Failed to load ${filename}:`, error.message);
            return null;
        }
    }

    parseFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            return { frontmatter: {}, body: content };
        }

        const frontmatterText = match[1];
        const body = match[2];
        const frontmatter = {};

        // Parse YAML-like frontmatter
        frontmatterText.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                frontmatter[key] = value;
            }
        });

        return { frontmatter, body };
    }

    replaceBlogSubMenu() {
        const logMenuItem = this.findLogMenuItem();
        if (!logMenuItem) {
            console.error('Log menu item not found');
            return;
        }

        const subMenuContainer = logMenuItem.querySelector('.sub-menu-item-container');
        if (!subMenuContainer) {
            console.error('Sub-menu container not found in Log menu item');
            return;
        }

        // Clear existing sub-menu items
        subMenuContainer.innerHTML = '';

        // Add blog posts as sub-menu items
        this.posts.forEach((post, index) => {
            const subMenuItem = this.createBlogSubMenuItem(post, index);
            subMenuContainer.appendChild(subMenuItem);
        });

        console.log(`Replaced Log sub-menu with ${this.posts.length} blog posts`);
    }

    findLogMenuItem() {
        const menuItems = document.querySelectorAll('.menu-item');
        for (const menuItem of menuItems) {
            const description = menuItem.querySelector('.menu-item-description');
            if (description && description.textContent.trim() === 'Log') {
                return menuItem;
            }
        }
        return null;
    }

    createBlogSubMenuItem(post, index) {
        const subMenuItem = document.createElement('div');
        subMenuItem.className = 'sub-menu-item';
        subMenuItem.dataset.blogIndex = index;
        
        subMenuItem.innerHTML = `
            <svg class="sub-menu-item-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.5,17H7.5L7.5,16L10.5,16V8H9L9,7H13.5V8H12V16H13.5V17Z" />
            </svg>
            <div class="sub-menu-item-header">${post.title}</div>
        `;

        return subMenuItem;
    }

    setupEventListeners() {
        // Listen for clicks on blog sub-menu items
        document.addEventListener('click', (e) => {
            const subMenuItem = e.target.closest('.sub-menu-item[data-blog-index]');
            if (subMenuItem) {
                const blogIndex = parseInt(subMenuItem.dataset.blogIndex);
                this.openBlogPost(blogIndex);
            }
        });

        // Listen for modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('blog-modal') || e.target.classList.contains('blog-modal-close')) {
                this.closeBlogPost();
            }
        });

        // Listen for escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentPost !== null) {
                this.closeBlogPost();
            }
        });
    }

    openBlogPost(index) {
        if (index < 0 || index >= this.posts.length) {
            console.error('Invalid blog post index:', index);
            return;
        }

        const post = this.posts[index];
        this.currentPost = index;

        // Create modal if it doesn't exist
        let modal = document.getElementById('blog-modal');
        if (!modal) {
            modal = this.createBlogModal();
            document.body.appendChild(modal);
        }

        // Update modal content
        const title = modal.querySelector('.blog-modal-title');
        const date = modal.querySelector('.blog-modal-date');
        const content = modal.querySelector('.blog-modal-content');

        title.textContent = post.title;
        date.textContent = this.formatDate(post.date);
        content.innerHTML = this.markdownToHTML(post.content);

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeBlogPost() {
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'hidden'; // Keep overflow hidden (XMB style)
        }
        this.currentPost = null;
    }

    createBlogModal() {
        const modal = document.createElement('div');
        modal.id = 'blog-modal';
        modal.className = 'blog-modal';
        
        modal.innerHTML = `
            <div class="blog-modal-content-wrapper">
                <div class="blog-modal-header">
                    <h1 class="blog-modal-title"></h1>
                    <span class="blog-modal-date"></span>
                    <button class="blog-modal-close">&times;</button>
                </div>
                <div class="blog-modal-content"></div>
            </div>
        `;

        return modal;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Simple markdown to HTML converter (basic implementation)
    markdownToHTML(markdown) {
        return markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            // Wrap in paragraphs
            .replace(/^(.)/gm, '<p>$1')
            .replace(/$(.)/gm, '$1</p>')
            // Clean up extra paragraph tags
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-6]>)/g, '$1')
            .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    }

    setupFallbackMenu() {
        console.log('Setting up fallback menu for blog system');
        // Keep original Activity/Archive items if blog loading fails
    }
}

// Global blog system instance
window.blogSystem = new BlogSystem();