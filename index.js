// ============================================
// UMMI SALMA — PORTFOLIO
// Theme toggle + mobile nav
// ============================================

(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const STORAGE_KEY = "ummisalma-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeToggle.setAttribute("aria-pressed", theme === "light");
    themeToggle.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark mode" : "Switch to light mode"
    );
  }

  // Respect a saved preference; otherwise default to dark (the site's default).
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved === "light" ? "light" : "dark");

  themeToggle.addEventListener("click", function () {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  // Mobile nav (Bootstrap's d-none/d-lg-flex control desktop visibility;
  // the "open" class controls the mobile dropdown state)
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll-to-top button: shows after scrolling past one viewport height,
  // scrolls smoothly back to top on click.
  const scrollTop = document.getElementById("scroll-top");

  if (scrollTop) {
    function toggleScrollTop() {
      scrollTop.classList.toggle("active", window.scrollY > window.innerHeight * 0.5);
    }

    window.addEventListener("scroll", toggleScrollTop, { passive: true });
    toggleScrollTop();

    scrollTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();