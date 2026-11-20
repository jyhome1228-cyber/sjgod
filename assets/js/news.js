/* Accessible source-grounded news archive: filters, 10 articles/page, disclosure summaries. */
(() => {
  const root=document.getElementById('news-archive');
  if(!root)return;
  const all=window.SJGOD_NEWS||[];
  const year=document.getElementById('news-year');
  const category=document.getElementById('news-category');
  const search=document.getElementById('news-search');
  const count=document.getElementById('news-count');
  const pages=document.getElementById('news-pagination');
  const pageSize=10;
  let currentPage=1;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const makeText=(tag,cls,content)=>{
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    el.textContent=content;
    return el;
  };
  const formatDate=value=>{
    const parts=value.split('-');
    return parts.length===3?parts.map((part,i)=>i===0?part:String(Number(part))).join('. ')+'.':value;
  };
  function createItem(article,index){
    const item=document.createElement('details');
    item.className='news-disclosure';
    const summary=document.createElement('summary');
    summary.className='news-disclosure-title';
    const time=makeText('time','news-disclosure-date','['+formatDate(article.date)+']');
    time.dateTime=article.date;
    const title=makeText('span','news-disclosure-headline',article.title);
    const chevron=makeText('span','news-disclosure-chevron','');
    chevron.setAttribute('aria-hidden','true');
    summary.append(time,title,chevron);
    item.append(summary);
    const content=makeText('div','news-disclosure-content','');
    const media=makeText('div','news-disclosure-media','');
    const photos=Array.isArray(article.images)&&article.images.length?article.images:(article.image?[article.image]:[]);
    photos.forEach((src,i)=>{
      const image=document.createElement('img');
      image.src=src;image.alt=article.title+' 현장 및 관련 자료 '+(i+1);
      image.loading='lazy';image.decoding='async';
      image.addEventListener('error',()=>image.remove(),{once:true});
      media.append(image);
    });
    if(photos.length)content.append(media);
    const body=makeText('div','news-disclosure-body','');
    const meta=makeText('p','news-disclosure-meta',article.publisher+' · '+article.category);
    body.append(meta);
    if(Array.isArray(article.paragraphs) && article.paragraphs.length){
      const paragraphs=makeText('div','news-disclosure-paragraphs','');
      article.paragraphs.forEach(part=>paragraphs.append(makeText('p','news-disclosure-paragraph',part)));
      body.append(paragraphs);
    } else if(article.summary){
      body.append(makeText('p','news-disclosure-summary',article.summary));
    } else {
      body.append(makeText('p','news-disclosure-summary','기사 제목과 발행 정보만 확인되었습니다. 상세 원문 자료를 확보하면 추가하겠습니다.'));
    }
    if(article.url){
      const link=makeText('a','news-disclosure-source','영상·기사 원문 보기');
      link.href=article.url;link.target='_blank';link.rel='noopener noreferrer';
      body.append(link);
    }
    content.append(body);item.append(content);
    return item;
  }
  function filtered(){
    const q=search.value.trim().toLocaleLowerCase('ko');
    return all.filter(item=>
      (year.value==='all'||item.date.startsWith(year.value))&&
      (category.value==='all'||item.category===category.value)&&
      (!q||(item.title+' '+item.publisher+' '+(item.summary||'')).toLocaleLowerCase('ko').includes(q))
    );
  }
  function makePageButton(label,to,selected=false,disabled=false){
    const button=makeText('button','news-page-button',label);
    button.type='button';button.disabled=disabled;
    if(selected){button.classList.add('is-active');button.setAttribute('aria-current','page')}
    button.addEventListener('click',()=>{
      currentPage=to;draw();
      root.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    });
    return button;
  }
  function draw(){
    const data=filtered();
    const totalPages=Math.max(1,Math.ceil(data.length/pageSize));
    currentPage=Math.min(Math.max(currentPage,1),totalPages);
    const start=(currentPage-1)*pageSize;
    const visible=data.slice(start,start+pageSize);
    root.replaceChildren(...visible.map(createItem));
    if(!visible.length)root.append(makeText('p','news-empty','검색 결과가 없습니다. 검색어나 필터를 변경해 주세요.'));
    count.textContent=data.length+' / '+all.length+'건';
    if(!pages)return;
    pages.replaceChildren();
    if(totalPages<=1)return;
    pages.append(makePageButton('이전',currentPage-1,false,currentPage===1));
    const first=Math.max(1,Math.min(currentPage-2,totalPages-4));
    const last=Math.min(totalPages,first+4);
    for(let n=first;n<=last;n++)pages.append(makePageButton(String(n),n,n===currentPage));
    pages.append(makePageButton('다음',currentPage+1,false,currentPage===totalPages));
  }
  [year,category,search].forEach(input=>input?.addEventListener(input===search?'input':'change',()=>{
    currentPage=1;draw();
  }));
  draw();
})();