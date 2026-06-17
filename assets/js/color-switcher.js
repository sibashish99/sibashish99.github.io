// Color Switcher - Global Floating Widget
(function() {
    'use strict';

    const STORAGE_KEY = 'sibashish-bg-color';
    const DEFAULT_COLOR = '#ffff00';

    const colors = {
        white: { label: 'White', value: '#ffffff' },
        green: { label: 'Green', value: '#00AA44' },
        yellow: { label: 'Yellow', value: '#FFFF00' },
        orange: { label: 'Orange', value: '#FF8800' }
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
                applyColor(colors[colorKey].value);
                localStorage.setItem(STORAGE_KEY, colors[colorKey].value);
                
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
    }

    function applyColor(colorValue) {
        document.body.style.backgroundColor = colorValue + ' !important';
        document.body.style.setProperty('background-color', colorValue, 'important');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
