/* FIELD KIT shell + popups. Injected on every page of the prototype.
   The shell stays thin: a top bar where the page has none, a bottom
   kit bar with the signal ticker, and the popup system. All popup
   copy is real: schedules, statuses, sources. Nothing invented. */
(function () {
  "use strict";
  var script = document.currentScript;
  var base = "";
  if (script && script.src) {
    base = script.src.replace(/assets\/kit\.js.*$/, "");
  }
  var path = window.location.pathname;
  var page = path.split("/").pop() || "index.html";
  if (path.indexOf("/work/") !== -1) page = "work/" + page;

  /* ---------- bottom kit bar ---------- */
  var LINES = [
    "<b>WILDCLASH ARENA</b> // TWO NEW SHORTS TODAY, 09:00 + 17:00 ET",
    "<b>DEAL SNIPERS</b> // ONLY DEALS VERIFIED AGAINST PRICE HISTORY GET POSTED",
    "<b>ANDOLA</b> // LATEST JOB: PATIO EXTENSION, OCT 2026",
    "<b>FIELD NOTES</b> // NEWEST NOTE: OCT 2026",
    "<b>BACKSEAT</b> // V0.9.14 IS THE CURRENT BUILD"
  ];
  var tabs = [
    ["index.html", "HOME"],
    ["index.html#work", "WORK"],
    ["notes.html", "NOTES"],
    ["story.html", "STORY"],
    ["resume.html", "RESUME"]
  ];
  var current = page === "index.html" ? "index.html"
    : page === "notes.html" ? "notes.html"
    : page === "story.html" ? "story.html"
    : page === "resume.html" ? "resume.html"
    : page.indexOf("work/") === 0 ? "index.html#work" : "";

  var bar = document.createElement("div");
  bar.className = "kit-bar";
  var ticker = document.createElement("div");
  ticker.className = "kit-ticker";
  var ti = Math.floor(Math.random() * LINES.length);
  ticker.innerHTML = LINES[ti];
  bar.appendChild(ticker);
  var nav = document.createElement("nav");
  nav.className = "kit-tabs";
  nav.setAttribute("aria-label", "Site");
  tabs.forEach(function (t) {
    var a = document.createElement("a");
    a.href = base + t[0];
    a.textContent = t[1];
    if (t[0] === current) a.setAttribute("aria-current", "page");
    if (t[1] === "RESUME") a.className = "hot";
    nav.appendChild(a);
  });
  bar.appendChild(nav);
  document.body.appendChild(bar);
  setInterval(function () {
    ti = (ti + 1) % LINES.length;
    ticker.innerHTML = LINES[ti];
  }, 4000);

  /* ---------- top bar, only where the page has none ---------- */
  if (!document.querySelector(".kit-top, .site-nav")) {
    var top = document.createElement("header");
    top.className = "kit-top";
    top.innerHTML =
      '<a class="kit-mark" href="' + base + 'index.html">DA</a>' +
      '<span class="kit-word">DAREK ANDERSON <small>// FIELD KIT</small></span>' +
      "<nav>" +
      '<a href="' + base + 'notes.html">NOTES</a>' +
      '<a href="' + base + 'story.html">STORY</a>' +
      '<a href="' + base + 'resume.html">RESUME</a>' +
      '<a class="hot" href="' + base + 'index.html#doors">CONTACT</a>' +
      "</nav>";
    document.body.insertBefore(top, document.body.firstChild);
  }

  /* ---------- popup system ---------- */
  function openPop(kind, head, big, bodyHtml, actions) {
    closePop();
    var veil = document.createElement("div");
    veil.className = "pop-veil";
    var pop = document.createElement("div");
    pop.className = "pop pop--" + kind;
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-modal", "true");
    var h = document.createElement("div");
    h.className = "pop-head";
    h.innerHTML = "<span>" + head + "</span>";
    var x = document.createElement("button");
    x.className = "pop-x";
    x.type = "button";
    x.textContent = "X";
    x.setAttribute("aria-label", "Close");
    x.addEventListener("click", closePop);
    h.appendChild(x);
    pop.appendChild(h);
    var b = document.createElement("div");
    b.className = "pop-body";
    b.innerHTML = (big ? '<p class="pop-big">' + big + "</p>" : "") + bodyHtml;
    pop.appendChild(b);
    if (actions && actions.length) {
      var row = document.createElement("div");
      row.className = "pop-actions";
      actions.forEach(function (a) {
        var el = document.createElement(a.href ? "a" : "button");
        el.className = "btn " + (a.cls || "btn-yellow");
        el.textContent = a.label;
        if (a.href) { el.href = a.href; }
        else { el.type = "button"; el.addEventListener("click", function () { if (a.fn) a.fn(); closePop(); }); }
        row.appendChild(el);
      });
      pop.appendChild(row);
    }
    veil.appendChild(pop);
    veil.addEventListener("click", function (e) { if (e.target === veil) closePop(); });
    document.addEventListener("keydown", escClose);
    document.body.appendChild(veil);
    x.focus();
  }
  function escClose(e) { if (e.key === "Escape") closePop(); }
  function closePop() {
    var v = document.querySelector(".pop-veil");
    if (v) v.remove();
    document.removeEventListener("keydown", escClose);
  }

  /* ---------- source popups (tap a number, get its source) ---------- */
  var SOURCES = {
    files: ["SOURCE // CASE FILES", "8 files, 8 receipts.",
      "<p>Every project on this page has its own case file: what was built, what broke, how it is judged, and the results. No project is listed here without one.</p>"],
    revenue: ["SOURCE // QUICKBOOKS", "$43.6K revenue. $20.6K net.",
      "<p>Andola's first eight months on the books. If a number is not in QuickBooks, I do not put it on this page.</p>"],
    margin: ["SOURCE // QUICKBOOKS", "47% net margin.",
      "<p>$20.6K net on $43.6K revenue, same QuickBooks record as the revenue figure. The math is the math.</p>"],
    shorts: ["SOURCE // THE FACTORY", "Two Shorts a day.",
      "<p>WildClash Arena publishes at 09:00 and 17:00 ET, every day. Scripts, footage, edit, captions, sound, publish: the factory runs itself.</p>"]
  };
  document.querySelectorAll("[data-pop]").forEach(function (el) {
    el.addEventListener("click", function () {
      var s = SOURCES[el.getAttribute("data-pop")];
      if (s) openPop("source", s[0], s[1], s[2], [{ label: "FILE IT", cls: "btn-green" }]);
    });
  });

  /* ---------- the field notice (once per session) ---------- */
  var NOTICES = {
    "index.html": ["FIELD NOTICE // 001", "Two new Shorts are live.",
      "<p>WildClash Arena posted at 09:00 and 17:00 ET today, like every day. The factory runs itself; I never touch it.</p>",
      [{ label: "WATCH THE CHANNEL", href: "https://www.youtube.com/@WildClashArenaHQ", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/andola.html": ["FIELD NOTICE // EXP-01", "The books are the receipt.",
      "<p>$43.6K revenue and $20.6K net in the first eight months, straight out of QuickBooks. If a number is not in QuickBooks, it is not on this page.</p>",
      [{ label: "ANDOLALANDSCAPING.COM", href: "https://andolalandscaping.com", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/backseat.html": ["FIELD NOTICE // EXP-02", "V0.9.14 is the current build.",
      "<p>Timeouts are a state now, not a verdict, and the worktree checkpoints itself. The repo is public and the protocol is open.</p>",
      [{ label: "OPEN THE REPO", href: "https://github.com/darek225/backseat", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/bookvera.html": ["FIELD NOTICE // EXP-03", "Bookvera is in development.",
      "<p>An AI bookkeeping plugin for QuickBooks Online. The app is live for testing; the Intuit review is the gate.</p>",
      [{ label: "OPEN THE APP", href: "https://acuity-lovat.vercel.app", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/dowser.html": ["FIELD NOTICE // EXP-04", "Dowser is in development.",
      "<p>An AI outbound engine: find the prospect, write the outreach, book the meeting. The live demo is up.</p>",
      [{ label: "OPEN THE DEMO", href: "https://dowser-peach.vercel.app", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/carolina-trade-sites.html": ["FIELD NOTICE // EXP-05", "The demo hub is live.",
      "<p>Productized website design for Charlotte home-service companies. The hub shows the offer and the work.</p>",
      [{ label: "OPEN THE HUB", href: "https://carolina-trade-sites.vercel.app", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/deal-snipers.html": ["FIELD NOTICE // EXP-06", "Only verified deals get posted.",
      "<p>Every deal is checked against price history before it posts. No verified drop, no post. The hub collects every channel.</p>",
      [{ label: "OPEN THE HUB", href: "https://dealsnipers.github.io/deal-snipers-links/", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/wildclash.html": ["FIELD NOTICE // EXP-07", "Two new Shorts are live.",
      "<p>Posted at 09:00 and 17:00 ET today, like every day. Scripts, footage, edit, captions, sound, publish: automated end to end.</p>",
      [{ label: "WATCH THE CHANNEL", href: "https://www.youtube.com/@WildClashArenaHQ", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/neverreteach.html": ["FIELD NOTICE // EXP-08", "Teach each lesson once.",
      "<p>NeverReteach files every lesson into a wiki your next agent session loads automatically. Public and open source.</p>",
      [{ label: "OPEN THE REPO", href: "https://github.com/darek225/neverreteach", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "notes.html": ["FIELD NOTICE // NOTES", "The notes land here first.",
      "<p>Build logs, three times a week: what is actually working with AI, found empirically. Every note also generates a ready-to-post thread for X.</p>",
      [{ label: "RSS FEED", href: base + "notes.xml", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "resume.html": ["FIELD NOTICE // RESUME", "This page prints clean.",
      "<p>The kit comes off on paper: one click gets you a plain, professional PDF with none of the machinery on it.</p>",
      [{ label: "PRINT / SAVE PDF", cls: "btn-red", fn: function () { window.print(); } }, { label: "FILE IT", cls: "btn-ghost" }]]
  };
  try {
    if (!sessionStorage.getItem("kit-notice")) {
      var n = NOTICES[page];
      if (n) {
        setTimeout(function () {
          sessionStorage.setItem("kit-notice", "1");
          openPop("notice", n[0], n[1], n[2], n[3]);
        }, 1100);
      }
    }
  } catch (e) { /* private mode: no notice, no harm */ }
})();
