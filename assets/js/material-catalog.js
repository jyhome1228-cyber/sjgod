/* Materials catalog based on supplied visual thumbnails.
   Product metadata is provisional; official Q-shop remains source for purchases.
   No individual product URLs are invented. */
(() => {
 const assets=(window.SJGOD_ASSETS||[]).filter(a=>a.group==='products');
 const cardsRoot=document.getElementById('material-card-grid');
 const featured=[
  {id:24,name:'진로 워크북',category:'workbook',categoryLabel:'교재·워크북',summary:'진로 탐색을 위한 활동 자료',detail:'학생의 생각을 기록하고 진로 수업에 활용하는 교재 이미지'},
  {id:25,name:'Catch My Dream',category:'game',categoryLabel:'교구·게임',summary:'진로 탐색을 위한 활동형 콘텐츠',detail:'진로교육 현장에서 체험 활동과 함께 활용하는 교육 콘텐츠'},
  {id:26,name:'MyC',category:'workbook',categoryLabel:'교재·워크북',summary:'나를 알아가는 진로활동 자료',detail:'자기이해와 진로 탐색 활동에 활용하는 교육 자료'},
  {id:27,name:'Merge Paper Cube',category:'game',categoryLabel:'교구·게임',summary:'참여형 페이퍼 큐브 교구',detail:'직접 만들고 참여하는 활동형 교육 콘텐츠'},
  {id:28,name:'PLANQ',category:'workbook',categoryLabel:'교재·워크북',summary:'학습과 진로 계획을 위한 콘텐츠',detail:'학교 진로활동 및 계획 수립과 연계하는 자료'},
  {id:29,name:'Mayfly',category:'game',categoryLabel:'교구·게임',summary:'체험 중심의 교육 콘텐츠',detail:'수업에서 활용하는 참여형 교육 콘텐츠'},
  {id:30,name:"What's Going On?",category:'book',categoryLabel:'도서',summary:'사자가온다의 출판 콘텐츠',detail:'교육과 탐색을 연결하는 도서·출판 콘텐츠'},
  {id:31,name:'우리보드판',category:'game',categoryLabel:'교구·게임',summary:'교실에서 활용하는 참여형 보드 교구',detail:'학생 참여와 생각 나누기를 위한 교육 활동 자료'}
 ];
 const byId=new Map(assets.map(a=>[a.id,a]));
 const verified=featured.filter(item=>byId.has(item.id));
 const extra=assets.filter(a=>!featured.some(item=>item.id===a.id)).map((asset,i)=>({id:asset.id,name:'교육 콘텐츠 이미지 '+String(i+9).padStart(2,'0'),category:'unclassified',categoryLabel:'추가 자료',summary:'사자가온다 교육 콘텐츠 아카이브',detail:'제품명·분류 및 상세 구성은 Q샵에서 확인해 주세요.'}));
 const all=[...verified,...extra];
 function createCard(data){
  const article=document.createElement('article');
  article.className='material-product-card';
  article.dataset.category=data.category;
  const figure=document.createElement('div');figure.className='material-product-media';
  const img=document.createElement('img');img.src=byId.get(data.id).url;img.alt=data.name+' 이미지';img.loading='lazy';img.decoding='async';
  img.addEventListener('error',()=>{figure.classList.add('has-image-error');img.alt='이미지 확인 필요'});
  figure.append(img);
  const body=document.createElement('div');body.className='material-product-body';
  const label=document.createElement('p');label.className='material-product-category';label.textContent=data.categoryLabel;
  const heading=document.createElement('h3');heading.textContent=data.name;
  const lead=document.createElement('p');lead.className='material-product-summary';lead.textContent=data.summary;
  const detail=document.createElement('p');detail.className='material-product-detail';detail.textContent=data.detail;
  const link=document.createElement('a');link.href='https://q-shop.kr/';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Q샵에서 확인하기';
  body.append(label,heading,lead,detail,link);article.append(figure,body);
  return article;
 }
 if(cardsRoot){
  const buttons=[...document.querySelectorAll('[data-material-filter]')];
  function filter(category){
   cardsRoot.replaceChildren(...all.filter(a=>category==='all'||a.category===category).map(createCard));
   buttons.forEach(btn=>{const active=btn.dataset.materialFilter===category;btn.classList.toggle('is-active',active);btn.setAttribute('aria-pressed',String(active))});
   if(!cardsRoot.children.length){const p=document.createElement('p');p.className='material-empty';p.textContent='현재 확인된 이미지가 없습니다. Q샵에서 전체 상품을 확인해 주세요.';cardsRoot.append(p)}
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>filter(btn.dataset.materialFilter)));
  filter('all');
 }
 const archive=document.querySelector('[data-archive-image="24"]');
 if(archive){
  const asset=byId.get(24);
  if(asset){const img=document.createElement('img');img.src=asset.url;img.alt='교육 콘텐츠 대표 이미지';img.loading='lazy';archive.append(img)}
 }
})();