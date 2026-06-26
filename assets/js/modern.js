/* =============================================
   MODERN ANIMATIONS JS - Sibashish Portfolio
   ============================================= */

(function () {
    'use strict';

    /* ── Scroll Progress Bar ── */
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });

    /* ── Aurora Background ── */
    const aurora = document.createElement('div');
    aurora.className = 'bg-aurora';
    aurora.innerHTML = `
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
        <div class="noise-overlay"></div>
    `;
    document.body.prepend(aurora);

    /* ── Custom Cursor (desktop only) ── */
    if (window.innerWidth > 768) {
        const dot  = document.createElement('div');
        const ring = document.createElement('div');
        dot.className  = 'cursor-dot';
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        // Trail dots
        const TRAIL_COUNT = 8;
        const trail = Array.from({ length: TRAIL_COUNT }, (_, i) => {
            const t = document.createElement('div');
            t.className = 'cursor-trail';
            t.style.setProperty('--ti', i);
            document.body.appendChild(t);
            return { el: t, x: 0, y: 0 };
        });

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let prevX = 0, prevY = 0;
        let velX = 0, velY = 0;
        let isHovering = false;

        document.addEventListener('mousemove', (e) => {
            prevX = mouseX; prevY = mouseY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
        }, { passive: true });

        // Click ripple
        document.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'cursor-ripple';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top  = e.clientY + 'px';
            document.body.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });

        // Animated ring + trail
        function animateCursor() {
            // Velocity
            velX = mouseX - prevX;
            velY = mouseY - prevY;
            const speed = Math.sqrt(velX * velX + velY * velY);

            // Ring lerp
            ringX += (mouseX - ringX) * 0.13;
            ringY += (mouseY - ringY) * 0.13;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';

            // Stretch ring in direction of movement
            if (!isHovering && speed > 1) {
                const angle = Math.atan2(velY, velX) * (180 / Math.PI);
                const stretch = Math.min(1 + speed * 0.04, 1.8);
                ring.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scaleX(${stretch})`;
            } else {
                ring.style.transform = 'translate(-50%,-50%)';
            }

            // Trail positions cascade
            trail[0].x += (mouseX - trail[0].x) * 0.45;
            trail[0].y += (mouseY - trail[0].y) * 0.45;
            for (let i = 1; i < TRAIL_COUNT; i++) {
                trail[i].x += (trail[i-1].x - trail[i].x) * 0.45;
                trail[i].y += (trail[i-1].y - trail[i].y) * 0.45;
                trail[i].el.style.left = trail[i].x + 'px';
                trail[i].el.style.top  = trail[i].y + 'px';
                trail[i].el.style.opacity = speed > 0.5 ? (1 - i / TRAIL_COUNT) * 0.55 : 0;
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Expand ring on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .modern-card, .about-btn, .theme-btn, .show-menu');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => { ring.classList.add('expand'); isHovering = true; });
            el.addEventListener('mouseleave', () => { ring.classList.remove('expand'); isHovering = false; });
        });

        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
    }

    /* ── Stats Counter Animation ── */
    function animateCounter(el, target, suffix) {
        const duration = 1800;
        const start = performance.now();
        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (target < 10 ? '0' : '') + Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const raw = el.dataset.target || '';
                const hasPlus = raw.includes('+');
                const target = parseInt(raw) || 0;
                if (target > 0) {
                    animateCounter(el, target, hasPlus ? '+' : '');
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

    /* ── Card 3-D Tilt on Mouse Move ── */
    document.querySelectorAll('.modern-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const cx     = rect.left + rect.width  / 2;
            const cy     = rect.top  + rect.height / 2;
            const dx     = (e.clientX - cx) / (rect.width  / 2);
            const dy     = (e.clientY - cy) / (rect.height / 2);
            const tiltX  = dy * -6;
            const tiltY  = dx *  6;
            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px) scale(1.015)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease, box-shadow 0.35s ease, border-color 0.35s ease';
        });
    });

    /* ── Typed Text Effect (subtitle) ── */
    const typedEl = document.querySelector('.typed-subtitle');
    if (typedEl) {
        const text     = typedEl.textContent.trim();
        const prefix   = typedEl.innerHTML.match(/.*?<\/.*?>/)?.[0] || '';
        typedEl.textContent = '';

        // Rebuild to keep the ::before pseudo-element line via a span
        typedEl.innerHTML = '';
        const textSpan = document.createElement('span');
        typedEl.appendChild(textSpan);

        let i = 0;
        function typeNext() {
            if (i < text.length) {
                textSpan.textContent += text[i++];
                setTimeout(typeNext, 55);
            }
        }
        // Start typing after page entrance
        setTimeout(typeNext, 900);
    }

    /* ── Smooth re-apply AOS init after modern enhancements ── */
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 60 });
    }

    /* ── Footer name: split into letter spans & march-up animation ── */
    (function () {
        var fl = document.getElementById('footer-logo');
        if (!fl) return;
        // Split the .footer-name text into individual letter spans
        var nameEl = fl.querySelector('.footer-name');
        if (nameEl) {
            var letters = nameEl.textContent.split('');
            nameEl.outerHTML = letters.map(function (ch) {
                return '<span class="footer-letter">' + ch + '</span>';
            }).join('');
        }
        // Trigger with IntersectionObserver
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    fl.querySelectorAll('.footer-letter').forEach(function (l, i) {
                        setTimeout(function () { l.classList.add('fl-risen'); }, i * 55);
                    });
                    io.unobserve(fl);
                }
            });
        }, { threshold: 0.01 });
        io.observe(fl);
    })();

    /* ── Theme Switcher ── */
    (function () {
        // Get saved theme from localStorage or default to 'black'
        const savedTheme = localStorage.getItem('portfolio-theme') || 'black';
        
        // Apply saved theme on page load
        if (savedTheme !== 'black') {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        // Set active button on load
        const themeButtons = document.querySelectorAll('.theme-switcher .theme-btn');
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === savedTheme) {
                btn.classList.add('active');
            }
        });
        
        // Theme switcher click handler
        themeButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const theme = this.getAttribute('data-theme');
                
                // Remove active class from all buttons
                themeButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Apply theme
                if (theme === 'black') {
                    document.documentElement.removeAttribute('data-theme');
                } else {
                    document.documentElement.setAttribute('data-theme', theme);
                }
                
                // Save theme preference
                localStorage.setItem('portfolio-theme', theme);
            });
        });
    })();

    /* ── Hide socials after hero section scrolls away ── */
    (function () {
        var socials = document.querySelector('.hero-ts-socials');
        var hero = document.querySelector('.hero-ts-section');
        if (!socials || !hero) return;
        function check() {
            var gone = hero.getBoundingClientRect().bottom <= 0;
            socials.style.opacity = gone ? '0' : '';
            socials.style.pointerEvents = gone ? 'none' : '';
        }
        window.addEventListener('scroll', check, { passive: true });
        check();
    })();

})()
