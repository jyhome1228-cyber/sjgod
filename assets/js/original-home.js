/* Brand-first homepage: accessible media slider, full chronology, news accordion */
(() => {
 const assets=window.SJGOD_ASSETS||[];
 const workIds=[72,24,73,25,74,26,27,28];
 const track=document.getElementById('og-work-track');
 if(track){
   const works=workIds.map(id=>assets.find(item=>item.id===id)).filter(Boolean);
   const count=document.getElementById('og-work-count');
   const prev=document.getElementById('og-work-prev');
   const next=document.getElementById('og-work-next');
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   const total=works.length;
   const imagesPerSet=total;
   const renderSlide=(asset,i,cloned)=>{
     const figure=document.createElement('figure');
     figure.className='og-work-slide';
     if(cloned)figure.setAttribute('aria-hidden','true');
     const img=document.createElement('img');
     img.src=asset.url;
     img.alt=cloned?'':'사자가온다 콘텐츠 및 프로젝트 이미지 '+(i+1);
     img.loading=i<4?'eager':'lazy';
     img.decoding='async';
     figure.append(img);
     return figure;
   };
   // Three consecutive identical sets: jump by one set without any visible seam.
   for(let group=0;group<3;group++)works.forEach((asset,i)=>track.append(renderSlide(asset,i,group!==1)));
   const slides=[...track.children];
   let cycle=0, frameId=0, lastFrame=0, paused=false, interactionUntil=0;
   let currentIndex=0, indicatorFrame=0;
   const getCycle=()=>slides[imagesPerSet]?.offsetLeft-slides[0]?.offsetLeft||0;
   const normalise=()=>{
     if(!cycle)return;
     const x=track.scrollLeft;
     if(x>=cycle*2)track.scrollLeft=x-cycle;
     else if(x<cycle)track.scrollLeft=x+cycle;
   };
   const updateCounter=()=>{
     if(!total||!count)return;
     const middle=track.getBoundingClientRect().left+track.clientWidth/2;
     let closest=0,nearest=Infinity;
     for(let i=total;i<total*2;i++){
       const rect=slides[i].getBoundingClientRect();
       const distance=Math.abs(rect.left+rect.width/2-middle);
       if(distance<nearest){nearest=distance;closest=i-total}
     }
     currentIndex=closest;
     count.textContent=String(currentIndex+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
   };
   const onScroll=()=>{
     if(indicatorFrame)cancelAnimationFrame(indicatorFrame);
     indicatorFrame=requestAnimationFrame(()=>{normalise();updateCounter();indicatorFrame=0});
   };
   track.addEventListener('scroll',onScroll,{passive:true});
   const tick=timestamp=>{
     if(lastFrame&&!reduced&&!paused&&timestamp>=interactionUntil&&document.visibilityState==='visible'){
       const dt=Math.min(timestamp-lastFrame,45);
       track.scrollLeft+=dt*.045; // About 45px per second; continuous, no timed jumps.
       normalise();
     }
     lastFrame=timestamp;
     frameId=requestAnimationFrame(tick);
   };
   const navigate=direction=>{
     if(!cycle)return;
     interactionUntil=performance.now()+2000;
     const step=(slides[total+1]?.offsetLeft-slides[total]?.offsetLeft)||330;
     normalise();
     track.scrollBy({left:direction*step,behavior:reduced?'instant':'smooth'});
   };
   prev?.addEventListener('click',()=>navigate(-1));
   next?.addEventListener('click',()=>navigate(1));
   track.addEventListener('keydown',e=>{
     if(e.key==='ArrowRight'){e.preventDefault();navigate(1)}
     if(e.key==='ArrowLeft'){e.preventDefault();navigate(-1)}
   });
   const area=track.closest('.og-portfolio');
   area?.addEventListener('mouseenter',()=>{paused=true});
   area?.addEventListener('mouseleave',()=>{paused=false;interactionUntil=performance.now()+700});
   area?.addEventListener('focusin',()=>{paused=true});
   area?.addEventListener('focusout',e=>{if(!area.contains(e.relatedTarget)){paused=false;interactionUntil=performance.now()+700}});
   track.addEventListener('pointerdown',()=>{paused=true});
   track.addEventListener('pointerup',()=>{paused=false;interactionUntil=performance.now()+1400});
   track.addEventListener('pointercancel',()=>{paused=false});
   window.addEventListener('resize',()=>{
     const oldCycle=cycle;
     cycle=getCycle();
     if(cycle&&oldCycle)track.scrollLeft+=cycle-oldCycle;
     else if(cycle)track.scrollLeft=cycle;
     updateCounter();
   },{passive:true});
   document.addEventListener('visibilitychange',()=>{lastFrame=0});
   window.addEventListener('pagehide',()=>{cancelAnimationFrame(frameId)});
   requestAnimationFrame(()=>{
     cycle=getCycle();
     if(cycle){
       const featured=slides[total+2] || slides[total];
       track.scrollLeft=featured.offsetLeft-track.offsetLeft-(track.clientWidth-featured.clientWidth)/2;
       normalise();
       updateCounter();
       frameId=requestAnimationFrame(tick);
     }
   });
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
  (window.SJGOD_NEWS||[]).slice(0,3).forEach((article,i)=>{
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
