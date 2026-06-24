(function () {
    'use strict';

    function buildImageCard(pin) {
        return '<div class="cap-card" data-category="' + pin.category + '" data-aos="fade-up" data-aos-delay="' + pin.aosDelay + '">' +
            '<a href="' + pin.url + '" target="_blank" rel="noopener" class="cap-card-link">' +
                '<div class="cap-img-wrap">' +
                    '<img src="' + pin.img + '" alt="' + pin.alt + '" class="cap-img" loading="lazy">' +
                    '<div class="cap-overlay">' +
                        '<div class="cap-overlay-inner">' +
                            '<i class="iconoir-pinterest"></i>' +
                            '<span>View on Pinterest</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="cap-card-body">' +
                    '<p class="cap-card-title">' + pin.title + '</p>' +
                    '<div class="cap-card-tags">' +
                        pin.tags.map(function (t) {
                            return '<span class="cap-tag' + (t['class'] ? ' ' + t['class'] : '') + '">' + t.label + '</span>';
                        }).join('') +
                    '</div>' +
                '</div>' +
            '</a>' +
        '</div>';
    }

    function buildVideoCard(pin) {
        var durationHtml = pin.duration ? '<span class="cap-duration">' + pin.duration + '</span>' : '';
        return '<div class="cap-card cap-card-video" data-category="' + pin.category + '" data-aos="fade-up" data-aos-delay="' + pin.aosDelay + '">' +
            '<a href="' + pin.url + '" target="_blank" rel="noopener" class="cap-card-link">' +
                '<div class="cap-img-wrap cap-video-wrap">' +
                    '<div class="cap-video-thumb" style="background-image:url(\'' + pin.thumb + '\');background-size:cover;background-position:center;">' +
                        '<div class="cap-play-ring"><i class="iconoir-play-solid"></i></div>' +
                        durationHtml +
                    '</div>' +
                    '<div class="cap-overlay">' +
                        '<div class="cap-overlay-inner">' +
                            '<i class="iconoir-pinterest"></i>' +
                            '<span>Watch on Pinterest</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="cap-card-body">' +
                    '<p class="cap-card-title">' + pin.title + '</p>' +
                    '<div class="cap-card-tags">' +
                        pin.tags.map(function (t) {
                            return '<span class="cap-tag' + (t['class'] ? ' ' + t['class'] : '') + '">' + t.label + '</span>';
                        }).join('') +
                    '</div>' +
                '</div>' +
            '</a>' +
        '</div>';
    }

    function initFilter() {
        var pills = document.querySelectorAll('.cap-pill');
        pills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                pills.forEach(function (p) { p.classList.remove('active'); });
                pill.classList.add('active');
                var filter = pill.getAttribute('data-filter');
                document.querySelectorAll('.cap-card').forEach(function (card) {
                    if (filter === 'all' || card.getAttribute('data-category').indexOf(filter) !== -1) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(16px)';
                        setTimeout(function () {
                            card.style.transition = 'opacity .4s ease, transform .4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 30);
                    } else {
                        card.style.transition = 'opacity .25s ease';
                        card.style.opacity = '0';
                        setTimeout(function () { card.style.display = 'none'; }, 260);
                    }
                });
            });
        });
    }

    function renderPins(pins) {
        var masonry = document.getElementById('cap-masonry');
        if (!masonry) return;
        masonry.innerHTML = pins.map(function (pin) {
            return pin.type === 'video' ? buildVideoCard(pin) : buildImageCard(pin);
        }).join('');
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        initFilter();
    }

    fetch('./assets/js/pins.json')
        .then(function (res) { return res.json(); })
        .then(renderPins)
        .catch(function (err) { console.error('pins-renderer: failed to load pins.json', err); });
})();
