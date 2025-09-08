/**
 * Menu Animation System using Motion library
 * Adds subtle animations to encourage exploration of inactive menu items
 */

class MenuAnimations {
    constructor() {
        this.inactiveMenuItems = [];
        this.animationInterval = null;
        this.isInitialized = false;
        console.log('MenuAnimations initialized');
        this.init();
    }
    
    init() {
        // Wait for menu to be ready and Motion library to load
        setTimeout(() => {
            if (typeof Motion !== 'undefined' || window.Motion) {
                this.setupAnimations();
                this.isInitialized = true;
                console.log('Menu animations setup complete');
            } else {
                console.warn('Motion library not loaded, retrying...');
                setTimeout(() => this.init(), 500);
            }
        }, 1000);
    }
    
    setupAnimations() {
        this.setupPulseAnimations();
        this.setupHoverAnimations();
    }
    
    setupPulseAnimations() {
        console.log('Setting up pulse animations');
        
        // Clear any existing interval
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        
        // Subtle pulse animation every 6 seconds for inactive items
        this.animationInterval = setInterval(() => {
            this.pulseInactiveItems();
        }, 6000);
        
        // Do an initial pulse after 2 seconds
        setTimeout(() => {
            this.pulseInactiveItems();
        }, 2000);
    }
    
    pulseInactiveItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach((item, index) => {
            if (!item.classList.contains('active-menu-item')) {
                const icon = item.querySelector('.menu-item-icon');
                if (icon && this.isElementVisible(icon)) {
                    // Use vanilla JavaScript animation if Motion is not available
                    if (window.Motion && window.Motion.animate) {
                        window.Motion.animate(icon, 
                            { 
                                scale: [1, 1.15, 1],
                                opacity: [0.5, 0.85, 0.5]
                            },
                            { 
                                duration: 2,
                                delay: index * 0.3,
                                easing: 'spring(1, 80, 10, 0)'
                            }
                        );
                    } else {
                        // Fallback CSS animation
                        this.fallbackPulseAnimation(icon, index);
                    }
                }
            }
        });
    }
    
    fallbackPulseAnimation(icon, index) {
        // Simple CSS-based animation fallback
        setTimeout(() => {
            icon.style.transition = 'transform 1s ease-in-out, opacity 1s ease-in-out';
            icon.style.transform = 'scale(1.15)';
            icon.style.opacity = '0.85';
            
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
                icon.style.opacity = '0.5';
            }, 1000);
        }, index * 300);
    }
    
    setupHoverAnimations() {
        const menuItems = document.querySelectorAll('.menu-item');
        console.log('Setting up hover animations for', menuItems.length, 'items');
        
        menuItems.forEach((item, index) => {
            const icon = item.querySelector('.menu-item-icon');
            if (!icon) return;
            
            // Mouse enter animation
            item.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active-menu-item')) {
                    if (window.Motion && window.Motion.animate) {
                        window.Motion.animate(icon, 
                            { 
                                scale: 1.25,
                                rotate: [0, 8, -8, 0],
                                opacity: 0.9
                            },
                            { 
                                duration: 0.6,
                                easing: 'spring(1, 100, 12, 0)'
                            }
                        );
                    } else {
                        // Fallback
                        icon.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                        icon.style.transform = 'scale(1.25)';
                        icon.style.opacity = '0.9';
                    }
                }
            });
            
            // Mouse leave animation
            item.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active-menu-item')) {
                    if (window.Motion && window.Motion.animate) {
                        window.Motion.animate(icon, 
                            { 
                                scale: 1, 
                                rotate: 0,
                                opacity: 0.5 
                            },
                            { duration: 0.4 }
                        );
                    } else {
                        // Fallback
                        icon.style.transform = 'scale(1)';
                        icon.style.opacity = '0.5';
                    }
                }
            });
        });
    }
    
    // Check if element is visible (not display: none or opacity: 0)
    isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.opacity !== '0' && style.visibility !== 'hidden';
    }
    
    // Called when the active menu item changes
    updateActiveItem() {
        console.log('Updating active item animations');
        if (this.isInitialized) {
            // Restart pulse animations with new active state
            this.setupPulseAnimations();
        }
    }
    
    // Clean up animations
    destroy() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        console.log('Menu animations destroyed');
    }
}

// Create global instance
window.menuAnimations = new MenuAnimations();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.menuAnimations) {
        window.menuAnimations.destroy();
    }
});