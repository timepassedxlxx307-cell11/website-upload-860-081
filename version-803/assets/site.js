(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initializeMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initializeHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var previous = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        start();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    showSlide(0);
    start();
  }

  function initializeFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panel) {
      var scope = panel.closest('section') || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var search = panel.querySelector('[data-filter-search]');
      var type = panel.querySelector('[data-filter-type]');
      var region = panel.querySelector('[data-filter-region]');
      var year = panel.querySelector('[data-filter-year]');
      var count = panel.querySelector('[data-visible-count]');
      var emptyState = scope.querySelector('[data-empty-state]');
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q');

      if (initialQuery && search) {
        search.value = initialQuery;
      }

      function normalized(value) {
        return String(value || '').trim().toLowerCase();
      }

      function selected(select, fallback) {
        return select ? select.value : fallback;
      }

      function applyFilters() {
        var query = normalized(search ? search.value : '');
        var typeValue = selected(type, '全部类型');
        var regionValue = selected(region, '全部地区');
        var yearValue = selected(year, '全部年份');
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalized([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags')
          ].join(' '));

          var matchesQuery = !query || haystack.indexOf(query) !== -1;
          var matchesType = typeValue === '全部类型' || card.getAttribute('data-type') === typeValue;
          var matchesRegion = regionValue === '全部地区' || card.getAttribute('data-region') === regionValue;
          var matchesYear = yearValue === '全部年份' || card.getAttribute('data-year') === yearValue;
          var isVisible = matchesQuery && matchesType && matchesRegion && matchesYear;

          card.hidden = !isVisible;

          if (isVisible) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = String(visible);
        }

        if (emptyState) {
          emptyState.hidden = visible !== 0;
        }
      }

      [search, type, region, year].forEach(function (element) {
        if (!element) {
          return;
        }

        element.addEventListener('input', applyFilters);
        element.addEventListener('change', applyFilters);
      });

      applyFilters();
    });
  }

  function initializePlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('[data-video-src]');

      if (!video || !button) {
        return;
      }

      button.addEventListener('click', function () {
        var source = button.getAttribute('data-video-src');

        if (!source) {
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.play();
          button.classList.add('is-hidden');
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play();
            button.classList.add('is-hidden');
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              hls.destroy();
              video.src = source;
              video.play();
              button.classList.add('is-hidden');
            }
          });
          return;
        }

        video.src = source;
        video.play();
        button.classList.add('is-hidden');
      });
    });
  }

  ready(function () {
    initializeMobileMenu();
    initializeHeroCarousel();
    initializeFilters();
    initializePlayers();
  });
})();
