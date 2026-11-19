const header = document.getElementById('site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-menu');
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
function syncHeader() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
}
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });
function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '메뉴 열기');
  header?.classList.remove('menu-open');
}
menuToggle?.addEventListener('click', () => {
  if (!mobileNav) return;
  const nextOpen = mobileNav.hidden;
  mobileNav.hidden = !nextOpen;
  menuToggle.setAttribute('aria-expanded', String(nextOpen));
  menuToggle.setAttribute('aria-label', nextOpen ? '메뉴 닫기' : '메뉴 열기');
  header?.classList.toggle('menu-open', nextOpen);
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

/* Lightweight scroll reveal; elements remain visible without JS or with reduced motion. */
document.addEventListener('DOMContentLoaded', () => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [...document.querySelectorAll(
    '.og-timeline-year, .company-history .history-item, .og-portfolio h2, .og-statement h2, .sh-section-head, .og-news-top, .sh-history-layout'
  )];
  if (!items.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -35px 0px' });
  items.forEach(el => {
    el.classList.add('motion-reveal');
    observer.observe(el);
  });
});
