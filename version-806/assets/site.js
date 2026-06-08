(function () {
    var toggle = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
        toggle.addEventListener("click", function () {
            var open = panel.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var slider = document.querySelector(".hero-slider");
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        var prev = slider.querySelector(".hero-prev");
        var next = slider.querySelector(".hero-next");
        var current = 0;
        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle("is-active", idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle("is-active", idx === current);
            });
        }
        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(parseInt(dot.getAttribute("data-target"), 10) || 0);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5000);
    }

    var filterForm = document.querySelector(".library-filter");
    if (filterForm) {
        var keywordInput = filterForm.querySelector(".filter-keyword");
        var yearInput = filterForm.querySelector(".filter-year");
        var regionInput = filterForm.querySelector(".filter-region");
        var categoryInput = filterForm.querySelector(".filter-category");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".filter-card"));
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (keywordInput && query) {
            keywordInput.value = query;
        }
        function normalize(text) {
            return String(text || "").toLowerCase().replace(/\s+/g, "");
        }
        function applyFilter() {
            var keyword = normalize(keywordInput ? keywordInput.value : "");
            var year = yearInput ? yearInput.value : "";
            var region = regionInput ? regionInput.value : "";
            var category = categoryInput ? categoryInput.value : "";
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchYear = !year || card.getAttribute("data-year") === year;
                var matchRegion = !region || card.getAttribute("data-region") === region;
                var matchCategory = !category || card.getAttribute("data-category") === category;
                card.classList.toggle("is-hidden", !(matchKeyword && matchYear && matchRegion && matchCategory));
            });
        }
        [keywordInput, yearInput, regionInput, categoryInput].forEach(function (input) {
            if (input) {
                input.addEventListener("input", applyFilter);
                input.addEventListener("change", applyFilter);
            }
        });
        filterForm.addEventListener("submit", function (event) {
            event.preventDefault();
            applyFilter();
        });
        applyFilter();
    }
}());
