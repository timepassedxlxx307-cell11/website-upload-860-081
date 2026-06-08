document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      mobilePanel.hidden = isOpen;
    });
  }

  var slides = Array.from(document.querySelectorAll(".hero-slide"));
  var dots = Array.from(document.querySelectorAll(".hero-dot"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
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

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function startHero() {
    if (slides.length <= 1) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  function restartHero() {
    if (timer) {
      window.clearInterval(timer);
    }

    startHero();
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.dataset.slide || 0));
      restartHero();
    });
  });

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      restartHero();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      restartHero();
    });
  }

  startHero();

  var pageFilter = document.querySelector(".page-filter");
  var searchableGrid = document.querySelector(".searchable-grid");

  if (pageFilter && searchableGrid) {
    var cards = Array.from(searchableGrid.querySelectorAll(".movie-card"));

    pageFilter.addEventListener("input", function () {
      var keyword = pageFilter.value.trim().toLowerCase();

      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.classList.toggle("is-filtered-out", keyword && text.indexOf(keyword) === -1);
      });
    });
  }
});
