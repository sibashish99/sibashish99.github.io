// Color Switcher - Global Floating Widget
(function() {
    'use strict';

    const STORAGE_KEY = 'sibashish-bg-color';
    const DEFAULT_COLOR = '#ffff00';
    let currentColor = DEFAULT_COLOR;

    const colors = {
        white:  { label: 'White',  value: '#ffffff', gradient: 'linear-gradient(to bottom, #dbdbdb 0%, #dfdede 35%, #f5f5f5 70%, #ffffff 100%)' },
        green:  { label: 'Green',  value: '#00AA44', gradient: 'linear-gradient(to bottom, #00ff11 0%, #42fc89 30%, #93f9bc 60%, #f5f5f5 100%)' },
        yellow: { label: 'Yellow', value: '#FFFF00', gradient: 'linear-gradient(to bottom, #ffd500 0%, #f7d83c 30%, #f6f679 60%, #f5f5f5 100%)' },
        orange: { label: 'Orange', value: '#FF8800', gradient: 'linear-gradient(to bottom, #ff6200 0%, #fb7e40 30%, #f9b76b 60%, #f5f5f5 100%)' }
    };

    // Initialize color switcher
    function init() {
        // Create floating widget
        createFloatingWidget();
        
        // Load saved color or apply default
        const savedColor = localStorage.getItem(STORAGE_KEY);
        if (savedColor) {
            applyColor(savedColor);
        } else {
            applyColor(DEFAULT_COLOR);
        }
    }

    function createFloatingWidget() {
        // Create container
        const container = document.createElement('div');
        container.className = 'color-switcher-container';
        container.innerHTML = `
            <div class="color-switcher-widget">
                <div class="switcher-header">
                    <span class="switcher-title">Theme Color</span>
                    <button class="switcher-toggle" aria-label="Toggle color switcher">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6m0 6v-0"></path>
                        </svg>
                    </button>
                </div>
                <div class="switcher-colors">
                    <button class="color-btn" data-color="white" title="White" style="background-color: #ffffff; border: 2px solid #333;">
                        <span class="color-label">White</span>
                    </button>
                    <button class="color-btn" data-color="green" title="Green" style="background-color: #00AA44;">
                        <span class="color-label">Green</span>
                    </button>
                    <button class="color-btn" data-color="yellow" title="Yellow" style="background-color: #FFFF00; border: 1px solid #ccc;">
                        <span class="color-label">Yellow</span>
                    </button>
                    <button class="color-btn" data-color="orange" title="Orange" style="background-color: #FF8800;">
                        <span class="color-label">Orange</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // Add event listeners
        const toggleBtn = container.querySelector('.switcher-toggle');
        const colorBtns = container.querySelectorAll('.color-btn');

        toggleBtn.addEventListener('click', () => {
            container.classList.toggle('active');
        });

        colorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const colorKey = e.currentTarget.getAttribute('data-color');
                const { value: newColor, gradient } = colors[colorKey];
                applyColor(newColor, gradient);
                currentColor = newColor;
                localStorage.setItem(STORAGE_KEY, newColor);
                
                // Visual feedback
                container.classList.add('color-applied');
                setTimeout(() => {
                    container.classList.remove('color-applied');
                }, 300);
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                container.classList.remove('active');
            }
        });
        
        // Monitor mobile menu toggle using event delegation
        document.addEventListener('click', function(e) {
            if (e.target.closest('.show-menu')) {
                // Reapply color immediately when menu button is clicked
                setTimeout(function() {
                    document.body.style.setProperty('background-color', currentColor, 'important');
                }, 50);
                setTimeout(function() {
                    document.body.style.setProperty('background-color', currentColor, 'important');
                }, 150);
            }
        });
    }

    function applyColor(colorValue, gradient) {
        currentColor = colorValue;
        if (!gradient) {
            const match = Object.values(colors).find(c => c.value.toLowerCase() === colorValue.toLowerCase());
            gradient = match ? match.gradient : null;
        }
        if (gradient) {
            document.body.style.setProperty('background', gradient, 'important');
        } else {
            document.body.style.setProperty('background-color', colorValue, 'important');
        }
        // Remove hero-specific override so body gradient shows through
        const hero = document.querySelector('.hero-section-full');
        if (hero) hero.style.removeProperty('background');
        
        // Prevent other scripts from changing the background color
        if (!window.colorSwitcherMonitoring) {
            window.colorSwitcherMonitoring = true;
            const observer = new MutationObserver(function(mutations) {
                let needsReapply = false;
                mutations.forEach(function(mutation) {
                    // Check for style changes
                    if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                        needsReapply = true;
                    }
                });
                
                if (needsReapply) {
                    // Re-apply color immediately and with a small delay to catch CSS animations
                    document.body.style.setProperty('background-color', currentColor, 'important');
                    setTimeout(function() {
                        document.body.style.setProperty('background-color', currentColor, 'important');
                    }, 50);
                }
            });
            
            // Watch both style and class attributes
            observer.observe(document.body, { 
                attributes: true, 
                attributeFilter: ['style', 'class'],
                subtree: false
            });
            
            // Also watch the navbar for changes that might affect body
            const navbar = document.querySelector('.navbar, .modern-nav');
            if (navbar) {
                observer.observe(navbar, { 
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                });
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Continuous color maintenance - ensures color persists during all interactions
    setInterval(function() {
        if (document.body) {
            const match = Object.values(colors).find(c => c.value.toLowerCase() === currentColor.toLowerCase());
            if (match) {
                document.body.style.setProperty('background', match.gradient, 'important');
            } else {
                document.body.style.setProperty('background-color', currentColor, 'important');
            }
        }
        const hero = document.querySelector('.hero-section-full');
        if (hero) hero.style.removeProperty('background');
    }, 150);
    
    // Ensure color persists when page visibility changes (mobile header interactions)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            document.body.style.setProperty('background-color', currentColor, 'important');
        }
    });
    
    // Monitor header interactions on mobile
    window.addEventListener('resize', function() {
        document.body.style.setProperty('background-color', currentColor, 'important');
    });
})();
