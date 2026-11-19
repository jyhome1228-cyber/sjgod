/* Brand-first homepage: accessible media slider, full chronology, news accordion */
(() => {
 const assets=window.SJGOD_ASSETS||[];
 const workIds=[72,24,73,25,74,26,27,28];
 const track=document.getElementById('og-work-track');
 if(track){
   workIds.forEach((id,i)=>{
     const asset=assets.find(x=>x.id===id);if(!asset)return;
     const figure=document.createElement('figure');figure.className='og-work-slide';
     const img=document.createElement('img');img.src=asset.url;img.alt='사자가온다의 콘텐츠 및 프로젝트 이미지 '+(i+1);img.loading='lazy';img.decoding='async';
     figure.append(img);track.append(figure);
   });
   let index=0;const slides=[...track.children],count=document.getElementById('og-work-count');
   function move(n){index=(n+slides.length)%slides.length;slides[index].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest',inline:'center'});count.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')}
   document.getElementById('og-work-prev')?.addEventListener('click',()=>move(index-1));
   document.getElementById('og-work-next')?.addEventListener('click',()=>move(index+1));
   track.addEventListener('scroll',()=>{const viewport=track.getBoundingClientRect();let best=0,min=Infinity;slides.forEach((el,i)=>{let d=Math.abs((el.getBoundingClientRect().left+el.clientWidth/2)-(viewport.left+viewport.width/2));if(d<min){min=d;best=i}});index=best;count.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')},{passive:true});
   track.tabIndex=0;track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(index+1)}if(e.key==='ArrowLeft'){e.preventDefault();move(index-1)}});
 }
 const history=document.getElementById('og-timeline');
 if(history){
  const records=(window.SJGOD_HISTORY||[]).slice().sort((a,b)=>Number(a.year)-Number(b.year));
  records.forEach(record=>{
    const article=document.createElement('article');article.className='og-timeline-year';
    const year=document.createElement('h3');year.textContent=record.year;
    const list=document.createElement('ul');record.items.forEach(item=>{const li=document.createElement('li');li.textContent=item;list.append(li)});
    article.append(year,list);history.append(article);
  });
 }
 const news=document.getElementById('og-news-list');
 if(news){
  (window.SJGOD_NEWS||[]).slice(0,12).forEach((article,i)=>{
   const el=document.createElement('details');el.className='og-news-item';
   const sum=document.createElement('summary');
   const date=document.createElement('time');date.dateTime=article.date;date.textContent='['+article.date.replaceAll('-','. ')+'.]';
   const t=document.createElement('span');t.textContent=article.title;
   const arrow=document.createElement('span');arrow.className='og-news-chevron';arrow.setAttribute('aria-hidden','true');
   sum.append(date,t,arrow);
   const body=document.createElement('div');body.className='og-news-body';
   const pub=document.createElement('p');pub.textContent=article.publisher+' · '+article.category;
   const link=document.createElement('a');link.href=article.url||'news.html';link.textContent=article.url?'기사 원문 확인':'전체 소식에서 보기';
   if(article.url){link.target='_blank';link.rel='noopener noreferrer'}
   body.append(pub,link);el.append(sum,body);news.append(el);
  });
 }
})();
