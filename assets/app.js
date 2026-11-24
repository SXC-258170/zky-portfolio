/* =========================================================
   周珂莹 · 全媒体宣传作品集  |  H5 Interactions
   ========================================================= */
(function () {
  'use strict';

  var body = document.body;
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .page'));
  var progressBar = document.getElementById('progressBar');
  var dotsNav = document.getElementById('dots');
  var fab = document.getElementById('fab');
  var sheet = document.getElementById('sheet');
  var sheetList = document.getElementById('sheetList');
  var sheetClose = document.getElementById('sheetClose');
  var videoModal = document.getElementById('videoModal');
  var videoTitle = document.getElementById('videoTitle');
  var videoClose = document.getElementById('videoClose');
  var player = document.getElementById('player');
  var imgModal = document.getElementById('imgModal');
  var imgFull = document.getElementById('imgFull');
  var imgClose = document.getElementById('imgClose');
  var qrImg = document.getElementById('qrImg');
  var qrPh = document.getElementById('qrPh');

  /* ---------- 进场动效 ---------- */
  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 右侧导航 ---------- */
  sections.forEach(function (sec, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', '跳转到：' + (sec.dataset.nav || '页面'));
    b.innerHTML = '<span>' + (sec.dataset.nav || '') + '</span>';
    b.addEventListener('click', function () { scrollToSection(sec); });
    dotsNav.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsNav.children);

  /* ---------- 目录弹层 ---------- */
  sections.forEach(function (sec, i) {
    var li = document.createElement('li');
    var label = sec.dataset.nav || '页面';
    var a = document.createElement('a');
    a.href = '#' + sec.id;
    a.innerHTML = '<i>' + String(i + 1).padStart(2, '0') + '</i>' + label + '<em>点击跳转</em>';
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      closeSheet();
      scrollToSection(sec);
    });
    li.appendChild(a);
    sheetList.appendChild(li);
  });

  function openSheet() {
    sheet.hidden = false;
    body.classList.add('locked');
  }
  function closeSheet() {
    sheet.hidden = true;
    if (videoModal.hidden && imgModal.hidden) body.classList.remove('locked');
  }
  fab.addEventListener('click', openSheet);
  sheetClose.addEventListener('click', closeSheet);
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closeSheet(); });

  /* ---------- 平滑滚动 ---------- */
  function scrollToSection(sec) {
    var top = sec.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var id = a.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      ev.preventDefault();
      scrollToSection(target);
    });
  });

  /* ---------- 滚动进度 / 当前页 ---------- */
  var ticking = false;
  var lastActive = -1;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var p = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
    progressBar.style.width = (p * 100).toFixed(2) + '%';

    if (y > 80) body.classList.add('scrolled');
    else body.classList.remove('scrolled');

    var mid = y + window.innerHeight * 0.42;
    var active = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= mid) active = i;
    }
    if (active !== lastActive) {
      dots.forEach(function (d, i) { d.classList.toggle('active', i === active); });
      lastActive = active;
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 视频弹层 ---------- */
  var currentSrc = null;

  function openVideo(src, title) {
    currentSrc = src;
    videoTitle.textContent = title || '';
    player.src = src;
    videoModal.hidden = false;
    body.classList.add('locked');
    var p = player.play();
    if (p && p.catch) p.catch(function () { /* 需要用户再次点击播放 */ });
  }

  function closeVideo() {
    player.pause();
    player.removeAttribute('src');
    player.load();
    videoModal.hidden = true;
    if (sheet.hidden && imgModal.hidden) body.classList.remove('locked');
    currentSrc = null;
  }

  document.querySelectorAll('[data-video]').forEach(function (el) {
    var open = function (e) {
      if (e.target.closest('a')) return;
      openVideo(el.dataset.video, el.dataset.title || '');
    };
    el.addEventListener('click', open);
    if (el.getAttribute('tabindex') !== null && el.tagName !== 'BUTTON') {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(e);
        }
      });
    }
  });
  videoClose.addEventListener('click', closeVideo);
  videoModal.addEventListener('click', function (e) { if (e.target === videoModal) closeVideo(); });

  /* ---------- 图片放大 ---------- */
  document.querySelectorAll('[data-full]').forEach(function (el) {
    el.addEventListener('click', function () {
      imgFull.src = el.dataset.full;
      imgModal.hidden = false;
      body.classList.add('locked');
    });
  });
  function closeImg() {
    imgModal.hidden = true;
    imgFull.removeAttribute('src');
    if (sheet.hidden && videoModal.hidden) body.classList.remove('locked');
  }
  imgClose.addEventListener('click', closeImg);
  imgModal.addEventListener('click', function (e) { if (e.target === imgModal) closeImg(); });

  /* ---------- 键盘 ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!videoModal.hidden) closeVideo();
      else if (!imgModal.hidden) closeImg();
      else if (!sheet.hidden) closeSheet();
    }
  });

  /* ---------- 二维码占位 ---------- */
  if (qrImg) {
    var finish = function () {
      if (qrImg.naturalWidth > 0) qrPh.style.display = 'none';
    };
    if (qrImg.complete) finish();
    qrImg.addEventListener('load', finish);
    qrImg.addEventListener('error', function () {
      qrImg.style.display = 'none';
      qrPh.textContent = '二维码图片未就绪';
    });
  }
})();
