(() => {
  const intro = document.getElementById('lion-intro');
  if (!intro) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let alreadyViewed = false;
  try { alreadyViewed = sessionStorage.getItem('sjgod-lion-intro-v3') === 'seen'; } catch (_) {}
  if (reduced || alreadyViewed) { intro.remove(); return; }
  const close = () => {
    if (intro.classList.contains('is-ending')) return;
    intro.classList.add('is-ending');
    try { sessionStorage.setItem('sjgod-lion-intro-v3', 'seen'); } catch (_) {}
    window.setTimeout(() => intro.remove(), 620);
  };
  intro.querySelector('#lion-intro-skip')?.addEventListener('click', close);
  intro.addEventListener('keydown', event => { if(event.key === 'Escape') close(); });
  window.setTimeout(close, 2850);
})();