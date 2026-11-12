(() => {
  const assets = window.SJGOD_ASSETS || [];
  const find = id => assets.find(item => item.id === Number(id));
  const makeImage = (asset, group, index) => {
    const figure = document.createElement('figure');
    figure.className = 'media-tile media-' + group;
    const img = document.createElement('img');
    img.src = asset.url;
    img.alt = group === 'partners' ? '사자가온다 협력 기관 및 파트너 이미지 ' + (index+1) : group === 'proof' ? '인증 및 특허 자료 ' + (index+1) : group === 'works' ? '사자가온다 제품 및 프로젝트 이미지 ' + (index+1) : '사자가온다 ' + (group === 'growth' ? '성장 활동' : '콘텐츠 및 제품') + ' 이미지 ' + (index+1);
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => figure.classList.add('image-error'), {once:true});
    figure.append(img);
    return figure;
  };
  const hero = find(1);
  if (hero) {
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
      heroElement.style.backgroundImage = 'linear-gradient(90deg,rgba(7,17,23,.75) 0%,rgba(7,17,23,.24) 75%),url("' + hero.url + '")';
      heroElement.classList.add('has-hero-image');
    }
  }
  const lion = find(2);
  if (lion) {
    const lionElement = document.querySelector('[data-image-id="2"]');
    if(lionElement) lionElement.style.backgroundImage = 'url("' + lion.url + '")';
  }
  document.querySelectorAll('[data-gallery]').forEach(container => {
    const group = container.dataset.gallery;
    const items = assets.filter(asset => asset.group === group);
    const frag = document.createDocumentFragment();
    items.forEach((asset,index) => frag.append(makeImage(asset,group,index)));
    container.replaceChildren(frag);
  });
})();