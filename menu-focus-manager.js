/**
 * MenuFocusManager - Intelligent viewport positioning for menu focus
 *
 * This module calculates optimal menu positioning to ensure:
 * 1. Active submenu content is prominently visible (right-of-center)
 * 2. All submenu items stay within viewport bounds
 * 3. Smooth navigation without clipping on mobile devices
 */

class MenuFocusManager {
    constructor(config) {
        this.config = config;
        this.menuContainer = null;
        this.menuItems = [];
        this.activeMenuItemIndex = 0;
    }

    /**
     * Initialize with DOM references
     */
    initialize() {
        this.menuContainer = document.querySelector('.menu-container');
        this.menuItems = Array.from(document.querySelectorAll('.menu-item'));

        if (!this.menuContainer || this.menuItems.length === 0) {
            console.error('MenuFocusManager: Required DOM elements not found');
            return false;
        }

        return true;
    }

    /**
     * Calculate optimal position for active menu item with submenu visibility priority
     * @param {number} activeIndex - Index of active menu item
     * @param {object} environment - Environment data from MenuPositionManager
     * @returns {object} { translateX, translateY, scale }
     */
    calculateOptimalPosition(activeIndex, environment) {
        this.activeMenuItemIndex = activeIndex;

        const platform = environment.platform;
        const viewport = environment.viewport;

        // Get platform-specific configuration
        const platformConfig = this.config.menuDimensions[platform];
        const focusConfig = this.config.submenuFocus[platform];
        const scale = this.config.platforms[platform].default.scale;

        if (!focusConfig || !focusConfig.enabled) {
            // Fallback to simple centering if focus config not available
            return this._calculateSimpleCentering(activeIndex, platformConfig, scale, viewport);
        }

        // Calculate submenu bounds and optimal positioning
        const position = this._calculateSubmenuOptimalPosition(
            activeIndex,
            platformConfig,
            focusConfig,
            scale,
            viewport
        );

        return position;
    }

    /**
     * Calculate position optimized for keeping active menu item at consistent viewport position
     * @private
     */
    _calculateSubmenuOptimalPosition(activeIndex, platformConfig, focusConfig, scale, viewport) {
        const itemWidth = platformConfig.itemWidth;
        const submenuWidth = platformConfig.submenuWidth || 300;
        const submenuLeftOffset = platformConfig.submenuLeftOffset || 0.1; // 10% of item width
        const padding = focusConfig.viewportPadding;

        // Use menuItemFocusOffset if available, otherwise fall back to submenuFocusOffset
        const itemFocusOffset = focusConfig.menuItemFocusOffset || focusConfig.submenuFocusOffset || 0.25;

        // Calculate where the active menu item currently is (in menu-container coordinates)
        const menuItemLeft = activeIndex * itemWidth;
        const menuItemCenter = menuItemLeft + (itemWidth / 2);

        // Apply scale to get actual rendered position
        const scaledMenuItemCenter = menuItemCenter * scale;

        // Calculate where the item SHOULD appear in viewport (e.g., 25% from left)
        const targetItemPosition = viewport.width * itemFocusOffset;

        // Calculate translateX needed to position the item's center at target position
        // With left: 0, container starts at viewport left edge
        // We need: scaledMenuItemCenter + translateX = targetItemPosition
        let idealTranslateX = targetItemPosition - scaledMenuItemCenter;

        // Now check if submenu would clip right edge with this positioning
        const submenuLeft = menuItemLeft + (itemWidth * submenuLeftOffset);
        const submenuRight = submenuLeft + submenuWidth;

        // Apply scale to submenu positions
        const scaledSubmenuRight = submenuRight * scale;

        // Calculate actual submenu right edge in viewport with proposed translateX
        const actualSubmenuRight = scaledSubmenuRight + idealTranslateX;

        let finalTranslateX = idealTranslateX;

        // If submenu would extend beyond right edge, shift left just enough to fit
        const maxRight = viewport.width - padding;
        if (actualSubmenuRight > maxRight) {
            const overflow = actualSubmenuRight - maxRight;
            finalTranslateX = idealTranslateX - overflow;
            console.log(`Submenu would overflow by ${overflow}px, adjusting translateX`);
        }

        // Calculate bounds - be very permissive on mobile to allow proper submenu visibility
        const totalMenuWidth = this.menuItems.length * itemWidth * scale;

        // Allow shifting far enough to show rightmost submenu items
        // Much more permissive than before - allow menu to extend well off-screen left
        const minTranslateX = -(totalMenuWidth + viewport.width);

        // Also ensure we don't shift so far right that first items are hidden
        const maxTranslateX = padding;

        // Apply bounds
        finalTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, finalTranslateX));

        // Log for debugging
        if (this.config.debug?.logPositionChanges) {
            console.log(`MenuFocusManager: item ${activeIndex} → target: ${targetItemPosition}px, translateX: ${Math.round(finalTranslateX)}px`);
        }

        return {
            translateX: finalTranslateX,
            translateY: 0,
            scale: scale
        };
    }

    /**
     * Simple centering fallback (old behavior, improved)
     * @private
     */
    _calculateSimpleCentering(activeIndex, platformConfig, scale, viewport) {
        const itemWidth = platformConfig.itemWidth;
        const scaledItemWidth = itemWidth * scale;

        const viewportCenter = viewport.width / 2;
        const activeItemCenter = activeIndex * scaledItemWidth + (scaledItemWidth / 2);
        const translateX = viewportCenter - activeItemCenter;

        return {
            translateX: translateX,
            translateY: 0,
            scale: scale
        };
    }

    /**
     * Get bounding rectangle of active submenu in viewport coordinates
     * Useful for debugging and validation
     */
    getActiveSubmenuBounds() {
        if (this.activeMenuItemIndex < 0 || this.activeMenuItemIndex >= this.menuItems.length) {
            return null;
        }

        const activeMenuItem = this.menuItems[this.activeMenuItemIndex];
        const submenuContainer = activeMenuItem.querySelector('.sub-menu-item-container');

        if (!submenuContainer) {
            return null;
        }

        const bounds = submenuContainer.getBoundingClientRect();
        return {
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            bottom: bounds.bottom,
            width: bounds.width,
            height: bounds.height,
            isFullyVisible: bounds.left >= 0 && bounds.right <= window.innerWidth
        };
    }

    /**
     * Check if current position keeps submenu in viewport
     */
    isSubmenuVisible() {
        const bounds = this.getActiveSubmenuBounds();
        return bounds ? bounds.isFullyVisible : false;
    }

    /**
     * Update active index without recalculating position
     */
    setActiveIndex(index) {
        this.activeMenuItemIndex = index;
    }

    /**
     * Get recommended translateX for a given menu item index
     * This is a helper for navigation transitions
     */
    getTranslateXForIndex(index, environment) {
        const position = this.calculateOptimalPosition(index, environment);
        return position.translateX;
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuFocusManager;
}
