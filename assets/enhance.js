/* darekanderson.com v5
   Progressive enhancement only. Every page is fully composed with this
   file disabled; the script adds classes and motion, never content.
   Contents: InView opener reveals, AnimatedGroup stagger, the
   stamp-press signature interaction, case-file tabs (roving tabindex,
   hash deep-link), field-note tag filter.
   History: this file is the single survivor of the v5 JS merge; the
   stamp-press, AnimatedGroup stagger, panel fade, and hashchange
   deep-link were ported here from the former assets/site.js, which
   has been deleted. No TOC or drawer code lives here: v5 has no
   contents drawer. */

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
    var section = target.closest ? target.closest(".chapter, .case-tabs") : null;
    if (!section) return;
    section.querySelectorAll(".opener, .chapter-end").forEach(function (el) {
      el.classList.add("in-view");
    });
  }
  revealForHash();

  /* ---------- InView (primitive 1) ----------
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

  /* ---------- AnimatedGroup, slide preset (primitive 2) ----------
     Staggered reveal for [data-stagger] containers (in v5: the Start
     Here shelf). Item { opacity 0->1, y 8px }, 60ms stagger, first 6
     items only; later items join instantly. Container triggers once.
     Ported from site.js (which targeted the v3/v7 ledger rows). */
  if (!reduced && hasIO) {
    var groupObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var items = Array.prototype.slice.call(entry.target.children);
        items.forEach(function (item, i) {
          if (i < 6) item.style.transitionDelay = (i * 60) + "ms";
          item.classList.add("in-view");
          /* drop the transition after the reveal so press motion
             owns the transform without double-smoothing */
          window.setTimeout(function () {
            item.style.transitionDelay = "";
            item.classList.add("settled");
          }, 450);
        });
        groupObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      groupObserver.observe(group);
    });
  } else {
    document.querySelectorAll("[data-stagger] > *").forEach(function (item) {
      item.classList.add("in-view");
    });
  }

  /* ---------- The signature interaction: stamp-press ----------
     Pressing a shelf entry or specimen card is one orchestrated 250ms
     moment: the row nudges under :active, the stamp settles from -3deg
     to 0deg. CSS :active carries the stamp settle on touch; this adds
     the press class for mouse/stylus (fine-pointer).
     Ported from site.js (which targeted .ledger-row/.shelf-entry). */
  if (!reduced && finePointer) {
    document.querySelectorAll(".shelf-entry, .specimen-card").forEach(function (el) {
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

  /* ---------- Case-file tabs ----------
     The DOM ships as stacked sections, fully readable with JS off.
     With JS on, each [data-tabs] block gains a tablist built from its
     panel headings; panels become switchable, deep-linkable by hash
     (#panel-built, #panel-broke, #panel-judge, #panel-results).
     Keyboard: left/right arrows move between tabs, Home/End jump.
     Only the incoming panel fades (180ms). No auto-rotation. */
  document.querySelectorAll("[data-tabs]").forEach(function (root) {
    var panels = Array.prototype.slice.call(root.querySelectorAll(".tab-panel"));
    if (panels.length < 2) return;

    var list = document.createElement("div");
    list.className = "tab-list";
    list.setAttribute("role", "tablist");
    list.setAttribute("aria-label", "Case file sections");

    var tabs = panels.map(function (panel) {
      var heading = panel.querySelector(".case-label");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn";
      btn.id = "tab-for-" + panel.id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-controls", panel.id);
      btn.textContent = heading ? heading.textContent : panel.id;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", btn.id);
      list.appendChild(btn);
      return btn;
    });

    root.insertBefore(list, root.firstChild);

    function select(idx, opts) {
      opts = opts || {};
      tabs.forEach(function (tab, i) {
        var on = i === idx;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
        panels[i].classList.remove("is-entering");
      });
      /* fade the incoming panel only */
      if (!opts.skipFade && !reduced) {
        var panel = panels[idx];
        panel.classList.add("is-entering");
        panel.addEventListener("animationend", function done() {
          panel.classList.remove("is-entering");
          panel.removeEventListener("animationend", done);
        });
      }
      if (opts.focus) tabs[idx].focus();
      if (opts.setHash && window.history && history.replaceState) {
        history.replaceState(null, "", "#" + panels[idx].id);
      }
    }

    function indexForHash() {
      var hash = window.location.hash;
      for (var i = 0; i < panels.length; i++) {
        if ("#" + panels[i].id === hash) return i;
      }
      return -1;
    }

    var start = indexForHash();
    select(start === -1 ? 0 : start, { skipFade: true });

    /* hashes arriving after load (another page's link, a manual edit)
       switch to the matching panel; hashchange deep-link ported from
       site.js */
    window.addEventListener("hashchange", function () {
      var idx = indexForHash();
      if (idx !== -1) select(idx, { skipFade: true, setHash: false });
    });

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, { setHash: true }); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next !== null) {
          event.preventDefault();
          select(next, { focus: true, setHash: true });
        }
      });
    });
  });

  /* ---------- Field-note tag filter ----------
     All notes are visible with JS off (the filter bar is hidden by CSS
     until .js). With JS on, one filter is active at a time: aria-pressed
     plus the .is-active style class; notes narrow via .is-filtered-out. */
  var filterBtns = document.querySelectorAll("[data-filter]");
  var notes = document.querySelectorAll(".note[data-tags]");
  if (filterBtns.length && notes.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tag = btn.getAttribute("data-filter");
        filterBtns.forEach(function (b) {
          var on = b === btn;
          b.setAttribute("aria-pressed", on ? "true" : "false");
          b.classList.toggle("is-active", on);
        });
        notes.forEach(function (note) {
          var tags = (note.getAttribute("data-tags") || "").split(/\s+/);
          note.classList.toggle("is-filtered-out", tag !== "all" && tags.indexOf(tag) === -1);
        });
        /* announce the new visible count for screen readers (web-interface-guidelines: async updates) */
        var status = document.getElementById("notes-filter-status");
        if (status) {
          var visible = 0;
          notes.forEach(function (note) {
            if (!note.classList.contains("is-filtered-out")) visible++;
          });
          var label = btn.textContent.replace(/^\s+|\s+$/g, "");
          status.textContent = "Showing " + visible + (visible === 1 ? " note" : " notes") + " tagged " + label + ".";
        }
      });
      /* mark the shipped default (aria-pressed="true") as styled-active */
      if (btn.getAttribute("aria-pressed") === "true") btn.classList.add("is-active");
    });
  }
})();
