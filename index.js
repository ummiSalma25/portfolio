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

// ============================================
// MOTION
// Additive and self-contained: delete this block (plus the MOTION
// block at the bottom of index.css) and the site goes back to static.
// Does nothing for visitors who prefer reduced motion.
// ============================================

(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const root = document.documentElement;
  const $ = function (s, c) { return (c || document).querySelector(s); };
  const $$ = function (s, c) { return Array.from((c || document).querySelectorAll(s)); };

  // ---------- theme switch: colours ease, icon spins ----------
  const themeBtn = $("#themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      root.classList.add("m-theme-fade");
      themeBtn.classList.add("is-switching");
      setTimeout(function () {
        root.classList.remove("m-theme-fade");
        themeBtn.classList.remove("is-switching");
      }, 650);
    });
  }

  // ---------- scroll progress bar, header shadow, hero photo parallax ----------
  const header = $(".site-header");
  const heroPhoto = $(".hero-photo");
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (heroPhoto && window.innerWidth >= 992) {
        heroPhoto.style.setProperty("--py", Math.min(y * 0.08, 48) + "px");
      }
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  if (!("IntersectionObserver" in window)) return;

  // Anything already on screen at load is left alone (the CSS entrance
  // handles the hero), so nothing flashes visible -> hidden -> visible.
  function inFirstView(el) {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.92 && r.bottom > 0 &&
           r.left < window.innerWidth && r.right > 0;
  }

  // ---------- scroll reveals ----------
  const io = new IntersectionObserver(function (entries) {
    let i = 0;
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const delay = Math.min(i++, 5) * 90;
      el.style.setProperty("--rd", delay + "ms");
      requestAnimationFrame(function () { el.classList.add("is-in"); });

      // Hand the element back to its own CSS once it has arrived, so
      // hover transitions on cards/buttons behave normally afterwards.
      if (el.classList.contains("reveal") || el.classList.contains("reveal-scale")) {
        setTimeout(function () {
          el.classList.remove("reveal", "reveal-scale", "is-in");
          el.style.removeProperty("--rd");
        }, delay + 1100);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  function mark(selector, cls, filter) {
    $$(selector).forEach(function (el) {
      if (el.classList.contains("reveal") || el.classList.contains("reveal-scale") ||
          el.classList.contains("m-tag") || el.classList.contains("m-split")) return;
      if (filter && !filter(el)) return;
      if (inFirstView(el)) return;
      el.classList.add(cls);
      io.observe(el);
    });
  }

  // eyebrow tags wipe in
  mark(".eyebrow-tag", "m-tag");

  // big headings rise word by word
  function splitWords(el) {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.textContent = "";
    text.split(" ").forEach(function (word, i, all) {
      const mask = document.createElement("span");
      mask.className = "m-word";
      mask.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.className = "m-word-in";
      inner.style.setProperty("--wd", i * 70 + "ms");
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < all.length - 1) el.appendChild(document.createTextNode(" "));
    });
  }

  $$(".section-head h2, .what-i-do-heading, .journey-copy h2, .collaborate-inner h2").forEach(function (h) {
    if (h.children.length || inFirstView(h)) return;
    splitWords(h);
    h.classList.add("m-split");
    io.observe(h);
  });

  // fade-up group
  [
    ".what-i-do-right > *",
    ".record-section > .eyebrow",
    ".record-item",
    ".brands-section > .eyebrow",
    ".brands-strip",
    ".case-list .case-row",
    ".case-list .case-row2",
    ".view-all-link",
    ".testimonial-card",
    ".collaborate-inner > :not(h2)",
    ".case-section-body > :not(.case-image-grid):not(.case-media-text-grid)",
    ".case-image-grid > *",
    ".case-media-text-grid > *",
    ".case-bottom-nav",
    ".contact-divider",
    ".contact-col",
    ".journey-copy > :not(h2):not(.eyebrow-tag)",
    ".favourites-lede",
    ".fav-sub-row",
    ".fav-gallery",
    ".memories-gallery"
  ].forEach(function (sel) { mark(sel, "reveal"); });

  // scale-in group (opacity + scale only, so horizontal scrollers never grow a scrollbar)
  mark(".portfolio-grid > .col", "reveal-scale", function (el) { return !el.closest("#branding"); });
  mark(".journey-media", "reveal-scale");

  // ---------- count-up numbers ----------
  const counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterIO.unobserve(el);
      const full = el.textContent.trim();
      const m = full.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!m) return;
      const target = parseFloat(m[1]);
      const decimals = (m[1].split(".")[1] || "").length;
      const suffix = m[2];
      const dur = 1500;
      const t0 = performance.now();
      el.setAttribute("aria-label", full);
      el.classList.add("is-counting");
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = full;
          el.classList.remove("is-counting");
        }
      })(t0);
    });
  }, { threshold: 0.6 });

  $$(".record-num").forEach(function (el) {
    if (!inFirstView(el)) counterIO.observe(el);
  });

  // ---------- brand logos become a slow marquee ----------
  const strip = $(".brands-strip");
  if (strip && strip.children.length) {
    const items = Array.from(strip.children);
    const track = document.createElement("div");
    track.className = "brands-track";
    items.forEach(function (item) { track.appendChild(item); });
    items.forEach(function (item) {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("tabindex", "-1");
      track.appendChild(clone);
    });
    strip.appendChild(track);
    strip.classList.add("is-marquee");
    const section = strip.closest(".brands-section");
    if (section) section.classList.add("has-marquee");

    // wait for the logos to load so the loop speed matches the real width
    function startMarquee() {
      const setWidth = track.scrollWidth / 2;
      if (setWidth > 0) track.style.setProperty("--marquee-dur", Math.max(20, setWidth / 45) + "s");
      strip.classList.add("is-ready");
    }
    if (document.readyState === "complete") startMarquee();
    else window.addEventListener("load", startMarquee);
  }
})();
