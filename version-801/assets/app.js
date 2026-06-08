(function() {
    var siteNav = document.querySelector(".site-nav");
    var menuToggle = document.querySelector(".menu-toggle");

    function updateNav() {
        if (!siteNav) {
            return;
        }
        if (window.scrollY > 20) {
            siteNav.classList.add("is-scrolled");
        } else {
            siteNav.classList.remove("is-scrolled");
        }
    }

    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });

    if (menuToggle && siteNav) {
        menuToggle.addEventListener("click", function() {
            siteNav.classList.toggle("menu-open");
        });
    }

    document.querySelectorAll("[data-search-form]").forEach(function(form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            var input = form.querySelector("input[name='q']");
            var keyword = input ? input.value.trim() : "";
            var target = form.getAttribute("action") || "./search.html";
            if (keyword) {
                window.location.href = target + "?q=" + encodeURIComponent(keyword);
            } else {
                window.location.href = target;
            }
        });
    });

    document.querySelectorAll("[data-hero]").forEach(function(hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
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
            }
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                show(index);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function() {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                show(current + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    });

    var filterInput = document.querySelector("[data-filter-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var emptyState = document.querySelector("[data-empty-state]");

    function cardText(card) {
        return [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.textContent
        ].join(" ").toLowerCase();
    }

    function applyFilter(keyword) {
        var value = (keyword || "").trim().toLowerCase();
        var visible = 0;
        cards.forEach(function(card) {
            var matched = !value || cardText(card).indexOf(value) !== -1;
            card.classList.toggle("is-hidden-card", !matched);
            if (matched) {
                visible += 1;
            }
        });
        if (emptyState) {
            emptyState.classList.toggle("show", visible === 0);
        }
    }

    if (filterInput && cards.length) {
        if (filterInput.hasAttribute("data-query-from-url")) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            filterInput.value = query;
            applyFilter(query);
        }
        filterInput.addEventListener("input", function() {
            applyFilter(filterInput.value);
        });
        document.querySelectorAll("[data-filter-chip]").forEach(function(button) {
            button.addEventListener("click", function() {
                var keyword = button.getAttribute("data-filter-chip") || "";
                filterInput.value = keyword;
                document.querySelectorAll("[data-filter-chip]").forEach(function(other) {
                    other.classList.toggle("active", other === button);
                });
                applyFilter(keyword);
            });
        });
    }
})();
