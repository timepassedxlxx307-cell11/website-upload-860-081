(function () {
  function each(selector, callback, root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(selector), callback);
  }

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  function setupHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var prev = slider.querySelector("[data-hero-prev]");
    var next = slider.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("active", itemIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener("click", function () {
        show(itemIndex);
        start();
      });
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupSearch() {
    each("[data-search-scope]", function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var searchButton = scope.querySelector(".search-panel button");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
      var buttons = Array.prototype.slice.call(scope.querySelectorAll("[data-filter]"));
      var activeCategory = "all";

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var category = card.getAttribute("data-category") || "";
          var matchText = !query || text.indexOf(query) !== -1;
          var matchCategory = activeCategory === "all" || category === activeCategory;
          card.classList.toggle("hidden-by-filter", !(matchText && matchCategory));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q");
        if (initial) {
          input.value = initial;
          window.setTimeout(apply, 0);
        }
      }

      if (searchButton) {
        searchButton.addEventListener("click", apply);
      }

      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          activeCategory = button.getAttribute("data-filter") || "all";
          buttons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          apply();
        });
      });

      apply();
    });
  }

  window.SitePlayer = function (sourceUrl) {
    var video = document.getElementById("player-video");
    var mask = document.getElementById("player-mask");
    var button = document.getElementById("player-button");
    var started = false;
    var hls = null;

    if (!video || !sourceUrl) {
      return;
    }

    function prepare() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        return;
      }
      video.src = sourceUrl;
    }

    function play() {
      started = true;
      if (mask) {
        mask.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    prepare();

    if (button) {
      button.addEventListener("click", play);
    }
    if (mask) {
      mask.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (!started) {
        play();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
  });
})();
