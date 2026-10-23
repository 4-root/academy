
(function () {
  'use strict';

  var body = document.body;
  var BASE = body.dataset.base || '';
  var PAGETYPE = body.dataset.page || 'lesson';
  var LESSON_PATH = (function () {
    try { return decodeURIComponent(location.pathname || '/'); }
    catch (e) { return location.pathname || '/'; }
  })();

  /* ==========================================================
     EFEITOS OFICIAIS 4ROOT
     ========================================================== */

  /* ---- Cursor cyber (implementacao exata do 4root.com.br) ---- */
  (function cursor() {
    var cursor = document.getElementById('cyber-cursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;
    var inactivityTimer;

    document.addEventListener('mousemove', function (e) {
      cursor.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
      cursor.classList.remove('inactive', 'hidden');
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(function () {
        cursor.classList.add('inactive');
      }, 2000);
    });

    document.documentElement.addEventListener('mouseleave', function () {
      cursor.classList.add('hidden');
    });
    document.documentElement.addEventListener('mouseenter', function () {
      cursor.classList.remove('hidden');
    });
    window.addEventListener('blur', function () { cursor.classList.add('hidden'); });
    window.addEventListener('focus', function () { cursor.classList.remove('hidden'); });

    function triggerRandomGlitch() {
      cursor.classList.add('glitch-active');
      setTimeout(function () { cursor.classList.remove('glitch-active'); }, 250);
      var randomTime = Math.random() * 2000 + 1000;
      setTimeout(triggerRandomGlitch, randomTime);
    }
    triggerRandomGlitch();
  })();

  /* ---- Barra de progresso de scroll (oficial) ---- */
  (function scrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    var tick = false;
    function upd() {
      tick = false;
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; requestAnimationFrame(upd); }
    }, { passive: true });
    upd();
  })();

  /* ---- Navbar: fundo ao rolar (exato 4root.com.br) ---- */
  (function navbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    function upd() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  })();

  /* ---- Menu mobile ---- */
  (function mobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var overlay = document.getElementById('mobile-menu');
    if (!btn || !overlay) return;
    btn.addEventListener('click', function () {
      var open = overlay.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target === overlay) overlay.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') overlay.classList.remove('open');
    });
  })();

  /* ---- Arvore da trilha: expandir/recolher (">" ou pasta sem nota) ----
     Delegacao: funciona na sidebar da nota e nos clones do modal. ---- */
  function bindTreeNav(scope) {
    if (!scope || scope.dataset.treeBound) return;
    scope.dataset.treeBound = '1';
    scope.addEventListener('click', function (e) {
      var tw = e.target.closest('.sn-tw');
      if (tw) {
        e.preventDefault();
        var node = tw.closest('.sn-node');
        if (node) node.classList.toggle('exp');
        return;
      }
      var fold = e.target.closest('.sn-mod-fold');
      if (fold) {
        e.preventDefault();
        var n2 = fold.closest('.sn-node');
        if (n2) n2.classList.toggle('exp');
      }
    });
  }
  window.__bindTreeNav = bindTreeNav;
  document.querySelectorAll('.side-nav').forEach(bindTreeNav);

  /* ---- Alca de arraste: redimensiona sidebar da nota e do modal ---- */
  (function resizers() {
    document.querySelectorAll('.sn-resizer').forEach(function (rz) {
      var pane = rz.closest('.note-side, .nm-side');
      if (!pane) return;
      var key = pane.classList.contains('nm-side') ? '4root-nmw' : '4root-snw';
      try {
        var saved = parseInt(localStorage.getItem(key), 10);
        if (saved >= 200 && saved <= 520) pane.style.width = saved + 'px';
      } catch (e) {}
      rz.addEventListener('mousedown', function (e) {
        var startX = e.clientX;
        var startW = pane.getBoundingClientRect().width;
        rz.classList.add('dragging');
        document.body.classList.add('resizing');
        function move(ev) {
          var w = Math.max(200, Math.min(520, startW + (ev.clientX - startX)));
          pane.style.width = w + 'px';
        }
        function up() {
          rz.classList.remove('dragging');
          document.body.classList.remove('resizing');
          document.removeEventListener('mousemove', move);
          document.removeEventListener('mouseup', up);
          try { localStorage.setItem(key, String(parseInt(pane.style.width, 10) || '')); } catch (err) {}
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
        e.preventDefault();
      });
    });
  })();

  /* ---- Particulas + raios (algoritmo oficial 4root) ---- */
  (function particles() {
    var canvas = document.getElementById('particle-canvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ctx = canvas.getContext('2d');
    var particles = [], animFrame, w, h;
    var mouse = { x: -9999, y: -9999, active: false };
    var lightnings = [];

    function resize() {
      var section = canvas.parentElement;
      w = canvas.width = section.offsetWidth;
      h = canvas.height = section.offsetHeight;
    }
    function createParticles() {
      particles = [];
      var count = Math.floor((w * h) / 4000);
      var maxCount = Math.min(count, 400);
      for (var i = 0; i < maxCount; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.30, vy: (Math.random() - 0.5) * 0.30,
          r: Math.random() * 0.8 + 0.3
        });
      }
    }
    function distance(x1, y1, x2, y2) { return Math.hypot(x1 - x2, y1 - y2); }
    function createLightning() {
      if (!mouse.active) return;
      var nearby = particles.filter(function (p) { return distance(p.x, p.y, mouse.x, mouse.y) < 180; });
      if (nearby.length < 2) return;
      var start = nearby[Math.floor(Math.random() * nearby.length)];
      var end = nearby[Math.floor(Math.random() * nearby.length)];
      if (start === end) return;
      lightnings.push({ start: start, end: end, life: 6 + Math.random() * 4 });
    }
    function drawLightning() {
      if (mouse.active && Math.random() < 0.035) createLightning();
      for (var i = lightnings.length - 1; i >= 0; i--) {
        var bolt = lightnings[i];
        var x1 = bolt.start.x, y1 = bolt.start.y, x2 = bolt.end.x, y2 = bolt.end.y;
        var dx = x2 - x1, dy = y2 - y1;
        var len = Math.hypot(dx, dy);
        var segments = Math.max(8, Math.floor(len / 12));
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff4058';
        ctx.strokeStyle = 'rgba(0,255,65,' + (bolt.life / 10) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        for (var s = 1; s < segments; s++) {
          var t = s / segments;
          var px = x1 + dx * t, py = y1 + dy * t;
          var offset = (Math.random() - 0.5) * 18;
          var nx = -dy / len, ny = dx / len;
          ctx.lineTo(px + nx * offset, py + ny * offset);
        }
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if (Math.random() < 0.45) {
          var tt = Math.random();
          var bx = x1 + dx * tt, by = y1 + dy * tt;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + (Math.random() - 0.5) * 35, by + (Math.random() - 0.5) * 35);
          ctx.stroke();
        }
        ctx.restore();
        bolt.life -= 1;
        if (bolt.life <= 0) lightnings.splice(i, 1);
      }
    }
    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      var maxDist = 200;
      for (var i = 0; i < particles.length; i++) {
        var p1 = particles[i];
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p1.x - p2.x, dy = p1.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > maxDist) continue;
          var alpha = (1 - dist / maxDist) * 0.18;
          var color = '120,120,120';
          if (mouse.active) {
            var dm1 = distance(mouse.x, mouse.y, p1.x, p1.y);
            var dm2 = distance(mouse.x, mouse.y, p2.x, p2.y);
            if (dm1 < 170 || dm2 < 170) { color = '0,255,65'; alpha *= 2; }
          }
          ctx.strokeStyle = 'rgba(' + color + ',' + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];
        var pcolor = '140,140,140';
        var glow = 'rgba(140,140,140,0.05)';
        if (mouse.active) {
          var dm = distance(mouse.x, mouse.y, p.x, p.y);
          if (dm < 170) {
            pcolor = '0,255,65';
            var intensity = 1 - (dm / 170);
            glow = 'rgba(0,255,65,' + (0.12 * intensity) + ')';
          }
        }
        ctx.beginPath();
        ctx.fillStyle = 'rgb(' + pcolor + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x <= 0 || p.x >= w) p.vx *= -1;
        if (p.y <= 0 || p.y >= h) p.vy *= -1;
      }
      if (mouse.active) {
        var gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        gradient.addColorStop(0, 'rgba(0,255,65,0.05)');
        gradient.addColorStop(1, 'rgba(0,255,65,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();
      }
      drawLightning();
      animFrame = requestAnimationFrame(drawParticles);
    }
    var running = false, visible = true;
    function start() { if (!running && visible && !document.hidden) { running = true; animFrame = requestAnimationFrame(drawParticles); } }
    function stop() { if (running) { running = false; cancelAnimationFrame(animFrame); animFrame = 0; } }
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        visible && !document.hidden ? start() : stop();
      }, { threshold: 0 }).observe(canvas);
    }
    var section = canvas.parentElement;
    var finePointer = window.matchMedia('(hover: hover)').matches;
    if (finePointer) {
      section.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
      });
      section.addEventListener('mouseleave', function () { mouse.active = false; mouse.x = -9999; mouse.y = -9999; });
    }
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var kw = w ? canvas.width / w : 1, kh = h ? canvas.height / h : 1;
        resize();
        createParticles();
      }, 250);
    });
    resize();
    createParticles();
    start();
  })();

  /* ---- Typewriter (frases da academy) ---- */
  (function typewriter() {
    var el = document.getElementById('typewriter');
    if (!el) return;
    var phrases = [
      'root@4root:~$ academy --learn --share',
      'root@4root:~$ curso --assitir --praticar',
      'root@4root:~$ trilha --estudar --dominar',
      'root@4root:~$ academy --learn --trilhas',
      'root@4root:~$ ctf --treinar --evoluir',
      'root@4root:~$ nota --estudar --dominar'
    ];
    var phraseIdx = 0, charIdx = 0, isDeleting = false, typeSpeed = 80;
    function typewrite() {
      var current = phrases[phraseIdx];
      if (isDeleting) {
        el.textContent = current.substring(0, charIdx - 1) || '\u00A0';
        charIdx--;
        typeSpeed = 40;
      } else {
        el.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 80;
      }
      if (!isDeleting && charIdx === current.length) { typeSpeed = 2000; isDeleting = true; }
      else if (isDeleting && charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; typeSpeed = 500; }
      setTimeout(typewrite, typeSpeed);
    }
    typewrite();
  })();

  /* ---- Proximity text no hero ---- */
  (function proximity() {
    var wrap = document.getElementById('hero-subtitle-wrap');
    if (!wrap || window.matchMedia('(hover: none)').matches) return;
    var prox = wrap.querySelector('.hero-proximity-text');
    if (!prox) return;
    wrap.addEventListener('mousemove', function (e) {
      var r = wrap.getBoundingClientRect();
      prox.style.setProperty('--mask-x', (e.clientX - r.left) + 'px');
      prox.style.setProperty('--mask-y', (e.clientY - r.top) + 'px');
    });
  })();

  /* ---- Transicao entre paginas (fade-out suave ao navegar) ----
     Intercepta links internos .html e faz a pagina sair com fade antes
     de navegar. Modificadores/abas novas/externos/download ficam de fora. */
  (function pageFx() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.addEventListener('click', function (e) {
      if (reduced || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a');
      if (!a) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') return;
      var u;
      try { u = new URL(href, location.href); } catch (err) { return; }
      if (u.origin !== location.origin) return;
      if (!(u.pathname.endsWith('.html') || u.pathname.endsWith('/'))) return;
      if (u.pathname === location.pathname && u.search === location.search) return; /* so ancora */
      e.preventDefault();
      document.body.classList.add('page-exit');
      setTimeout(function () { location.href = u.href; }, 170);
    });
    /* voltar/avançar do bfcache: remove o fade de saida */
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) document.body.classList.remove('page-exit');
    });
  })();

  /* ---- Animate on scroll ---- */
  (function animOnScroll() {
    var items = document.querySelectorAll('.animate-on-scroll');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (i) { i.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    items.forEach(function (i) {
      /* stagger: cards de uma mesma grade entram em cascata */
      var grid = i.closest('.courses-grid');
      if (grid && !i.dataset.stag) {
        var kids = Array.prototype.slice.call(grid.children);
        i.dataset.stag = '1';
        i.style.transitionDelay = (Math.min(kids.indexOf(i), 5) * 80) + 'ms';
        i.addEventListener('transitionend', function h(ev) {
          if (ev.target !== i) return;
          i.style.transitionDelay = '';
          i.removeEventListener('transitionend', h);
        });
      }
      io.observe(i);
    });
  })();

  /* ==========================================================
     MARKDOWN: tasks, lightbox, youtube, code, mermaid, katex
     Funcoes reutilizaveis: rodam na carga da pagina e de novo no
     conteudo injetado no modal de leitura (initContentIn).
     ========================================================== */

  /* ---- Task list persistente (chave por nota) ---- */
  function tasksIn(root) {
    root.querySelectorAll('.task-box').forEach(function (cb) {
      if (cb.dataset.bound) return;
      cb.dataset.bound = '1';
      var scope = cb.closest('[data-note]');
      var key = '4root-tasks-' + (scope ? scope.getAttribute('data-note') : LESSON_PATH) + '-' + cb.dataset.taskId;
      try {
        if (localStorage.getItem(key) === '1') cb.checked = true;
        if (localStorage.getItem(key) === '0') cb.checked = false;
      } catch (e) {}
      cb.addEventListener('change', function () {
        try { localStorage.setItem(key, cb.checked ? '1' : '0'); } catch (e) {}
      });
    });
  }

  /* ---- YouTube facade ---- */
  function youtubeIn(root) {
    root.querySelectorAll('.yt-embed').forEach(function (el) {
      if (el.dataset.bound) return;
      el.dataset.bound = '1';
      function play() {
        var vid = el.dataset.vid;
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + vid + '?autoplay=1&rel=0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
        el.innerHTML = '';
        el.appendChild(iframe);
        el.classList.add('playing');
      }
      el.addEventListener('click', play);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
    });
  }

  /* ---- Lightbox (overlay global; imagens novas podem ser rebindadas) ---- */
  (function lightboxSetup() {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var lbTimer = null;
    function closeLb() {
      if (!lb.classList.contains('open') || lb.classList.contains('closing')) return;
      lb.classList.add('closing');
      lbTimer = setTimeout(function () {
        lbTimer = null;
        if (lb.classList.contains('closing')) lb.classList.remove('open', 'closing');
      }, 190);
    }
    lb._softOpen = function () {
      if (lbTimer) { clearTimeout(lbTimer); lbTimer = null; }
      lb.classList.remove('closing');
      lb.classList.add('open');
    };
    lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  })();
  function lightboxIn(root) {
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var img = lb.querySelector('img');
    root.querySelectorAll('.markdown-content a.media-zoom img').forEach(function (im) {
      if (im.dataset.lbBound) return;
      im.dataset.lbBound = '1';
      im.addEventListener('click', function (e) {
        e.preventDefault();
        img.src = im.closest('a').href;
        if (lb._softOpen) lb._softOpen(); else lb.classList.add('open');
      });
    });
  }

  /* ---- Code: highlight + label de linguagem ---- */
  var hljsQueue = [], hljsLoading = false;
  function loadHljs(cb) {
    if (window.hljs) { if (cb) cb(); return; }
    if (cb) hljsQueue.push(cb);
    if (hljsLoading) return;
    hljsLoading = true;
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
    s.onload = function () { hljsQueue.splice(0).forEach(function (f) { f(); }); };
    document.head.appendChild(s);
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/base16/gruvbox-dark-hard.min.css';
    document.head.appendChild(link);
  }
  function codeIn(root) {
    root.querySelectorAll('.markdown-content pre').forEach(function (pre) {
      var code = pre.querySelector('code');
      if (!code || pre.querySelector('.code-lang')) return;
      var cls = (code.className.match(/language-([\w+#-]+)/) || [])[1];
      if (cls) {
        var tag = document.createElement('span');
        tag.className = 'code-lang';
        tag.textContent = cls;
        pre.appendChild(tag);
      }
    });
    var codes = root.querySelectorAll('.markdown-content pre code:not(.hl-done)');
    if (!codes.length) return;
    loadHljs(function () {
      codes.forEach(function (c) {
        if (c.classList.contains('hl-done')) return;
        try { window.hljs.highlightElement(c); } catch (e) {}
        c.classList.add('hl-done');
      });
    });
  }

  /* ---- Mermaid (lazy, tema neon 4root) ---- */
  var mermaidQueue = [], mermaidLoading = false, mermaidReady = false;
  function loadMermaid(cb) {
    if (mermaidReady) { if (cb) cb(); return; }
    if (cb) mermaidQueue.push(cb);
    if (mermaidLoading) return;
    mermaidLoading = true;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
    s.onload = function () {
      try {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#0a0a0a',
            primaryTextColor: '#ededed',
            primaryBorderColor: '#00ff41',
            lineColor: '#00ff41',
            secondaryColor: '#0d0d0d',
            tertiaryColor: '#070707',
            fontFamily: 'Sora, sans-serif',
            fontSize: '13px'
          }
        });
        mermaidReady = true;
        mermaidQueue.splice(0).forEach(function (f) { f(); });
      } catch (e) {}
    };
    document.head.appendChild(s);
  }
  function mermaidIn(root) {
    var blocks = Array.prototype.filter.call(
      root.querySelectorAll('.mermaid'),
      function (b) { return !b.getAttribute('data-processed'); });
    if (!blocks.length) return;
    loadMermaid(function () {
      try { window.mermaid.init(undefined, blocks); } catch (e) {}
    });
  }

  /* ---- KaTeX (lazy; carga unica, filas de callbacks) ---- */
  var katexQueue = [], katexLoading = false;
  function mathIn(root) {
    function run() {
      try {
        renderMathInElement(root, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
    if (window.renderMathInElement) { run(); return; }
    katexQueue.push(run);
    if (katexLoading) return;
    katexLoading = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    s.onload = function () {
      var s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
      s2.onload = function () { katexQueue.splice(0).forEach(function (f) { f(); }); };
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }
  function mathInAuto(root) {
    if (root.nodeType === 9) { /* document: usa o gate do build */
      if (body.dataset.math !== '1') return;
      mathIn(root.querySelector('.markdown-content') || body);
    } else {
      mathIn(root);
    }
  }

  /* ---- Runner reutilizavel (exposto p/ o modal) ---- */
  function initContentIn(root) {
    tasksIn(root);
    youtubeIn(root);
    lightboxIn(root);
    codeIn(root);
    mermaidIn(root);
    mathInAuto(root);
  }
  window.__initContent = initContentIn;
  window.__initMath = mathIn;
  initContentIn(document);

  /* ==========================================================
     BUSCA FULL-TEXT (Ctrl+K)
     ========================================================== */
  (function search() {
    var overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    var input = document.getElementById('search-input');
    var resultsBox = document.getElementById('search-body');
    var countEl = document.getElementById('search-count');
    var searchCloseTimer = null;
    var index = null, sel = -1, items = [];

    function normalize(s) {
      return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    function loadIndex(cb) {
      if (index) return cb(index);
      fetch(BASE + '/assets/search-index.json')
        .then(function (r) { return r.json(); })
        .then(function (j) { index = j; cb(j); })
        .catch(function () { index = []; cb(index); });
    }
    function snippet(text, q) {
      var nq = normalize(q);
      var nt = normalize(text);
      var pos = nt.indexOf(nq);
      if (pos < 0) return text.slice(0, 130) + '…';
      var start = Math.max(0, pos - 45);
      var frag = text.slice(start, start + 140);
      var re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      frag = frag.replace(re, '<mark>$&</mark>');
      return (start > 0 ? '…' : '') + frag + (start + 140 < text.length ? '…' : '');
    }
    function run(q) {
      loadIndex(function (idx) {
        resultsBox.innerHTML = '';
        items = [];
        sel = -1;
        var nq = normalize(q.trim());
        if (!nq) { countEl.innerHTML = ''; return; }
        var scored = [];
        for (var i = 0; i < idx.length; i++) {
          var it = idx[i];
          var t = normalize(it.t), c = normalize(it.c || ''), tg = normalize(it.g || '');
          var score = -1;
          if (t === nq) score = 100;
          else if (t.indexOf(nq) === 0) score = 60;
          else if (t.indexOf(nq) >= 0) score = 40;
          else if (tg.indexOf(nq) >= 0) score = 30;
          else if (c.indexOf(nq) >= 0) score = 10;
          if (score >= 0) scored.push({ it: it, score: score });
        }
        scored.sort(function (a, b) { return b.score - a.score; });
        scored = scored.slice(0, 30);
        if (!scored.length) {
          resultsBox.innerHTML = '<div class="sr-empty">Nenhum resultado para <b>\"' +
            q.replace(/</g, '&lt;') + '\"</b> no vault.</div>';
          countEl.innerHTML = '0 resultados';
          return;
        }
        scored.forEach(function (sc) {
          var it = sc.it;
          var a = document.createElement('a');
          a.className = 'sr-item';
          a.href = it.u;
          var frag = sc.score === 30 || !(it.c || '').length ? '' : snippet(it.c, q.trim());
          if (sc.score === 30) frag = '<span class=\"sr-hint\">tag: ' + it.g.split(',')[0] + '</span>';
          a.innerHTML = '<div class=\"sr-title\"><svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 2h8l5 5v15H6z\"/><path d=\"M14 2v5h5\"/></svg>' +
            it.t + '</div><div class=\"sr-path\">' + it.p + '</div>' +
            (frag ? '<div class=\"sr-frag\">' + frag + '</div>' : '');
          a.addEventListener('click', close);
          resultsBox.appendChild(a);
          items.push(a);
        });
        countEl.innerHTML = '<span class=\"sr-hint\">' + scored.length + '</span> resultado(s) para \"' + q.replace(/</g, '&lt;') + '\"';
      });
    }
    function open() {
      if (searchCloseTimer) { clearTimeout(searchCloseTimer); searchCloseTimer = null; }
      overlay.classList.remove('closing');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      input.value = '';
      resultsBox.innerHTML = '';
      countEl.innerHTML = 'digite para buscar em todo o vault';
      setTimeout(function () { input.focus(); }, 50);
    }
    function close() {
      if (!overlay.classList.contains('open') || overlay.classList.contains('closing')) return;
      overlay.classList.add('closing');
      searchCloseTimer = setTimeout(function () {
        searchCloseTimer = null;
        if (overlay.classList.contains('closing')) {
          overlay.classList.remove('open', 'closing');
          /* nao devolve o scroll se o modal de leitura seguir aberto */
          var nm = document.getElementById('note-modal');
          if (!(nm && nm.classList.contains('open'))) document.body.style.overflow = '';
        }
      }, 190);
    }
    document.querySelectorAll('.js-open-search').forEach(function (b) {
      b.addEventListener('click', open);
    });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    var searchCloseBtn = overlay.querySelector('.search-close');
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape') close();
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        sel = e.key === 'ArrowDown' ? Math.min(sel + 1, items.length - 1) : Math.max(sel - 1, 0);
        items.forEach(function (it, i) { it.classList.toggle('sel', i === sel); });
        items[sel].scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter' && sel >= 0) items[sel].click();
    });
    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { run(input.value); }, 160);
    });
    /* tag chips abrem a busca */
    document.querySelectorAll('.tag-chip').forEach(function (chip) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        open();
        input.value = chip.dataset.tag;
        run(chip.dataset.tag);
      });
    });
    /* ?tag= na URL abre a busca preenchida */
    var urlTag = new URLSearchParams(location.search).get('tag');
    if (urlTag) { open(); input.value = urlTag; run(urlTag); }
  })();

  /* ==========================================================
     MODAL DE LEITURA (landing da trilha)
     Cards de topico abrem a anotacao num modal TELA CHEIA: arvore
     completa da trilha na esquerda (ajustavel, recolhivel pelo botao
     de painel e com scroll propio estilo Obsidian), markdown intacto
     na direita. Prev/next e arvore navegam sem sair da trilha; sn-head
     e o X (a direita) voltam para a trilha selecionada.
     ========================================================== */
  (function noteModal() {
    if (PAGETYPE !== 'course') return;
    var modal = document.getElementById('note-modal');
    var tpl = document.getElementById('trilha-tree-tpl');
    if (!modal) return;
    var sideInner = modal.querySelector('.nm-side-inner');
    var article = modal.querySelector('.nm-article');
    var contentEl = document.getElementById('nm-content');
    var LANDING = body.dataset.landing || location.pathname;
    var treeBound = false, cache = {}, loadSeq = 0, nmCloseTimer = null;

    function ensureTree() {
      if (treeBound || !tpl) return;
      var node = tpl.content && tpl.content.firstElementChild;
      if (node) {
        sideInner.appendChild(node.cloneNode(true));
        var sc = sideInner.querySelector('.sn-scroll');
        if (sc) bindTreeNav(sc);
        treeBound = true;
      }
    }
    function setActive(url) {
      sideInner.querySelectorAll('.sn-link.active, a.sn-mod-t.active')
        .forEach(function (a) { a.classList.remove('active'); });
      var matched = null;
      sideInner.querySelectorAll('a[href]').forEach(function (a) {
        if (a.getAttribute('href') === url) matched = a;
      });
      if (!matched) return;
      var p = matched.parentElement;
      while (p && p !== sideInner) {
        if (p.classList && p.classList.contains('sn-node')) p.classList.add('exp');
        p = p.parentElement;
      }
      matched.classList.add('active');
      try { matched.scrollIntoView({ block: 'nearest' }); } catch (e) {}
    }
    function showLoading() {
      article.setAttribute('data-note', '');
      article.innerHTML = '<div class="nm-loading"><span class="dot"></span>' +
        '<span>carregando anota\u00e7\u00e3o\u2026</span></div>';
      contentEl.scrollTop = 0;
    }
    function showError(url) {
      article.innerHTML = '<div class="nm-error"><p><span class="neon-text">[ERRO]</span> ' +
        'n\u00e3o foi poss\u00edvel carregar a anota\u00e7\u00e3o.</p>' +
        '<p>Tente <a href="' + url + '">abrir em uma nova aba</a>.</p></div>';
    }
    function render(url, text) {
      var doc = new DOMParser().parseFromString(text, 'text/html');
      var cont = doc.querySelector('.note-container');
      if (!cont) throw new Error('sem conteudo');
      var math = !!(doc.body && doc.body.dataset && doc.body.dataset.math === '1');
      var clone = cont.cloneNode(true);
      clone.querySelectorAll('.note-crumbs').forEach(function (n) { n.remove(); });
      article.innerHTML = clone.innerHTML;
      article.setAttribute('data-note', url);
      setActive(url);
      contentEl.scrollTop = 0;
      initContentIn(article);
      if (math) mathIn(article);
      /* entrada suave do conteudo a cada troca de nota */
      article.classList.remove('swap-in');
      void article.offsetWidth;
      article.classList.add('swap-in');
      article.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        el.classList.add('visible');
      });
      /* a URL passa a refletir a nota (refresh/compartilhar mantem contexto) */
      try { history.replaceState({ nm: 1 }, '', url); } catch (e) {}
    }
    function load(url) {
      if (cache[url]) { render(url, cache[url]); return; }
      var seq = ++loadSeq;
      showLoading();
      fetch(url)
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
        .then(function (t) {
          if (seq !== loadSeq) return;
          cache[url] = t;
          render(url, t);
        })
        .catch(function () { if (seq === loadSeq) showError(url); });
    }
    function open(url) {
      if (nmCloseTimer) { clearTimeout(nmCloseTimer); nmCloseTimer = null; }
      modal.classList.remove('closing');
      ensureTree();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      load(url);
    }
    function close() {
      if (!modal.classList.contains('open') || modal.classList.contains('closing')) return;
      modal.classList.add('closing');
      if (article.getAttribute('data-note')) {
        try { history.replaceState(null, '', LANDING); } catch (e) {}
      }
      article.setAttribute('data-note', '');
      nmCloseTimer = setTimeout(function () {
        nmCloseTimer = null;
        if (modal.classList.contains('closing')) {
          modal.classList.remove('open', 'closing');
          document.body.style.overflow = '';
        }
      }, 230);
    }
    function isOpen() { return modal.classList.contains('open'); }

    /* botao de painel: ocultar/mostrar o side-nav do modal */
    var sideToggle = modal.querySelector('.nm-side-toggle');
    if (sideToggle) {
      sideToggle.addEventListener('click', function () {
        var hidden = modal.classList.toggle('nm-side-hidden');
        sideToggle.setAttribute('aria-pressed', hidden ? 'true' : 'false');
      });
    }

    /* cards de topico -> abrir modal (click + teclado) */
    document.querySelectorAll('.topic-card[data-open]').forEach(function (card) {
      function go() { open(card.getAttribute('data-open')); }
      card.addEventListener('click', go);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
    });

    /* delegacao dentro do modal */
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-nm-close]')) { e.preventDefault(); close(); return; }
      var link = e.target.closest('a');
      if (!link) return;
      var href = link.getAttribute('href') || '';
      if (link.classList.contains('sn-head')) { e.preventDefault(); close(); return; }
      if (link.classList.contains('sn-link') || link.classList.contains('sn-mod-t')) {
        e.preventDefault();
        load(href);
        return;
      }
      if (link.classList.contains('lf-prev') || link.classList.contains('lf-next')) {
        e.preventDefault();
        load(href);
        return;
      }
      if (link.classList.contains('tag-chip')) {
        e.preventDefault();
        var ov = document.getElementById('search-overlay');
        var inp = document.getElementById('search-input');
        if (ov && inp) {
          ov.classList.add('open');
          inp.value = link.getAttribute('data-tag') || link.textContent.replace('#', '');
          inp.dispatchEvent(new Event('input'));
          setTimeout(function () { inp.focus(); }, 50);
        }
        return;
      }
      /* links externos e ancoras: comportamento padrao */
    });

    document.addEventListener('keydown', function (e) {
      if (isOpen() && e.key === 'Escape') close();
    });
  })();

  /* ==========================================================
     CANVAS: desenhar arestas do board
     ========================================================== */
  (function canvasBoard() {
    var board = document.querySelector('.canvas-board');
    if (!board) return;
    var cv = board.querySelector('canvas.cb-edges');
    var data = board.dataset.edges ? JSON.parse(board.dataset.edges) : [];
    function draw() {
      if (!cv) return;
      var rect = board.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      cv.width = rect.width * dpr;
      cv.height = rect.height * dpr;
      var ctx = cv.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = 'rgba(0,255,65,0.45)';
      ctx.lineWidth = 1;
      data.forEach(function (e) {
        var from = board.querySelector('[data-node-id=\"' + e.from + '\"]');
        var to = board.querySelector('[data-node-id=\"' + e.to + '\"]');
        if (!from || !to) return;
        var r1 = from.getBoundingClientRect(), r2 = to.getBoundingClientRect();
        var x1 = r1.left - rect.left + r1.width / 2, y1 = r1.top - rect.top + r1.height / 2;
        var x2 = r2.left - rect.left + r2.width / 2, y2 = r2.top - rect.top + r2.height / 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        var mx = (x1 + x2) / 2;
        ctx.bezierCurveTo(mx, y1, mx, y2, x2, y2);
        ctx.stroke();
      });
    }
    draw();
    window.addEventListener('resize', draw);
  })();

  /* ano do footer */
  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
