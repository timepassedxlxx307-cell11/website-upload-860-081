(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function escapeHTML(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var menuButton = document.querySelector("[data-menu-button]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  selectAll("[data-header-search]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='q']");
      var keyword = input ? input.value.trim() : "";

      if (keyword) {
        window.location.href = "search.html?q=" + encodeURIComponent(keyword);
      }
    });
  });

  var slides = selectAll(".hero-slide");
  var dots = selectAll(".hero-dot");
  var heroIndex = 0;

  function showHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === heroIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === heroIndex);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showHeroSlide(dotIndex);
      });
    });

    window.setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5200);
  }

  var pageFilter = document.querySelector("[data-page-filter]");
  var pageFilterButton = document.querySelector("[data-page-filter-button]");

  function applyPageFilter() {
    if (!pageFilter) {
      return;
    }

    var keyword = normalize(pageFilter.value);

    selectAll("[data-title]").forEach(function (card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year")
      ].join(" "));

      card.style.display = !keyword || haystack.indexOf(keyword) !== -1 ? "" : "none";
    });
  }

  if (pageFilter) {
    pageFilter.addEventListener("input", applyPageFilter);
  }

  if (pageFilterButton) {
    pageFilterButton.addEventListener("click", applyPageFilter);
  }

  var searchForm = document.querySelector("[data-site-search]");
  var searchInput = document.querySelector("[data-site-search-input]");
  var searchResults = document.querySelector("[data-search-results]");
  var params = new URLSearchParams(window.location.search);

  function renderSearchResults(keyword) {
    if (!searchResults || !window.searchMovies) {
      return;
    }

    var query = normalize(keyword);
    var list = window.searchMovies.filter(function (movie) {
      var haystack = normalize([
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genre,
        movie.tags,
        movie.oneLine
      ].join(" "));

      return !query || haystack.indexOf(query) !== -1;
    }).slice(0, 120);

    if (!list.length) {
      searchResults.innerHTML = '<div class="empty-state">没有找到匹配影片，请尝试其他关键词。</div>';
      return;
    }

    searchResults.innerHTML = '<div class="movie-grid">' + list.map(function (movie) {
      var tags = String(movie.tags || movie.genre || "")
        .split(/[，,、\/]+/)
        .filter(Boolean)
        .slice(0, 4)
        .map(function (tag) {
          return '<span>' + escapeHTML(tag) + '</span>';
        }).join("");

      return '<article class="movie-card">'
        + '<a class="poster-link" href="' + escapeHTML(movie.url) + '">'
        + '<img src="' + escapeHTML(movie.image) + '" alt="' + escapeHTML(movie.title) + '" loading="lazy">'
        + '<span class="poster-badge">' + escapeHTML(movie.type) + '</span>'
        + '</a>'
        + '<div class="card-body">'
        + '<div class="card-meta">' + escapeHTML(movie.year) + ' · ' + escapeHTML(movie.region) + '</div>'
        + '<h2><a href="' + escapeHTML(movie.url) + '">' + escapeHTML(movie.title) + '</a></h2>'
        + '<p>' + escapeHTML(movie.oneLine) + '</p>'
        + '<div class="tag-row">' + tags + '</div>'
        + '</div>'
        + '</article>';
    }).join("") + '</div>';
  }

  if (searchForm && searchInput) {
    var initialQuery = params.get("q") || "";
    searchInput.value = initialQuery;
    renderSearchResults(initialQuery);

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      renderSearchResults(searchInput.value);
    });
  }
})();
