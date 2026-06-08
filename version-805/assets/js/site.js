(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-hero-thumb]"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle("is-active", thumbIndex === current);
      });
    }

    function playHero() {
      if (timer) {
        window.clearInterval(timer);
      }
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5200);
      }
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener("click", function () {
        showSlide(index);
        playHero();
      });
    });

    showSlide(0);
    playHero();

    var filterInput = document.querySelector("[data-filter-input]");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var activeFilter = "all";

    function applyFilter() {
      var query = filterInput ? filterInput.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-type")
        ].join(" ").toLowerCase();
        var type = (card.getAttribute("data-type") || "").toLowerCase();
        var genre = (card.getAttribute("data-genre") || "").toLowerCase();
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchFilter = activeFilter === "all" || type.indexOf(activeFilter) !== -1 || genre.indexOf(activeFilter) !== -1;
        card.style.display = matchQuery && matchFilter ? "" : "none";
      });
    }

    if (filterInput) {
      filterInput.addEventListener("input", applyFilter);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-filter-chip") || "all";
        filterButtons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        applyFilter();
      });
    });

    var searchResults = document.querySelector("[data-search-results]");
    if (searchResults && window.MOVIES) {
      var params = new URLSearchParams(window.location.search);
      var q = (params.get("q") || "").trim().toLowerCase();
      var matches = window.MOVIES.filter(function (movie) {
        var text = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags].join(" ").toLowerCase();
        return !q || text.indexOf(q) !== -1;
      }).slice(0, 120);
      if (!matches.length) {
        searchResults.innerHTML = "<div class="search-empty">没有找到匹配内容</div>";
      } else {
        searchResults.innerHTML = matches.map(function (movie) {
          return [
            "<article class="movie-card">",
            "<a class="poster-link" href="" + movie.url + "" aria-label="" + escapeHtml(movie.title) + "">",
            "<img src="" + movie.cover + "" alt="" + escapeHtml(movie.title) + "" loading="lazy">",
            "<span class="poster-badge">" + escapeHtml(movie.type) + "</span>",
            "</a>",
            "<div class="movie-card-body">",
            "<h2><a href="" + movie.url + "">" + escapeHtml(movie.title) + "</a></h2>",
            "<p>" + escapeHtml(movie.oneLine) + "</p>",
            "<div class="movie-meta"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.score) + "</span></div>",
            "<div class="tag-row">" + movie.tags.slice(0, 3).map(function (tag) { return "<span>" + escapeHtml(tag) + "</span>"; }).join("") + "</div>",
            "</div>",
            "</article>"
          ].join("");
        }).join("");
      }
    }
  });

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
