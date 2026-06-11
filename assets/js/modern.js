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

        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
        }, { passive: true });

        // Smooth ring lag
        function animateRing() {
            ringX += (mouseX - ringX) * 0.14;
            ringY += (mouseY - ringY) * 0.14;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Expand ring on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .modern-card, .about-btn, .theme-btn, .show-menu');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('expand'));
            el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
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

})();
