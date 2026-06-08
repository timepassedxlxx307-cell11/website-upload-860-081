(function() {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function() {
            panel.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, position) {
                slide.classList.toggle("is-active", position === current);
            });
            dots.forEach(function(dot, position) {
                dot.classList.toggle("is-active", position === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function(dot, position) {
            dot.addEventListener("click", function() {
                show(position);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function applyFilters(targetSelector) {
        var target = document.querySelector(targetSelector);
        if (!target) {
            return;
        }
        var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card"));
        var search = document.querySelector('[data-movie-search="' + targetSelector + '"]');
        var typeSelect = document.querySelector('[data-filter-type="' + targetSelector + '"]');
        var yearSelect = document.querySelector('[data-filter-year="' + targetSelector + '"]');
        var empty = document.querySelector('[data-empty-for="' + targetSelector + '"]');
        var keyword = search ? search.value.trim().toLowerCase() : "";
        var type = typeSelect ? typeSelect.value : "";
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;

        cards.forEach(function(card) {
            var haystack = (card.getAttribute("data-search") || "").toLowerCase();
            var cardType = card.getAttribute("data-type") || "";
            var cardYear = card.getAttribute("data-year") || "";
            var matched = true;
            if (keyword && haystack.indexOf(keyword) === -1) {
                matched = false;
            }
            if (type && cardType !== type) {
                matched = false;
            }
            if (year && cardYear !== year) {
                matched = false;
            }
            card.classList.toggle("is-hidden", !matched);
            if (matched) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    function initFilters() {
        var selectors = [];
        document.querySelectorAll("[data-movie-search]").forEach(function(input) {
            var target = input.getAttribute("data-movie-search");
            if (selectors.indexOf(target) === -1) {
                selectors.push(target);
            }
            input.addEventListener("input", function() {
                applyFilters(target);
            });
        });
        document.querySelectorAll("[data-filter-type]").forEach(function(select) {
            var target = select.getAttribute("data-filter-type");
            if (selectors.indexOf(target) === -1) {
                selectors.push(target);
            }
            select.addEventListener("change", function() {
                applyFilters(target);
            });
        });
        document.querySelectorAll("[data-filter-year]").forEach(function(select) {
            var target = select.getAttribute("data-filter-year");
            if (selectors.indexOf(target) === -1) {
                selectors.push(target);
            }
            select.addEventListener("change", function() {
                applyFilters(target);
            });
        });
        selectors.forEach(applyFilters);
    }

    window.initMoviePlayer = function(videoId, coverId, sourceUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        if (!video || !cover || !sourceUrl) {
            return;
        }

        function start() {
            cover.classList.add("is-hidden");
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (!video.getAttribute("src")) {
                    video.setAttribute("src", sourceUrl);
                }
                video.play().catch(function() {});
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                if (!video.hlsPlayer) {
                    var hlsPlayer = new Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    video.hlsPlayer = hlsPlayer;
                    hlsPlayer.loadSource(sourceUrl);
                    hlsPlayer.attachMedia(video);
                    hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function() {
                        video.play().catch(function() {});
                    });
                } else {
                    video.play().catch(function() {});
                }
                return;
            }
            if (!video.getAttribute("src")) {
                video.setAttribute("src", sourceUrl);
            }
            video.play().catch(function() {});
        }

        cover.addEventListener("click", start);
        video.addEventListener("click", function() {
            if (video.paused) {
                start();
            }
        });
    };

    ready(function() {
        initNavigation();
        initHero();
        initFilters();
    });
})();
