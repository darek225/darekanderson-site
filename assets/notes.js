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
