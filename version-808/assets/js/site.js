(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !mobileNav) {
      return;
    }
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        window.clearInterval(timer);
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    start();
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.js-filter-panel'));
    panels.forEach(function (panel) {
      var input = panel.querySelector('.js-search-input');
      var selects = Array.prototype.slice.call(panel.querySelectorAll('.js-filter-select'));
      var cards = Array.prototype.slice.call(panel.querySelectorAll('.js-card'));
      var count = panel.querySelector('[data-result-count]');
      var empty = panel.querySelector('[data-empty-state]');

      function matchesYear(card, value) {
        if (value === 'all') {
          return true;
        }
        return card.getAttribute('data-year-group') === value;
      }

      function apply() {
        var query = input ? input.value.trim().toLowerCase() : '';
        var visible = 0;
        cards.forEach(function (card) {
          var search = (card.getAttribute('data-search') || '').toLowerCase();
          var isMatch = !query || search.indexOf(query) !== -1;
          selects.forEach(function (select) {
            var filterName = select.getAttribute('data-filter');
            var value = select.value;
            if (!isMatch || value === 'all') {
              return;
            }
            if (filterName === 'yearGroup') {
              isMatch = matchesYear(card, value);
              return;
            }
            var attrName = 'data-' + filterName.replace(/[A-Z]/g, function (letter) {
              return '-' + letter.toLowerCase();
            });
            var attrValue = card.getAttribute(attrName) || '';
            isMatch = attrValue.indexOf(value) !== -1;
          });
          card.style.display = isMatch ? '' : 'none';
          if (isMatch) {
            visible += 1;
          }
        });
        if (count) {
          count.textContent = visible === cards.length ? '' : '筛选已更新';
        }
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }
      selects.forEach(function (select) {
        select.addEventListener('change', apply);
      });
      apply();
    });
  }

  function initPlayer() {
    var video = document.getElementById('movie-player');
    if (!video) {
      return;
    }
    var overlay = document.querySelector('[data-play-overlay]');
    var source = video.getAttribute('data-src');
    var initialized = false;
    var hlsInstance = null;

    function attachSource() {
      if (initialized || !source) {
        return;
      }
      initialized = true;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      attachSource();
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }
    video.addEventListener('click', attachSource);
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
    video.addEventListener('pause', function () {
      if (overlay && video.currentTime === 0) {
        overlay.classList.remove('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initFilters();
    initPlayer();
  });
})();
