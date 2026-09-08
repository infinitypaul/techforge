(function () {
  "use strict";

  var reduce =
    document.documentElement.classList.contains("motion-reduce") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var desktop = window.matchMedia("(min-width: 861px)");

  if (reduce) {
    document.documentElement.classList.add("motion-reduce");
    document.documentElement.classList.remove("motion-on");
    return;
  }

  window.__tfMotionBooted = true;
  document.documentElement.classList.add("motion-on");

  function reveal(el) {
    if (el) el.classList.add("is-in");
  }

  function observeOnce(nodes, rootMargin) {
    if (!nodes || !nodes.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: rootMargin || "0px 0px -12% 0px", threshold: 0.18 }
    );
    nodes.forEach(function (node) {
      io.observe(node);
    });
  }
  var navItems = document.querySelectorAll(".js-nav-item");
  var navLinks = document.querySelector(".site-header .nav");
  requestAnimationFrame(function () {
    navItems.forEach(function (el, i) {
      window.setTimeout(function () {
        reveal(el);
      }, i * 40);
    });
    if (navLinks) {
      window.setTimeout(function () {
        reveal(navLinks);
      }, 80);
    }
  });
  var hero = document.querySelector(".hero");
  if (hero) {
    var sequence = [
      { sel: ".hero__content .eyebrow", delay: 80 },
      { sel: ".hero__title", delay: 180, ready: true },
      { sel: ".hero__support", delay: 360 },
      { sel: ".event-meta", delay: 460 },
      { sel: ".hero__content .btn-row", delay: 560 },
      { sel: ".hero__script", delay: 640 },
      { sel: ".hero__photo", delay: 420 },
      { sel: ".hero__yellow", delay: 620 },
      { sel: ".hero__pink", delay: 680 },
      { sel: ".hero__spark", delay: 700 },
      { sel: ".hero__inset", delay: 760 },
    ];

    sequence.forEach(function (step) {
      var el = hero.querySelector(step.sel);
      if (!el) return;
      window.setTimeout(function () {
        if (step.ready) hero.classList.add("is-ready");
        reveal(el);
      }, step.delay);
    });

    // Ensure title lines animate even if title wrapper has no js-hero-item
    window.setTimeout(function () {
      hero.classList.add("is-ready");
    }, 180);
  }
  observeOnce(document.querySelectorAll(".js-reveal"));
  observeOnce(document.querySelectorAll(".js-stagger"));
  var stats = document.querySelectorAll(".stat[data-count]");
  if (stats.length) {
    var statsIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var stat = entry.target;
          reveal(stat);
          animateCount(stat);
          statsIo.unobserve(stat);
        });
      },
      { threshold: 0.35 }
    );
    stats.forEach(function (stat) {
      statsIo.observe(stat);
    });
  }

  function animateCount(stat) {
    var valueEl = stat.querySelector(".stat__value");
    if (!valueEl || valueEl.dataset.counted === "1") return;
    valueEl.dataset.counted = "1";

    var target = Number(stat.getAttribute("data-count"));
    var suffix = stat.getAttribute("data-suffix") || "";
    var prefix = stat.getAttribute("data-prefix") || "";
    if (!isFinite(target)) return;

    var duration = 1000;
    var start = performance.now();

    function frame(now) {
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      var current = Math.round(target * eased);
      valueEl.textContent =
        prefix +
        (target >= 1000 ? current.toLocaleString("en-US") : String(current)) +
        suffix;
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
  var parallaxNodes = document.querySelectorAll(".js-parallax");
  var ticking = false;

  function updateParallax() {
    ticking = false;
    if (!desktop.matches || !hero) return;

    var rect = hero.getBoundingClientRect();
    var viewH = window.innerHeight || 1;
    // progress while hero is in view
    var progress = (viewH - rect.top) / (viewH + rect.height);
    progress = Math.max(0, Math.min(1, progress));
    var offset = (progress - 0.35) * 2;

    parallaxNodes.forEach(function (node) {
      var speed = Number(node.getAttribute("data-parallax") || "12");
      var y = offset * speed;
      node.style.setProperty("--parallax-y", y.toFixed(2) + "px");
    });
  }

  function onScroll() {
    if (!desktop.matches) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }

  if (parallaxNodes.length) {
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", function () {
      if (!desktop.matches) {
        parallaxNodes.forEach(function (node) {
          node.style.setProperty("--parallax-y", "0px");
        });
      } else {
        updateParallax();
      }
    });
    updateParallax();
  }
})();
