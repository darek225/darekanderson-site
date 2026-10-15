/* darekanderson.com v3
   Progressive enhancement only. The page is fully composed with this file
   disabled; the script adds classes and motion, never content.
   The 5 motion primitives from DESIGN_V3.md are ported here by name:
   1 InView, 2 AnimatedGroup slide, 3 Dialog (TOC drawer), 4 Magnetic,
   5 AnimatedBackground (ink-wash). The signature "stamp-press" composes
   4 + 5 with a stamp settle on one user action. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasIO = "IntersectionObserver" in window;

  document.documentElement.classList.add("js");

  /* Deep-link arrival: no reveal gate on the opener we land on. */
  function revealForHash() {
    var hash = window.location.hash;
    if (!hash) return;
    var target = document.querySelector(hash);
    if (!target) return;
    var section = target.closest ? target.closest(".chapter") : null;
    if (!section) return;
    section.querySelectorAll(".opener, .chapter-end").forEach(function (el) {
      el.classList.add("in-view");
    });
  }
  revealForHash();

  /* ---------- Primitive 1: InView ----------
     Chapter opener + chapter-end reveal. hidden { opacity 0, y 12 },
     400ms ease-out, once, via IntersectionObserver. */
  if (!reduced && hasIO) {
    var inviewObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          inviewObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".opener, .chapter-end").forEach(function (el) {
      inviewObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".opener, .chapter-end").forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Primitive 2: AnimatedGroup, slide preset ----------
     Staggered experiment ledger rows. Item { opacity 0->1, y 8px },
     60ms stagger, container triggers once. Rows after the 6th join
     with no stagger. */
  if (!reduced && hasIO) {
    var groupObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var rows = entry.target.querySelectorAll(".ledger-row");
        rows.forEach(function (row, i) {
          if (i < 6) row.style.transitionDelay = (i * 60) + "ms";
          row.classList.add("in-view");
          /* hand transform ownership to Magnetic after the reveal */
          window.setTimeout(function () {
            row.style.transitionDelay = "";
            row.classList.add("settled");
          }, 450);
        });
        groupObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".ledger[data-stagger]").forEach(function (ledger) {
      groupObserver.observe(ledger);
    });
  } else {
    document.querySelectorAll(".ledger[data-stagger] .ledger-row").forEach(function (row) {
      row.classList.add("in-view");
    });
  }

  /* ---------- Primitive 3: Dialog (TOC drawer) ----------
     Drawer { opacity 0, y 24px } -> open, 280ms cubic-bezier(0.22,1,0.36,1);
     backdrop fades 200ms; exit reverses. Focus trap + scroll lock. */
  var sheet = document.getElementById("toc-sheet");
  var backdrop = document.getElementById("tocBackdrop");
  var tocButton = document.getElementById("tocButton");
  var closeButton = document.getElementById("tocClose");
  var lastFocused = null;
  var isOpen = false;

  function openDrawer() {
    if (isOpen || !sheet) return;
    isOpen = true;
    lastFocused = document.activeElement;
    sheet.hidden = false;
    backdrop.hidden = false;
    /* force reflow so the transition runs from the hidden state */
    void sheet.offsetWidth;
    sheet.classList.add("open");
    backdrop.classList.add("open");
    document.body.classList.add("toc-locked");
    var first = sheet.querySelector(".toc-close");
    if (first) first.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeDrawer() {
    if (!isOpen || !sheet) return;
    isOpen = false;
    sheet.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.classList.remove("toc-locked");
    document.removeEventListener("keydown", onKeydown);
    var hideAfter = reduced ? 0 : 280;
    window.setTimeout(function () {
      if (!isOpen) {
        sheet.hidden = true;
        backdrop.hidden = true;
      }
    }, hideAfter);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    if (window.location.hash === "#toc-sheet") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeDrawer();
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = sheet.querySelectorAll('a[href], button:not([disabled])');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (tocButton) {
    tocButton.addEventListener("click", function (event) {
      event.preventDefault();
      openDrawer();
    });
  }
  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      closeDrawer();
    });
  }
  if (backdrop) {
    backdrop.addEventListener("click", function (event) {
      event.preventDefault();
      closeDrawer();
    });
  }

  /* TOC entry tap: close the drawer, then smooth-scroll to the chapter.
     This composes the stamp-press: wash + magnetic nudge on press,
     stamp settles as the row is left. */
  document.querySelectorAll(".toc-entry").forEach(function (entry) {
    entry.addEventListener("click", function () {
      if (!isOpen) return;
      closeDrawer();
    });
  });

  /* "Back to contents" links open the drawer instead of jumping. */
  document.querySelectorAll("[data-open-toc]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openDrawer();
    });
  });

  /* The Contents button appears only after the prologue scrolls out. */
  var prologue = document.querySelector(".prologue");
  function updateTocButton() {
    if (!tocButton || !prologue || isOpen) return;
    var past = window.scrollY > prologue.offsetHeight * 0.9;
    tocButton.classList.toggle("visible", past);
  }
  window.addEventListener("scroll", updateTocButton, { passive: true });
  window.addEventListener("resize", updateTocButton);
  updateTocButton();

  /* Current-chapter tick on TOC entries + desktop rail (red stamp tick). */
  if (hasIO) {
    var chapterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        document.querySelectorAll(".toc-entry, .rail-link").forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("data-ch") === id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".chapter").forEach(function (section) {
      chapterObserver.observe(section);
    });
  }

  /* ---------- Primitive 4: Magnetic ----------
     Tactile hover on TOC entries + experiment rows, desktop fine-pointer
     only. intensity 0.3, range 60px, spring { stiffness 26.7,
     damping 4.1, mass 0.2 } via one shared rAF loop. Skipped on touch. */
  if (!reduced && finePointer) {
    var springs = [];
    document.querySelectorAll(".magnetic").forEach(function (el) {
      springs.push({ el: el, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, live: false });
    });
    var stiffness = 26.7, damping = 4.1, last = 0;

    function springTick(now) {
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      var anyLive = false;
      springs.forEach(function (s) {
        var ax = -stiffness * (s.x - s.tx) - damping * s.vx;
        var ay = -stiffness * (s.y - s.ty) - damping * s.vy;
        s.vx += ax * dt;
        s.vy += ay * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (Math.abs(s.x) > 0.05 || Math.abs(s.y) > 0.05 ||
            Math.abs(s.vx) > 0.05 || Math.abs(s.vy) > 0.05 ||
            s.tx !== 0 || s.ty !== 0) {
          anyLive = true;
          s.el.style.transform = "translate(" + s.x.toFixed(2) + "px," + s.y.toFixed(2) + "px)";
        } else if (s.live) {
          s.el.style.transform = "";
        }
        s.live = anyLive;
      });
      if (anyLive) {
        window.requestAnimationFrame(springTick);
      } else {
        last = 0;
      }
    }
    function wake() {
      if (!last) window.requestAnimationFrame(function (t) { last = t; window.requestAnimationFrame(springTick); });
    }

    springs.forEach(function (s) {
      s.el.addEventListener("pointermove", function (event) {
        var rect = s.el.getBoundingClientRect();
        var dx = event.clientX - (rect.left + rect.width / 2);
        var dy = event.clientY - (rect.top + rect.height / 2);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          s.tx = dx * 0.3;
          s.ty = dy * 0.3;
        } else {
          s.tx = 0;
          s.ty = 0;
        }
        wake();
      });
      s.el.addEventListener("pointerleave", function () {
        s.tx = 0;
        s.ty = 0;
        wake();
      });
    });
  }

  /* ---------- Primitive 5: AnimatedBackground (ink-wash) ----------
     One absolutely-positioned ink-wash fill per hover zone slides between
     hovered/pressed rows (the shared-layout `layoutId` idea, ported to one
     moving div per zone), 180ms. This is the row-highlight mechanism;
     no per-row background colors. Fine-pointer only; touch uses :active. */
  if (!reduced && finePointer) {
    document.querySelectorAll(".ledger, .toc-list").forEach(function (zone) {
      var wash = document.createElement("div");
      wash.className = "ink-wash";
      wash.setAttribute("aria-hidden", "true");
      zone.insertBefore(wash, zone.firstChild);
      var rows = zone.querySelectorAll(".ledger-row, .toc-entry");
      function moveWash(el) {
        var zoneRect = zone.getBoundingClientRect();
        var rect = el.getBoundingClientRect();
        wash.style.height = rect.height + "px";
        wash.style.transform = "translateY(" + (rect.top - zoneRect.top) + "px)";
        wash.classList.add("on");
      }
      function hideWash() {
        wash.classList.remove("on");
      }
      rows.forEach(function (el) {
        el.addEventListener("pointerenter", function () { moveWash(el); });
        el.addEventListener("pointerleave", hideWash);
      });
    });
  }

  /* ---------- The signature interaction: stamp-press ----------
     Tapping a row or TOC entry is one orchestrated 250ms moment:
     the ink-wash slides in (5), the row nudges magnetically (4), and
     the stamp settles from -3deg to 0deg. CSS :active carries the
     stamp settle on touch; this adds the press class for mouse/stylus. */
  if (!reduced) {
    document.querySelectorAll(".ledger-row, .toc-entry").forEach(function (el) {
      el.addEventListener("pointerdown", function () {
        el.classList.add("pressed");
      });
      ["pointerup", "pointercancel", "pointerleave"].forEach(function (evt) {
        el.addEventListener(evt, function () {
          window.setTimeout(function () { el.classList.remove("pressed"); }, 250);
        });
      });
    });
  }

  /* ---------- smooth in-page anchors ----------
     CSS scroll-behavior handles it; this keeps focus on the target for
     keyboard users. Reduced motion: native jump, no smooth scroll. */
  if (!reduced) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      if (link.hasAttribute("data-open-toc")) return;
      if (link.id === "tocButton") return;
      link.addEventListener("click", function (event) {
        var hash = link.getAttribute("href");
        /* "#!" is the no-JS drawer-close target, not a real element id */
        if (hash.length < 2 || hash === "#!") return;
        var target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        history.replaceState(null, "", hash);
      });
    });
  }
})();
