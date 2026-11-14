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
    ["study.html", "STUDY"],
    ["story.html", "STORY"],
    ["resume.html", "RESUME"]
  ];
  var current = page === "index.html" ? "index.html"
    : page === "notes.html" ? "notes.html"
    : page === "study.html" ? "study.html"
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
      '<a href="' + base + 'study.html">STUDY</a>' +
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
    files: ["SOURCE // CASE FILES", "Eight case files.",
      "<p>Every project on this page has its own case file: Built, What broke, How I judge it, Results.</p>"],
    business: ["SOURCE // THE WORK", "One operating business.",
      "<p>Andola Landscape Services: a commercial and residential landscaping company in the Charlotte area. The case file has the details.</p>"],
    systems: ["SOURCE // THE WORK", "Seven software systems.",
      "<p>Backseat, Bookvera, Dowser, Carolina Trade Sites, Deal Snipers, WildClash Arena, and NeverReteach. Each one has its own case file below.</p>"],
    shorts: ["SOURCE // THE FACTORY", "Two Shorts a day.",
      "<p>Publishes two Shorts daily, at 09:00 and 17:00 ET. An automated YouTube Shorts factory: scripts, footage, edit, captions, sound, publish. I never touch it.</p>"]
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
      "<p>Publishes two Shorts daily, at 09:00 and 17:00 ET. An automated YouTube Shorts factory: scripts, footage, edit, captions, sound, publish. I never touch it.</p>",
      [{ label: "WATCH THE CHANNEL", href: "https://www.youtube.com/@WildClashArenaHQ", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/andola.html": ["FIELD NOTICE // EXP-01", "$43.6K revenue. $20.6K net.",
      "<p>$43.6K revenue and $20.6K net in the first eight months on the books. If a number is not in QuickBooks, it is not on this page.</p>",
      [{ label: "ANDOLALANDSCAPING.COM", href: "https://andolalandscaping.com", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/backseat.html": ["FIELD NOTICE // EXP-02", "V0.9.14 is the current build.",
      "<p>v0.9.14 shipped with the timeout fix and checkpointing. It is agent-agnostic: any agentic AI that can use shell and git can sit in the architect seat, not just Muse.</p>",
      [{ label: "OPEN THE REPO", href: "https://github.com/darek225/backseat", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/bookvera.html": ["FIELD NOTICE // EXP-03", "Bookvera is in development.",
      "<p>An AI bookkeeping plugin for QuickBooks Online that keeps small-business books clean in the background.</p>",
      [{ label: "OPEN THE APP", href: "https://acuity-lovat.vercel.app", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/dowser.html": ["FIELD NOTICE // EXP-04", "Dowser is in development.",
      "<p>An AI outbound engine that finds prospects and turns cold outreach into booked meetings.</p>",
      [{ label: "OPEN THE DEMO", href: "https://dowser-peach.vercel.app", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/carolina-trade-sites.html": ["FIELD NOTICE // EXP-05", "The demo hub is live.",
      "<p>Productized website design for Charlotte home-service companies, built by AI and audited by humans.</p>",
      [{ label: "OPEN THE HUB", href: "https://carolina-trade-sites.vercel.app", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/deal-snipers.html": ["FIELD NOTICE // EXP-06", "Only verified deals get posted.",
      "<p>A multi-agent system that hunts deep discounts, verifies them, and posts the real ones automatically. Posts only deals verified against price history.</p>",
      [{ label: "OPEN THE HUB", href: "https://dealsnipers.github.io/deal-snipers-links/", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/wildclash.html": ["FIELD NOTICE // EXP-07", "Two new Shorts are live.",
      "<p>Publishes two Shorts daily, at 09:00 and 17:00 ET. An automated YouTube Shorts factory: scripts, footage, edit, captions, sound, publish. I never touch it.</p>",
      [{ label: "WATCH THE CHANNEL", href: "https://www.youtube.com/@WildClashArenaHQ", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "work/neverreteach.html": ["FIELD NOTICE // EXP-08", "Teach each lesson once.",
      "<p>A self-building memory wiki for AI coding agents. Teach each lesson once; it files itself and loads on every future project.</p>",
      [{ label: "OPEN THE REPO", href: "https://github.com/darek225/neverreteach", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "study.html": ["FIELD NOTICE // THE STUDY", "What I'm thinking.",
      "<p>Longer writing on the ideas in The Hypothesis: what AI is actually good for, found empirically. Published here as field notes grow into essays.</p>",
      [{ label: "READ THE STORY", href: base + "story.html", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "notes.html": ["FIELD NOTICE // NOTES", "Build logs, three times a week.",
      "<p>Build logs, three times a week. What is actually working with AI, found empirically, no hype.</p>",
      [{ label: "RSS FEED", href: base + "notes.xml", cls: "btn-red" }, { label: "FILE IT", cls: "btn-ghost" }]],
    "resume.html": ["FIELD NOTICE // RESUME", "Print / save as PDF.",
      "<p>Use the button below to print this page or save it as a PDF. The site machinery does not print.</p>",
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
