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


/* Route loading indicator. It only appears during internal page navigation;
   external URLs, anchors, downloads, new tabs and modified clicks are untouched. */
(() => {
  if (!document.body) return;
  const overlay = document.createElement('div');
  overlay.innerHTML = "<div class=\"sj-page-loader\" id=\"sj-page-loader\" role=\"status\" aria-live=\"polite\" aria-label=\"페이지 이동 중\">\n  <div class=\"sj-page-loader-inner\">\n    <svg viewBox=\"0 0 560 310\" fill=\"currentColor\" fill-rule=\"evenodd\" aria-hidden=\"true\"><path d=\"M216 229L220 238L242 239L243 264L240 276L277 300L307 277L312 266L315 238L343 237L345 225L336 220L301 218L295 230L297 266L256 264L261 238L265 236L262 234L266 233L265 223L224 218L218 221Z \"/><path d=\"M274 289L280 288L276 291Z \"/><path d=\"M4 277L6 287L16 290L46 286L168 286L171 283L168 268L176 242L202 204L222 185L246 171L283 164L331 176L349 186L366 202L377 218L391 267L386 275L389 289L514 291L547 289L551 286L550 275L541 271L495 273L404 268L393 227L374 192L346 169L314 156L290 151L265 152L246 157L214 176L176 218L160 248L154 268L36 266L6 271Z \"/><path class=\"sj-loader-ray\" style=\"--page:0\" d=\"M15 196L18 197L15 199L18 200L15 202L15 209L22 215L54 221L120 245L127 239L126 229L71 206L32 193L19 193Z \"/><path class=\"sj-loader-ray\" style=\"--page:1\" d=\"M54 124L58 134L90 161L143 194L151 187L151 181L134 165L81 128L72 125L65 118L60 118Z \"/><path class=\"sj-loader-ray\" style=\"--page:2\" d=\"M111 60L108 70L116 77L118 87L134 109L181 156L189 151L189 142L174 119L158 103L161 102L153 94L151 87L122 55Z \"/><path class=\"sj-loader-ray\" style=\"--page:3\" d=\"M191 21L186 26L186 33L203 88L228 140L238 140L242 135L241 122L222 61L202 20Z \"/><path class=\"sj-loader-ray\" style=\"--page:4\" d=\"M275 6L270 9L267 37L269 128L279 130L284 126L284 29L287 10Z\"/><path class=\"sj-loader-ray\" style=\"--page:5\" d=\"M361 14L354 19L343 45L342 58L320 133L323 131L323 136L332 137L342 117L354 82L355 68L362 56L372 23L370 18Z \"/><path class=\"sj-loader-ray\" style=\"--page:6\" d=\"M436 59L434 61L427 55L421 59L398 110L372 157L379 164L384 163L394 151L417 113L439 61Z \"/><path class=\"sj-loader-ray\" style=\"--page:7\" d=\"M493 123L487 121L439 151L406 178L400 191L410 194L422 179L470 144L492 132L495 128Z \"/><path class=\"sj-loader-ray\" style=\"--page:8\" d=\"M531 193L524 191L463 209L427 224L421 231L426 240L457 227L529 204L533 200Z \"/></svg>\n    <span class=\"sj-page-loader-dots\" aria-hidden=\"true\"><i></i><i></i><i></i></span>\n    <span class=\"sj-page-loader-caption\">페이지 이동 중</span>\n  </div>\n</div>";
  const loader = overlay.firstElementChild;
  document.body.append(loader);
  let navigating = false;
  const hide = () => {
    navigating = false;
    loader.classList.remove('is-active');
  };
  window.addEventListener('pageshow', hide);
  window.addEventListener('pagehide', hide);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || link.target === '_blank') return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
    let target;
    try { target = new URL(link.href, window.location.href); } catch (_) { return; }
    if (target.origin !== window.location.origin || !/\/(?:[^/]+\.html|)$/.test(target.pathname)) return;
    if (target.pathname === window.location.pathname && target.search === window.location.search) return;
    if (navigating) { event.preventDefault(); return; }
    event.preventDefault();
    navigating = true;
    loader.classList.add('is-active');
    // Give the overlay one paint before navigation. No artificial loading delay.
    requestAnimationFrame(() => requestAnimationFrame(() => window.location.assign(target.href)));
  }, true);
})();
