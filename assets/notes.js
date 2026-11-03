/* Field Notes interactivity: count-up stats when they scroll into view.
   Values are final in the HTML, so no-JS and reduced-motion readers see them as-is. */
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  var els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 900;
    function frame(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var val = target * (1 - Math.pow(1 - t, 3));
      el.textContent = prefix + val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.4 });
  els.forEach(function (el) { io.observe(el); });
})();

/* Filing drawer (2026-11-03): tag counts on the filter buttons and a
   month drawer above them. Counts are computed from the live DOM, so
   they stay true as notes are added. The archive order is editorial
   (roundups and seed notes sit where they were filed), so months are
   an index that jumps, not a re-sort. */
(function () {
  "use strict";
  var notes = Array.prototype.slice.call(document.querySelectorAll("article.note"));
  if (!notes.length) return;
  /* tag counts */
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    var tag = btn.getAttribute("data-filter");
    var n = tag === "all" ? notes.length : notes.filter(function (note) {
      return (note.getAttribute("data-tags") || "").split(/\s+/).indexOf(tag) !== -1;
    }).length;
    btn.setAttribute("data-count", String(n));
  });
  /* month drawer */
  var MONTHS = { JAN: "JAN", FEB: "FEB", MAR: "MAR", APR: "APR", MAY: "MAY", JUN: "JUN", JUL: "JUL", AUG: "AUG", SEP: "SEP", OCT: "OCT", NOV: "NOV", DEC: "DEC" };
  var groups = [], seen = {};
  notes.forEach(function (note) {
    var d = note.querySelector(".note-date");
    if (!d) return;
    var parts = d.textContent.replace(/\s+/g, " ").split(" ");
    var mon = MONTHS[parts[0]], year = parts[parts.length - 1].replace(/[^0-9]/g, "");
    if (!mon || !year) return;
    var key = mon + " " + year;
    if (!seen[key]) { seen[key] = { key: key, count: 0, firstId: note.id }; groups.push(seen[key]); }
    seen[key].count++;
  });
  var filter = document.querySelector(".note-filter");
  if (!filter || groups.length < 2) return;
  var nav = document.createElement("nav");
  nav.className = "month-drawer";
  nav.setAttribute("aria-label", "Notes by month");
  var label = document.createElement("span");
  label.className = "drawer-label";
  label.textContent = "FILED UNDER:";
  nav.appendChild(label);
  groups.forEach(function (g) {
    var a = document.createElement("a");
    a.className = "drawer-tab";
    a.href = "#" + g.firstId;
    a.textContent = g.key + " · " + g.count;
    nav.appendChild(a);
  });
  filter.parentNode.insertBefore(nav, filter);
})();
