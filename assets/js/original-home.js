/* Brand-first homepage: accessible media slider, full chronology, news accordion */
(() => {
 const assets=window.SJGOD_ASSETS||[];
 const workIds=[72,24,73,25,74,26,27,28];
 const track=document.getElementById('og-work-track');
 if(track){
   const slideAssets=workIds.map(id=>assets.find(x=>x.id===id)).filter(Boolean);
   slideAssets.forEach((asset,i)=>{
     const figure=document.createElement('figure');
     figure.className='og-work-slide';
     const img=document.createElement('img');
     img.src=asset.url;img.alt='사자가온다 콘텐츠 및 프로젝트 이미지 '+(i+1);
     img.loading=i<4?'eager':'lazy';img.decoding='async';
     figure.append(img);track.append(figure);
   });
   const slides=[...track.children];
   const count=document.getElementById('og-work-count');
   const prev=document.getElementById('og-work-prev');
   const next=document.getElementById('og-work-next');
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   let index=Math.min(2,Math.max(0,slides.length-1));
   let programmatic=false;
   let settleTimer;
   let autoTimer;
   let paused=false;
   const countText=()=>{if(count) count.textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')};
   function centerOn(i,smooth=true){
     if(!slides.length)return;
     index=(i+slides.length)%slides.length;
     const slide=slides[index];
     const left=slide.offsetLeft-track.offsetLeft-(track.clientWidth-slide.clientWidth)/2;
     programmatic=true;
     track.scrollTo({left:Math.max(0,left),behavior:smooth&&!reduced?'smooth':'instant'});
     countText();
     window.clearTimeout(settleTimer);
     settleTimer=window.setTimeout(()=>{programmatic=false},smooth?650:80);
   }
   function resetAuto(){
     window.clearInterval(autoTimer);
     if(reduced||paused||slides.length<2)return;
     autoTimer=window.setInterval(()=>{
       if(document.visibilityState!=='visible'||paused)return;
       centerOn(index+1,true);
     },4600);
   }
   function navigate(delta){centerOn(index+delta,true);resetAuto()}
   prev?.addEventListener('click',()=>navigate(-1));
   next?.addEventListener('click',()=>navigate(1));
   track.addEventListener('scroll',()=>{
     if(programmatic)return;
     const rect=track.getBoundingClientRect();
     const middle=rect.left+rect.width/2;
     let best=0,minimum=Infinity;
     slides.forEach((slide,i)=>{
       const r=slide.getBoundingClientRect();
       const distance=Math.abs(r.left+r.width/2-middle);
       if(distance<minimum){minimum=distance;best=i}
     });
     index=best;countText();
   },{passive:true});
   track.addEventListener('keydown',event=>{
     if(event.key==='ArrowRight'){event.preventDefault();navigate(1)}
     if(event.key==='ArrowLeft'){event.preventDefault();navigate(-1)}
   });
   track.addEventListener('pointerdown',()=>{paused=true;resetAuto()});
   track.addEventListener('pointerup',()=>{paused=false;resetAuto()});
   const area=track.closest('.og-portfolio');
   area?.addEventListener('mouseenter',()=>{paused=true;resetAuto()});
   area?.addEventListener('mouseleave',()=>{paused=false;resetAuto()});
   area?.addEventListener('focusin',()=>{paused=true;resetAuto()});
   area?.addEventListener('focusout',event=>{
     if(area.contains(event.relatedTarget))return;
     paused=false;resetAuto();
   });
   document.addEventListener('visibilitychange',resetAuto);
   window.addEventListener('resize',()=>centerOn(index,false),{passive:true});
   // Start in a balanced central position, with adjacent projects on both sides.
   requestAnimationFrame(()=>{centerOn(index,false);resetAuto()});
 }
 const history=document.getElementById('og-timeline');
 if(history){
  const records=(window.SJGOD_HISTORY||[]).slice().sort((a,b)=>Number(b.year)-Number(a.year));
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
