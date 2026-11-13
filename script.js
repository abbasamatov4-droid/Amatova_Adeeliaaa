'use strict';
 
/* ================= НАСТРОЙКИ (меняйте здесь) ================= */
const CONFIG = {
  // Ссылка на Telegram-аккаунт: @Adeeliaaa.
  // Так номер телефона в чате не виден.
  telegram: 'https://t.me/Adeeliaaa'
};
 
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
/* ================= Preloader ================= */
window.addEventListener('load', () => {
  setTimeout(() => $('#preloader').classList.add('hide'), 700);
});
 
/* ================= Header, progress, to-top ================= */
const header = $('#header');
const progress = $('#progress');
const toTop = $('#toTop');
 
function onScroll() {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  header.classList.toggle('scrolled', y > 30);
  progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  toTop.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
 
/* ================= Mobile menu ================= */
const burger = $('#burger');
const nav = $('#nav');
function toggleMenu(force) {
  const open = force ?? !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', () => toggleMenu());
$$('#nav a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
 
/* ================= Reveal on scroll (с задержкой-каскадом) ================= */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children].filter(c => c.classList.contains('reveal'));
      const i = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (i * 90) + 'ms';
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => revealObs.observe(el));
 
/* ================= Счётчики ================= */
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.count;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObs.unobserve(el);
  });
}, { threshold: 0.6 });
$$('[data-count]').forEach(el => countObs.observe(el));
 
/* ================= 3D-наклон книги за мышкой ================= */
const scene = $('#bookScene');
const book = $('.book');
if (scene && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  const hero = $('.hero');
  hero.addEventListener('mousemove', (e) => {
    const r = scene.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    book.style.animation = 'none';
    book.style.transform = `rotateY(${-28 + x * 40}deg) rotateX(${6 - y * 30}deg)`;
  });
  hero.addEventListener('mouseleave', () => {
    book.style.transform = '';
    book.style.animation = '';
  });
}
 
/* ================= Подсветка карточек за курсором ================= */
$$('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});
 
/* ================= Звёзды на фоне (canvas) ================= */
(function stars() {
  const canvas = $('#stars');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  let w, h, dots = [];
 
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(90, Math.floor((w * h) / 18000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      s: Math.random() * 0.25 + 0.05,
      a: Math.random() * Math.PI * 2
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach(d => {
      d.a += 0.02;
      d.y -= d.s;
      if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
      ctx.globalAlpha = 0.25 + Math.abs(Math.sin(d.a)) * 0.6;
      ctx.fillStyle = '#d4af6a';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', resize);
  resize();
  draw();
})();
 
/* ================= Toast ================= */
const toast = $('#toast');
let toastTimer;
function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
 
/* ================= Кнопка Telegram ================= */
const tgBtn = $('#tgBtn');
tgBtn.href = CONFIG.telegram;
tgBtn.addEventListener('click', (e) => {
  if (CONFIG.telegram.includes('USERNAME')) {
    e.preventDefault();
    showToast('script.js ичинде Telegram username жазыңыз');
  }
});
 
/* ================= Мелочи ================= */
$('#year').textContent = new Date().getFullYear();
 
// Закрытие остальных FAQ при открытии одного
$$('.faq__item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) $$('.faq__item').forEach(o => { if (o !== item) o.open = false; });
  });
});