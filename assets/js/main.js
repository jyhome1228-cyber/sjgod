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
