/* Sarim Siddiqui — Portfolio v2 interactions */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── smooth scroll (Lenis, progressive enhancement) ── */
  var lenis = null;
  if (!prefersReduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }
  }
  function scrollToTarget(sel) {
    var el = document.querySelector(sel);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        scrollToTarget(id);
        closeMenu();
      }
    });
  });

  /* ── split hero letters ── */
  document.querySelectorAll(".ht-word").forEach(function (w) {
    var word = w.getAttribute("data-word") || "";
    w.innerHTML = "";
    word.split("").forEach(function (c, i) {
      var s = document.createElement("span");
      s.className = "ch";
      s.textContent = c;
      s.style.transitionDelay = (i * 18) + "ms";
      w.appendChild(s);
    });
  });

  /* ── preloader ── */
  var pre = document.getElementById("preloader");
  var preNum = document.getElementById("preNum");
  var preBar = document.getElementById("preBar");
  var heroChars = document.querySelectorAll(".ht-word .ch");
  heroChars.forEach(function (c) {
    c.style.transform = "translateY(110%)";
    c.style.display = "inline-block";
  });

  function heroIntro() {
    heroChars.forEach(function (c, i) {
      setTimeout(function () {
        c.style.transition = "transform .8s cubic-bezier(.22,1,.36,1)";
        c.style.transform = "translateY(0)";
      }, i * 45);
    });
  }

  var progress = 0;
  function finishLoad() {
    pre.classList.add("done");
    setTimeout(heroIntro, 150);
  }
  if (prefersReduced) {
    preNum.textContent = "100";
    preBar.style.width = "100%";
    finishLoad();
  } else {
    var tick = setInterval(function () {
      progress += Math.random() * 16 + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(tick);
        setTimeout(finishLoad, 250);
      }
      preNum.textContent = Math.floor(progress);
      preBar.style.width = progress + "%";
    }, 110);
    // safety: never trap the user
    setTimeout(function () { if (!pre.classList.contains("done")) { clearInterval(tick); finishLoad(); } }, 5000);
  }

  /* ── role rotator ── */
  var words = ["technical audits", "link building", "keyword research", "local SEO", "honest reporting"];
  var rotEl = document.getElementById("rotWord");
  var wi = 0;
  if (rotEl && !prefersReduced) {
    setInterval(function () {
      rotEl.style.transition = "opacity .25s, transform .25s";
      rotEl.style.opacity = "0";
      rotEl.style.transform = "translateY(8px)";
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        rotEl.textContent = words[wi];
        rotEl.style.opacity = "1";
        rotEl.style.transform = "translateY(0)";
      }, 260);
    }, 2600);
  }

  /* ── search-box typewriter ── */
  var queries = [
    "best seo specialist in pakistan",
    "how to fix indexing issues",
    "real backlinks not spam",
    "sarim siddiqui seo"
  ];
  var typeEl = document.getElementById("typeQuery");
  var qi = 0, ci = 0, deleting = false;
  function typeLoop() {
    if (!typeEl) return;
    var q = queries[qi];
    if (!deleting) {
      ci++;
      typeEl.textContent = q.slice(0, ci);
      if (ci === q.length) { deleting = true; return void setTimeout(typeLoop, 2100); }
      setTimeout(typeLoop, 55 + Math.random() * 60);
    } else {
      ci -= 3;
      if (ci <= 0) { ci = 0; deleting = false; qi = (qi + 1) % queries.length; }
      typeEl.textContent = q.slice(0, ci);
      setTimeout(typeLoop, 28);
    }
  }
  if (typeEl && !prefersReduced) setTimeout(typeLoop, 2200);
  else if (typeEl) typeEl.textContent = queries[3];

  /* ── reveal on scroll ── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.style.transition = "opacity .9s cubic-bezier(.22,1,.36,1), transform .9s cubic-bezier(.22,1,.36,1)";
        en.target.style.opacity = "1";
        en.target.style.transform = "translateY(0)";
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.transitionDelay = ((i % 4) * 70) + "ms";
    io.observe(el);
  });

  /* ── accordion ── */
  document.querySelectorAll(".acc-item").forEach(function (item) {
    var head = item.querySelector(".acc-head");
    var body = item.querySelector(".acc-body");
    head.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".acc-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".acc-body").style.maxHeight = "0px";
        o.querySelector(".acc-head").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ── custom cursor + magnetic buttons ── */
  var cursor = document.getElementById("cursor");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (cursor && fine && !prefersReduced) {
    var cx = -100, cy = -100, tx = -100, ty = -100;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function follow() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate(" + (cx - 7) + "px," + (cy - 7) + "px)";
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll("a, button, .acc-head").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("grow"); });
    });
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + x * 0.18 + "px," + y * 0.28 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = "translate(0,0)"; });
    });
  } else if (cursor) {
    cursor.style.display = "none";
  }

  /* ── nav state + burger ── */
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var navLinks = document.getElementById("navLinks");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function closeMenu() {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* ── back to top + year ── */
  document.getElementById("toTop").addEventListener("click", function () {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ── contact form → reviewable email draft ── */
  var form = document.getElementById("contactForm");
  var err = document.getElementById("formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("fName").value.trim();
    var email = document.getElementById("fEmail").value.trim();
    var site = document.getElementById("fSite").value.trim();
    var msg = document.getElementById("fMsg").value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !msg) { err.hidden = false; return; }
    err.hidden = true;
    var subject = encodeURIComponent("Project enquiry from " + name);
    var body = encodeURIComponent(
      "Name: " + name + "\nEmail: " + email + "\nWebsite: " + (site || "—") + "\n\n" + msg
    );
    window.location.href = "mailto:Sarimsiddiqui900@gmail.com?subject=" + subject + "&body=" + body;
  });

  /* ── subtle hero parallax on mouse ── */
  var hero = document.querySelector(".hero");
  if (hero && fine && !prefersReduced) {
    hero.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 18;
      var y = (e.clientY / window.innerHeight - 0.5) * 18;
      document.querySelectorAll(".orb").forEach(function (o, i) {
        o.style.translate = (x * (i + 1) * 0.6) + "px " + (y * (i + 1) * 0.6) + "px";
      });
    });
  }
})();
